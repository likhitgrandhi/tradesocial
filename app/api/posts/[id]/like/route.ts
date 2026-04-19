import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { getLikeCount, likePost, unlikePost } from "@/lib/posts/queries"
import { checkRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const limit = checkRateLimit(`like:${session.userId}`, 60, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: limit.retryAfterMs },
      { status: 429 }
    )
  }

  const { id } = await params
  try {
    await likePost(id, session.userId)
    const count = await getLikeCount(id)
    return NextResponse.json({ liked: true, like_count: count })
  } catch (err) {
    const message = err instanceof Error ? err.message : "like_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    await unlikePost(id, session.userId)
    const count = await getLikeCount(id)
    return NextResponse.json({ liked: false, like_count: count })
  } catch (err) {
    const message = err instanceof Error ? err.message : "unlike_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
