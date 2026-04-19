"use client"

import { useEffect, useRef, useState } from "react"
import { LineChart, X } from "lucide-react"

import type { Trade } from "@/lib/trades/types"
import { formatPrice } from "@/lib/format"

export interface AttachedTrade {
  id: string
  symbol: string
  side: "long" | "short"
  entry_price: number
  currency: string
  status: "open" | "closed"
}

export function AttachTradePicker({
  attached,
  onChange,
}: {
  attached: AttachedTrade | null
  onChange: (t: AttachedTrade | null) => void
}) {
  const [open, setOpen] = useState(false)
  const [trades, setTrades] = useState<Trade[] | null>(null)
  const [loading, setLoading] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  async function loadTrades() {
    setLoading(true)
    try {
      const openRes = await fetch("/api/trades?status=open", { cache: "no-store" })
      const openJson = openRes.ok ? ((await openRes.json()) as { trades: Trade[] }) : { trades: [] }
      let all = openJson.trades
      if (all.length < 10) {
        const closedRes = await fetch("/api/trades?status=closed", { cache: "no-store" })
        if (closedRes.ok) {
          const closedJson = (await closedRes.json()) as { trades: Trade[] }
          all = [...all, ...closedJson.trades.slice(0, 10 - all.length)]
        }
      }
      setTrades(all)
    } finally {
      setLoading(false)
    }
  }

  function toggleOpen() {
    if (!open && !trades) void loadTrades()
    setOpen((v) => !v)
  }

  if (attached) {
    return (
      <div className="flex items-center gap-2 px-2.5 h-8 rounded-[var(--radius-sm)] bg-surface-accent-subtle text-action-primary" style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}>
        <LineChart className="w-3.5 h-3.5" />
        <span>
          {attached.symbol} · {attached.side === "long" ? "LONG" : "SHORT"} @ {formatPrice(attached.entry_price, attached.currency)}
        </span>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Remove attached trade"
          className="ml-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-1.5 px-2.5 h-8 rounded-[var(--radius-sm)] border border-border-default text-content-muted hover:text-content-primary hover:bg-surface-muted transition-colors"
        style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}
      >
        <LineChart className="w-3.5 h-3.5" />
        Attach trade
      </button>
      {open ? (
        <div className="absolute left-0 top-10 w-72 max-h-80 overflow-auto rounded-[var(--radius-md)] bg-surface-raised border border-border-default shadow-lg z-40 py-1">
          {loading ? (
            <div className="px-3 py-2 text-content-muted" style={{ fontSize: "var(--font-size-13)" }}>
              Loading trades…
            </div>
          ) : trades && trades.length > 0 ? (
            trades.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  onChange({
                    id: t.id,
                    symbol: t.symbol,
                    side: t.side,
                    entry_price: t.entry_price,
                    currency: t.currency,
                    status: t.status,
                  })
                  setOpen(false)
                }}
                className="w-full text-left px-3 py-2 hover:bg-surface-muted flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div
                    className="text-content-primary truncate"
                    style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {t.symbol}
                  </div>
                  <div
                    className="text-content-muted"
                    style={{ fontSize: "var(--font-size-12)" }}
                  >
                    {t.side === "long" ? "LONG" : "SHORT"} · {t.quantity} @{" "}
                    {formatPrice(t.entry_price, t.currency)}
                  </div>
                </div>
                {t.status === "closed" ? (
                  <span
                    className="px-2 h-5 rounded-[var(--radius-sm)] bg-surface-muted text-content-muted flex items-center"
                    style={{ fontSize: "var(--font-size-11)" }}
                  >
                    closed
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-content-muted" style={{ fontSize: "var(--font-size-13)" }}>
              No trades yet. Log one first.
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
