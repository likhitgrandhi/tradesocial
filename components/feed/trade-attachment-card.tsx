"use client"

import type { TradeAttachment } from "@/lib/posts/types"
import { formatPrice, formatPercent, formatCurrency } from "@/lib/format"
import { computePnl, computePnlPercent } from "@/lib/trades/pnl"
import { useLiveQuote } from "./live-prices-context"

export function TradeAttachmentCard({ trade }: { trade: TradeAttachment }) {
  const live = useLiveQuote(trade.symbol)
  const isOpen = trade.status === "open"

  const currentPrice = isOpen
    ? live?.price ?? trade.current_price ?? null
    : trade.exit_price ?? null

  const pnl = (() => {
    if (!isOpen) return trade.realized_pnl ?? null
    if (currentPrice == null) return trade.unrealized_pnl ?? null
    return computePnl({
      side: trade.side,
      quantity: trade.quantity,
      entryPrice: trade.entry_price,
      currentPrice,
    })
  })()

  const pnlPct = (() => {
    if (!isOpen) {
      if (trade.exit_price == null) return null
      return computePnlPercent({
        side: trade.side,
        entryPrice: trade.entry_price,
        currentPrice: trade.exit_price,
      })
    }
    if (currentPrice == null) return trade.unrealized_pnl_pct ?? null
    return computePnlPercent({
      side: trade.side,
      entryPrice: trade.entry_price,
      currentPrice,
    })
  })()

  const isGain = (pnl ?? 0) > 0
  const isLoss = (pnl ?? 0) < 0
  const pnlColor = isGain ? "text-gain" : isLoss ? "text-loss" : "text-content-muted"
  const pnlBg = isGain ? "bg-gain/10" : isLoss ? "bg-loss/10" : "bg-surface-muted"
  const sideColor =
    trade.side === "long" ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"

  // trade.stale is stamped server-side; if we have a live quote, the feed is fresh.
  const stale = isOpen && !live && Boolean(trade.stale)

  return (
    <div className="rounded-[var(--radius-md)] bg-surface-base border border-border-default p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`px-2 h-6 rounded-[var(--radius-sm)] flex items-center ${sideColor}`}
          style={{
            fontSize: "var(--font-size-11)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "0.02em",
          }}
        >
          {trade.side === "long" ? "LONG" : "SHORT"}
        </div>
        <div className="min-w-0">
          <div
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            {trade.symbol}
          </div>
          <div
            className="text-content-muted truncate"
            style={{ fontSize: "var(--font-size-12)" }}
          >
            Entry {formatPrice(trade.entry_price, trade.currency)} · Qty {trade.quantity}
          </div>
        </div>
      </div>

      <div className="text-right shrink-0">
        {currentPrice != null ? (
          <div
            className="text-content-secondary"
            style={{ fontSize: "var(--font-size-12)" }}
          >
            {isOpen ? "Now" : "Exit"} {formatPrice(currentPrice, trade.currency)}
          </div>
        ) : null}
        {pnl != null ? (
          <div
            className={`mt-0.5 inline-flex items-center gap-1 px-2 h-6 rounded-[var(--radius-sm)] ${pnlBg} ${pnlColor}`}
            style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}
          >
            {formatCurrency(pnl, trade.currency, { sign: true })}
            {pnlPct != null ? (
              <span className="text-content-muted" style={{ fontWeight: "var(--font-weight-regular)" }}>
                ({formatPercent(pnlPct, { sign: true })})
              </span>
            ) : null}
          </div>
        ) : null}
        {stale ? (
          <div className="text-content-muted mt-0.5" style={{ fontSize: "var(--font-size-11)" }}>
            delayed
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function TradeAttachmentPlaceholder() {
  return (
    <div className="rounded-[var(--radius-md)] bg-surface-base border border-border-default p-3 text-content-muted" style={{ fontSize: "var(--font-size-13)" }}>
      Trade no longer available
    </div>
  )
}

