"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Loader2, Share2, TrendingUp, X } from "lucide-react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { computePnl, computePnlPercent } from "@/lib/trades/pnl"
import { formatCurrency, formatPercent, formatPrice, formatRelativeTime } from "@/lib/format"
import type { Trade } from "@/lib/trades/types"
import { isStockMarketOpen } from "@/lib/market/calendar"
import { useLivePrices } from "./use-live-prices"
import { CloseTradeDrawer } from "./close-trade-drawer"
import type { DashboardView } from "./types"

interface ActiveTradesPaneProps {
  onSelectSymbol: (view: DashboardView) => void
}

export function ActiveTradesPane({ onSelectSymbol }: ActiveTradesPaneProps) {
  const router = useRouter()
  const [trades, setTrades] = useState<Trade[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [closing, setClosing] = useState<Trade | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    let cancelled = false
    setLoadError(null)
    fetch("/api/trades?status=open")
      .then((r) => {
        if (r.status === 401) throw new Error("unauthorized")
        return r.ok ? r.json() : Promise.reject(new Error("load_failed"))
      })
      .then((data: { trades: Trade[] }) => {
        if (!cancelled) setTrades(data.trades)
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setTrades([])
          setLoadError(
            err.message === "unauthorized" ? "Please sign in to view your trades." : "Could not load trades."
          )
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000)
    return () => clearInterval(t)
  }, [])

  const symbols = useMemo(
    () => Array.from(new Set((trades ?? []).map((t) => t.symbol))),
    [trades]
  )
  const { quotes, lastUpdatedAt } = useLivePrices(symbols)

  const rows = useMemo(() => {
    if (!trades) return []
    return trades.map((t) => {
      const q = quotes[t.symbol]
      const currentPrice = q?.price ?? null
      const pnl =
        currentPrice != null
          ? computePnl({
              side: t.side,
              quantity: t.quantity,
              entryPrice: t.entry_price,
              currentPrice,
              fees: t.fees,
            })
          : null
      const pnlPct =
        currentPrice != null
          ? computePnlPercent({ side: t.side, entryPrice: t.entry_price, currentPrice })
          : null
      const isEquity = t.asset_type === "stock" || t.asset_type === "fund" || t.asset_type === "index"
      const labelStale = isEquity && !isStockMarketOpen() && currentPrice != null
      return { trade: t, currentPrice, pnl, pnlPct, labelStale }
    })
  }, [trades, quotes])

  const totals = useMemo(() => {
    let total = 0
    let anyPriced = false
    for (const r of rows) {
      if (r.pnl != null) {
        total += r.pnl
        anyPriced = true
      }
    }
    return { total, anyPriced }
  }, [rows])

  async function handleDelete(id: string) {
    if (!confirm("Delete this trade? This cannot be undone.")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/trades/${id}`, { method: "DELETE" })
      if (res.ok) {
        setTrades((prev) => (prev ? prev.filter((t) => t.id !== id) : prev))
      }
    } finally {
      setDeletingId(null)
    }
  }

  function handleClosed(closed: Trade) {
    setTrades((prev) => (prev ? prev.filter((t) => t.id !== closed.id) : prev))
    setClosing(null)
  }

  if (trades === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-content-muted" />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="max-w-md text-center space-y-2">
          <p
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            {loadError}
          </p>
        </div>
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="max-w-md text-center space-y-3">
          <h2
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-semibold)" }}
          >
            No active trades
          </h2>
          <p className="text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
            Log a position to start tracking live P&amp;L on your dashboard.
          </p>
          <Link
            href="/log-trade"
            className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-md)] bg-action-primary px-4 text-content-inverse hover:bg-action-primary-hover transition-colors"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            <TrendingUp className="h-4 w-4" />
            Log your first trade
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-border-default shrink-0">
        <div className="min-w-0">
          <h2
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-18)", fontWeight: "var(--font-weight-semibold)" }}
          >
            Active trades
          </h2>
          <div
            className="flex items-center gap-2 text-content-muted mt-0.5"
            style={{ fontSize: "var(--font-size-12)" }}
          >
            <span>
              {trades.length} {trades.length === 1 ? "position" : "positions"}
            </span>
            {lastUpdatedAt > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {formatRelativeTime(lastUpdatedAt, now)}</span>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-content-muted"
            style={{ fontSize: "var(--font-size-11)" }}
          >
            Unrealized P&amp;L
          </div>
          <div
            className={cn(
              "tabular-nums",
              !totals.anyPriced
                ? "text-content-muted"
                : totals.total >= 0
                  ? "text-gain"
                  : "text-loss"
            )}
            style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-semibold)" }}
          >
            {totals.anyPriced ? formatCurrency(totals.total, "USD", { sign: true }) : "—"}
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="hidden md:block">
          <table className="w-full" style={{ fontSize: "var(--font-size-13)" }}>
            <thead className="sticky top-0 bg-surface-base border-b border-border-default">
              <tr className="text-content-muted text-left">
                <Th>Symbol</Th>
                <Th>Side</Th>
                <Th className="text-right">Qty</Th>
                <Th className="text-right">Entry</Th>
                <Th className="text-right">Current</Th>
                <Th className="text-right">P&amp;L</Th>
                <Th className="text-right">P&amp;L %</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ trade, currentPrice, pnl, pnlPct, labelStale }) => (
                <tr
                  key={trade.id}
                  className="border-b border-border-default hover:bg-surface-muted/50 transition-colors cursor-pointer"
                  onClick={() => onSelectSymbol({ type: "symbol", symbol: trade.symbol })}
                >
                  <Td>
                    <span
                      className="text-content-primary"
                      style={{ fontWeight: "var(--font-weight-medium)" }}
                    >
                      {trade.symbol}
                    </span>
                  </Td>
                  <Td>
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded text-[11px]",
                        trade.side === "long" ? "bg-gain/15 text-gain" : "bg-loss/15 text-loss"
                      )}
                    >
                      {trade.side === "long" ? "Long" : "Short"}
                    </span>
                  </Td>
                  <Td className="text-right tabular-nums">{trade.quantity}</Td>
                  <Td className="text-right tabular-nums text-content-primary">
                    {formatPrice(trade.entry_price, trade.currency)}
                  </Td>
                  <Td className="text-right tabular-nums text-content-primary">
                    {currentPrice != null ? (
                      <span className={cn(labelStale && "text-content-muted")}>
                        {formatPrice(currentPrice, trade.currency)}
                        {labelStale && (
                          <span
                            className="ml-1 text-content-disabled"
                            style={{ fontSize: "var(--font-size-11)" }}
                          >
                            (last close)
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-content-muted">—</span>
                    )}
                  </Td>
                  <Td
                    className={cn(
                      "text-right tabular-nums",
                      pnl == null ? "text-content-muted" : pnl >= 0 ? "text-gain" : "text-loss"
                    )}
                  >
                    {pnl == null ? "—" : formatCurrency(pnl, trade.currency, { sign: true })}
                  </Td>
                  <Td
                    className={cn(
                      "text-right tabular-nums",
                      pnlPct == null ? "text-content-muted" : pnlPct >= 0 ? "text-gain" : "text-loss"
                    )}
                  >
                    {pnlPct == null ? "—" : formatPercent(pnlPct, { sign: true })}
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/feed?share=${trade.id}`)
                        }}
                        aria-label="Share trade"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-md)] text-content-muted hover:text-content-primary hover:bg-surface-muted transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setClosing(trade)
                        }}
                        className="h-8 px-3 rounded-[var(--radius-md)] border border-border-default text-content-primary hover:bg-surface-muted transition-colors"
                        style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          void handleDelete(trade.id)
                        }}
                        disabled={deletingId === trade.id}
                        aria-label="Delete trade"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-md)] text-content-muted hover:text-loss hover:bg-loss/10 disabled:opacity-50 transition-colors"
                      >
                        {deletingId === trade.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4 space-y-3">
          {rows.map(({ trade, currentPrice, pnl, pnlPct, labelStale }) => (
            <div
              key={trade.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectSymbol({ type: "symbol", symbol: trade.symbol })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onSelectSymbol({ type: "symbol", symbol: trade.symbol })
                }
              }}
              className="w-full text-left rounded-[var(--radius-lg)] border border-border-default bg-surface-raised p-4 space-y-3 hover:bg-surface-muted/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div
                    className="text-content-primary"
                    style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--font-weight-semibold)" }}
                  >
                    {trade.symbol}
                  </div>
                  <div
                    className="text-content-muted mt-0.5"
                    style={{ fontSize: "var(--font-size-12)" }}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded mr-1.5",
                        trade.side === "long" ? "bg-gain/15 text-gain" : "bg-loss/15 text-loss"
                      )}
                      style={{ fontSize: "var(--font-size-10)" }}
                    >
                      {trade.side === "long" ? "Long" : "Short"}
                    </span>
                    {trade.quantity} @ {formatPrice(trade.entry_price, trade.currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={cn(
                      "tabular-nums",
                      pnl == null ? "text-content-muted" : pnl >= 0 ? "text-gain" : "text-loss"
                    )}
                    style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--font-weight-semibold)" }}
                  >
                    {pnl == null ? "—" : formatCurrency(pnl, trade.currency, { sign: true })}
                  </div>
                  <div
                    className={cn(
                      "tabular-nums",
                      pnlPct == null ? "text-content-muted" : pnlPct >= 0 ? "text-gain" : "text-loss"
                    )}
                    style={{ fontSize: "var(--font-size-12)" }}
                  >
                    {pnlPct == null ? "—" : formatPercent(pnlPct, { sign: true })}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div
                  className="text-content-muted tabular-nums"
                  style={{ fontSize: "var(--font-size-12)" }}
                >
                  Current {currentPrice != null ? formatPrice(currentPrice, trade.currency) : "—"}
                  {labelStale && <span className="ml-1 text-content-disabled">(last close)</span>}
                </div>
                <div
                  className="inline-flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => router.push(`/feed?share=${trade.id}`)}
                    aria-label="Share trade"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-md)] text-content-muted hover:text-content-primary hover:bg-surface-muted transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setClosing(trade)}
                    className="h-8 px-3 rounded-[var(--radius-md)] border border-border-default text-content-primary hover:bg-surface-muted transition-colors"
                    style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(trade.id)}
                    disabled={deletingId === trade.id}
                    aria-label="Delete trade"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-[var(--radius-md)] text-content-muted hover:text-loss hover:bg-loss/10 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === trade.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {closing && (
        <CloseTradeDrawer
          trade={closing}
          currentPrice={quotes[closing.symbol]?.price ?? null}
          onClose={() => setClosing(null)}
          onClosed={handleClosed}
        />
      )}
    </div>
  )
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn("font-medium px-4 py-2.5", className)}
      style={{ fontSize: "var(--font-size-12)" }}
    >
      {children}
    </th>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>
}
