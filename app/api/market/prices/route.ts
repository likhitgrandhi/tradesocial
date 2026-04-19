import { NextResponse } from "next/server"

import { getPriceCache } from "@/lib/market/prices/cache"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get("symbols")?.trim() ?? ""
  const symbols = raw
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  if (symbols.length === 0) {
    return NextResponse.json({ quotes: {} })
  }
  if (symbols.length > 100) {
    return NextResponse.json({ error: "too many symbols" }, { status: 400 })
  }

  const cache = getPriceCache()
  const quotes = await cache.getQuotes(symbols)
  return NextResponse.json({ quotes })
}
