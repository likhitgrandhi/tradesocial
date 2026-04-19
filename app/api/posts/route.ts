import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { createPostSchema } from "@/lib/posts/schema"
import { getPost, insertPost } from "@/lib/posts/queries"
import { stitchLivePrices } from "@/lib/posts/hydrate"
import { checkRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const limit = checkRateLimit(`post:${session.userId}`, 10, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: limit.retryAfterMs },
      { status: 429 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const parsed = createPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const id = await insertPost({
      user_id: session.userId,
      body: parsed.data.body,
      trade_id: parsed.data.trade_id,
      parent_post_id: parsed.data.parent_post_id,
    })
    const post = await getPost(session.userId, id)
    if (!post) {
      return NextResponse.json({ error: "insert_failed" }, { status: 500 })
    }
    const [hydrated] = await stitchLivePrices([post])
    return NextResponse.json({ post: hydrated }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "insert_failed"
    const status =
      message === "parent_not_found" || message === "trade_not_found"
        ? 404
        : message === "trade_forbidden"
          ? 403
          : message === "reply_depth_exceeded" || message === "parent_deleted"
            ? 400
            : 500
    return NextResponse.json({ error: message }, { status })
  }
}
