import { NextResponse } from "next/server"

import { searchCatalog } from "@/lib/market/symbols-catalog"

export type SymbolSuggestion = {
  symbol: string
  fullName: string
  description: string
  exchange: string
  type: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")?.trim() ?? ""

  if (!q) {
    return NextResponse.json({ symbols: [] })
  }

  const matches = searchCatalog(q, 10)

  const symbols: SymbolSuggestion[] = matches.map((entry) => ({
    symbol: entry.symbol,
    fullName: entry.symbol,
    description: entry.name,
    exchange: entry.exchange,
    type: entry.type,
  }))

  return NextResponse.json({ symbols })
}
