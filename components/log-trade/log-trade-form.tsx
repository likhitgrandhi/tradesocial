"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, TrendingDown, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { SymbolPicker } from "./symbol-picker"

function nowLocalInput(): string {
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

interface LogTradeFormProps {
  initialSymbol?: string
}

export function LogTradeForm({ initialSymbol = "" }: LogTradeFormProps) {
  const router = useRouter()
  const [symbol, setSymbol] = useState(initialSymbol)
  const [side, setSide] = useState<"long" | "short">("long")
  const [quantity, setQuantity] = useState("")
  const [entryPrice, setEntryPrice] = useState("")
  const [entryAt, setEntryAt] = useState(nowLocalInput())
  const [fees, setFees] = useState("")
  const [notes, setNotes] = useState("")
  const [fetchingPrice, setFetchingPrice] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function useCurrentPrice() {
    const sym = symbol.trim().toUpperCase()
    if (!sym) return
    setFetchingPrice(true)
    try {
      const res = await fetch(`/api/market/prices?symbols=${encodeURIComponent(sym)}`)
      if (!res.ok) return
      const data = (await res.json()) as {
        quotes: Record<string, { price?: number }>
      }
      const price = data.quotes[sym]?.price
      if (typeof price === "number" && Number.isFinite(price)) {
        setEntryPrice(String(price))
      }
    } catch {
      // swallow; user can enter manually
    } finally {
      setFetchingPrice(false)
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const sym = symbol.trim().toUpperCase()
    const qty = Number(quantity)
    const entry = Number(entryPrice)
    const feeNum = fees ? Number(fees) : 0

    if (!sym) return setError("Symbol is required")
    if (!Number.isFinite(qty) || qty <= 0) return setError("Quantity must be a positive number")
    if (!Number.isFinite(entry) || entry <= 0) return setError("Entry price must be a positive number")
    if (!Number.isFinite(feeNum) || feeNum < 0) return setError("Fees must be zero or positive")

    setSubmitting(true)
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol: sym,
          side,
          quantity: qty,
          entry_price: entry,
          entry_at: localInputToIso(entryAt),
          fees: feeNum,
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error === "unauthorized" ? "Please sign in to log a trade." : "Could not save trade.")
        setSubmitting(false)
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field label="Symbol">
        <SymbolPicker value={symbol} onChange={setSymbol} autoFocus={!initialSymbol} />
      </Field>

      <Field label="Side">
        <div className="grid grid-cols-2 gap-2">
          <SideButton active={side === "long"} onClick={() => setSide("long")} kind="long" />
          <SideButton active={side === "short"} onClick={() => setSide("short")} kind="short" />
        </div>
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Quantity">
          <NumberInput value={quantity} onChange={setQuantity} placeholder="e.g. 10" step="any" />
        </Field>
        <Field
          label="Entry price"
          action={
            <button
              type="button"
              onClick={useCurrentPrice}
              disabled={!symbol.trim() || fetchingPrice}
              className="text-action-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
              style={{ fontSize: "var(--font-size-12)" }}
            >
              {fetchingPrice && <Loader2 className="h-3 w-3 animate-spin" />}
              Use current market
            </button>
          }
        >
          <NumberInput value={entryPrice} onChange={setEntryPrice} placeholder="e.g. 150.25" step="any" />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Entry date & time">
          <input
            type="datetime-local"
            value={entryAt}
            onChange={(e) => setEntryAt(e.target.value)}
            className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-content-primary outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
            style={{ fontSize: "var(--font-size-14)" }}
          />
        </Field>
        <Field label="Fees (optional)">
          <NumberInput value={fees} onChange={setFees} placeholder="0.00" step="any" />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          maxLength={5000}
          placeholder="Why you're taking this trade, your plan, stops…"
          className="w-full min-h-24 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 py-2.5 text-content-primary placeholder:text-content-muted outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors resize-y"
          style={{ fontSize: "var(--font-size-14)" }}
        />
      </Field>

      {error && (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-loss/40 bg-loss/10 px-3 py-2 text-loss"
          style={{ fontSize: "var(--font-size-13)" }}
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 px-4 rounded-[var(--radius-md)] border border-border-default text-content-primary hover:bg-surface-muted transition-colors"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-md)] bg-action-primary px-4 text-content-inverse hover:bg-action-primary-hover disabled:opacity-60 transition-colors"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Log trade
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  action,
  children,
}: {
  label: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
        >
          {label}
        </span>
        {action}
      </div>
      {children}
    </label>
  )
}

function NumberInput({
  value,
  onChange,
  placeholder,
  step,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  step?: string
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      min="0"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-3 text-content-primary placeholder:text-content-muted outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
      style={{ fontSize: "var(--font-size-14)" }}
    />
  )
}

function SideButton({
  active,
  onClick,
  kind,
}: {
  active: boolean
  onClick: () => void
  kind: "long" | "short"
}) {
  const Icon = kind === "long" ? TrendingUp : TrendingDown
  const label = kind === "long" ? "Long" : "Short"
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-11 inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border transition-colors",
        active
          ? kind === "long"
            ? "bg-gain/15 border-gain text-gain"
            : "bg-loss/15 border-loss text-loss"
          : "border-border-default text-content-primary hover:bg-surface-muted"
      )}
      style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
