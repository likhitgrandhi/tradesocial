import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { createTradeSchema } from "@/lib/trades/schema"
import { insertTrade, listTrades } from "@/lib/trades/queries"
import { resolveSymbol } from "@/lib/market/prices/symbol-map"
import type { TradeStatus } from "@/lib/trades/types"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const statusParam = searchParams.get("status")
  const status: TradeStatus | undefined =
    statusParam === "open" || statusParam === "closed" ? statusParam : undefined

  const trades = await listTrades(session.userId, status)
  return NextResponse.json({ trades })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const parsed = createTradeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const input = parsed.data
  const resolved = resolveSymbol(input.symbol)
  const entryAt = input.entry_at ?? new Date().toISOString()

  try {
    const trade = await insertTrade({
      user_id: session.userId,
      symbol: resolved.symbol,
      provider_symbol: resolved.providerSymbol,
      asset_type: resolved.assetType,
      currency: resolved.currency,
      side: input.side,
      quantity: input.quantity,
      entry_price: input.entry_price,
      entry_at: entryAt,
      exit_price: null,
      exit_at: null,
      realized_pnl: null,
      fees: input.fees,
      notes: input.notes ?? null,
      source: "manual",
      status: "open",
      metadata: input.metadata ?? {},
    })
    return NextResponse.json({ trade }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "insert_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
