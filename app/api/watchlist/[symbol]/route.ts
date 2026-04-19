import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { removeFromWatchlist } from "@/lib/watchlist/queries"

export const runtime = "nodejs"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const { symbol } = await params
  await removeFromWatchlist(session.userId, decodeURIComponent(symbol))
  return NextResponse.json({ ok: true })
}
