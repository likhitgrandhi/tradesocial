import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getProfileByUsername } from "@/lib/profiles/queries"
import { listUserPosts } from "@/lib/posts/queries"
import { decodeCursor, encodeCursor } from "@/lib/posts/types"
import { stitchLivePrices } from "@/lib/posts/hydrate"

export const runtime = "nodejs"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const { username } = await params
  const profile = await getProfileByUsername(username)
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  const url = new URL(request.url)
  const cursor = decodeCursor(url.searchParams.get("cursor"))
  const limitRaw = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT))

  const { items, nextCursor } = await listUserPosts(session.userId, profile.id, cursor, limit)
  const hydrated = await stitchLivePrices(items)
  return NextResponse.json({
    items: hydrated,
    nextCursor: nextCursor ? encodeCursor(nextCursor) : null,
  })
}
