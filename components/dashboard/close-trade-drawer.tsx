"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Loader2, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { computePnl } from "@/lib/trades/pnl"
import { formatCurrency } from "@/lib/format"
import type { Trade } from "@/lib/trades/types"

function nowLocalInput() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function localInputToIso(v: string): string {
  if (!v) return new Date().toISOString()
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

interface CloseTradeDrawerProps {
  trade: Trade
  currentPrice: number | null
  onClose: () => void
  onClosed: (trade: Trade) => void
}

export function CloseTradeDrawer({ trade, currentPrice, onClose, onClosed }: CloseTradeDrawerProps) {
  const [exitPrice, setExitPrice] = useState(() =>
    currentPrice != null && Number.isFinite(currentPrice) ? String(currentPrice) : ""
  )
  const [exitAt, setExitAt] = useState(nowLocalInput())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  const parsedExit = Number(exitPrice)
  const hasValidPrice = Number.isFinite(parsedExit) && parsedExit > 0
  const pnlPreview = hasValidPrice
    ? computePnl({
        side: trade.side,
        quantity: trade.quantity,
        entryPrice: trade.entry_price,
        currentPrice: parsedExit,
        fees: trade.fees,
      })
    : null

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!hasValidPrice) {
      setError("Enter a valid exit price")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/trades/${trade.id}/close`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exit_price: parsedExit,
          exit_at: localInputToIso(exitAt),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.message ?? body?.error ?? "Could not close trade.")
        setSubmitting(false)
        return
      }
      const { trade: closed } = (await res.json()) as { trade: Trade }
      onClosed(closed)
    } catch {
      setError("Network error. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="flex-1 bg-black/40"
      />
      <div className="w-full max-w-md h-full bg-surface-raised border-l border-border-default flex flex-col shadow-xl">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border-default shrink-0">
          <div className="min-w-0">
            <h2
              className="text-content-primary truncate"
              style={{ fontSize: "var(--font-size-18)", fontWeight: "var(--font-weight-semibold)" }}
            >
              Close {trade.symbol}
            </h2>
            <p
              className="text-content-muted"
              style={{ fontSize: "var(--font-size-12)" }}
            >
              {trade.side === "long" ? "Long" : "Short"} · {trade.quantity} @ {formatCurrency(trade.entry_price, trade.currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-[var(--radius-md)] hover:bg-surface-muted text-content-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="flex-1 overflow-auto p-5 space-y-5">
          <label className="block space-y-1.5">
            <span
              className="text-content-primary"
              style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
            >
              Exit price
            </span>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-base px-3 text-content-primary outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
              style={{ fontSize: "var(--font-size-14)" }}
              autoFocus
            />
          </label>

          <label className="block space-y-1.5">
            <span
              className="text-content-primary"
              style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
            >
              Exit date &amp; time
            </span>
            <input
              type="datetime-local"
              value={exitAt}
              onChange={(e) => setExitAt(e.target.value)}
              className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-base px-3 text-content-primary outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
              style={{ fontSize: "var(--font-size-14)" }}
            />
          </label>

          <div className="rounded-[var(--radius-md)] border border-border-default bg-surface-base p-4">
            <div
              className="text-content-muted"
              style={{ fontSize: "var(--font-size-12)" }}
            >
              Realized P&amp;L preview
            </div>
            <div
              className={cn(
                "mt-1",
                pnlPreview == null
                  ? "text-content-muted"
                  : pnlPreview >= 0
                    ? "text-gain"
                    : "text-loss"
              )}
              style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-semibold)" }}
            >
              {pnlPreview == null ? "—" : formatCurrency(pnlPreview, trade.currency, { sign: true })}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-[var(--radius-md)] border border-loss/40 bg-loss/10 px-3 py-2 text-loss"
              style={{ fontSize: "var(--font-size-13)" }}
            >
              {error}
            </div>
          )}
        </form>

        <footer className="px-5 py-4 border-t border-border-default shrink-0 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-[var(--radius-md)] border border-border-default text-content-primary hover:bg-surface-muted transition-colors"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              const form = (e.currentTarget as HTMLButtonElement).closest("form") as HTMLFormElement | null
              form?.requestSubmit()
            }}
            disabled={submitting || !hasValidPrice}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] bg-action-primary px-4 text-content-inverse hover:bg-action-primary-hover disabled:opacity-60 transition-colors"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Close trade
          </button>
        </footer>
      </div>
    </div>
  )
}
