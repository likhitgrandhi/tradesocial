import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { closeTradeSchema } from "@/lib/trades/schema"
import { closeTrade, listTrades } from "@/lib/trades/queries"
import { computePnl } from "@/lib/trades/pnl"

export const runtime = "nodejs"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const parsed = closeTradeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const open = await listTrades(session.userId, "open")
  const existing = open.find((t) => t.id === id)
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const exitAt = parsed.data.exit_at ?? new Date().toISOString()
  if (new Date(exitAt).getTime() < new Date(existing.entry_at).getTime()) {
    return NextResponse.json(
      { error: "validation_error", message: "exit_at must be on or after entry_at" },
      { status: 400 }
    )
  }

  const realizedPnl = computePnl({
    side: existing.side,
    quantity: existing.quantity,
    entryPrice: existing.entry_price,
    currentPrice: parsed.data.exit_price,
    fees: existing.fees,
  })

  try {
    const trade = await closeTrade(id, session.userId, {
      exit_price: parsed.data.exit_price,
      exit_at: exitAt,
      realized_pnl: realizedPnl,
    })
    if (!trade) {
      return NextResponse.json({ error: "conflict" }, { status: 409 })
    }
    return NextResponse.json({ trade })
  } catch (err) {
    const message = err instanceof Error ? err.message : "close_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
