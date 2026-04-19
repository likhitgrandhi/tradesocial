import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { listWatchlist, addToWatchlist } from "@/lib/watchlist/queries"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  const symbols = await listWatchlist(session.userId)
  return NextResponse.json({ symbols })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session.userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 })

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const symbol = (body as Record<string, unknown>)?.symbol
  if (typeof symbol !== "string" || !symbol.trim()) {
    return NextResponse.json({ error: "symbol required" }, { status: 400 })
  }

  await addToWatchlist(session.userId, symbol.trim().toUpperCase())
  return NextResponse.json({ ok: true }, { status: 201 })
}
