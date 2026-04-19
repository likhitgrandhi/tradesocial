import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { listFeed } from "@/lib/posts/queries"
import { decodeCursor, encodeCursor, type FeedScope } from "@/lib/posts/types"
import { stitchLivePrices } from "@/lib/posts/hydrate"

export const runtime = "nodejs"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export async function GET(request: Request) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const url = new URL(request.url)
  const scopeParam = url.searchParams.get("scope")
  const scope: FeedScope = scopeParam === "following" ? "following" : "for-you"
  const cursor = decodeCursor(url.searchParams.get("cursor"))
  const limitRaw = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT))

  const { items, nextCursor } = await listFeed(session.userId, scope, cursor, limit)
  const hydrated = await stitchLivePrices(items)
  return NextResponse.json({
    items: hydrated,
    nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
    scope,
  })
}
