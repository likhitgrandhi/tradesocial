"use client"

import Link from "next/link"
import { TrendingUp } from "lucide-react"

import { AdvancedChart } from "@/components/market/advanced-chart"
import { SymbolInfo } from "@/components/market/symbol-info"
import { SYMBOL_CATALOG } from "@/lib/market/symbols-catalog"
import { ActiveTradesPane } from "./active-trades-pane"
import type { DashboardView } from "./types"

const CATALOG_BY_SYMBOL = new Map(SYMBOL_CATALOG.map((e) => [e.symbol, e]))

function PlaceholderView({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-md text-center space-y-2">
        <h2
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-semibold)" }}
        >
          {title}
        </h2>
        <p
          className="text-content-muted"
          style={{ fontSize: "var(--font-size-14)" }}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

function SymbolView({ symbol }: { symbol: string }) {
  const entry = CATALOG_BY_SYMBOL.get(symbol)

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-4 overflow-hidden">
      <header className="flex items-start justify-between gap-4 shrink-0">
        <div className="min-w-0 space-y-0.5">
          <h2
            className="text-content-primary truncate"
            style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-bold)" }}
          >
            {symbol}
          </h2>
          {entry && (
            <p
              className="text-content-muted truncate"
              style={{ fontSize: "var(--font-size-13)" }}
            >
              {entry.name} · {entry.exchange}
            </p>
          )}
        </div>
        <Link
          href={`/log-trade?symbol=${encodeURIComponent(symbol)}`}
          className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-md)] bg-action-primary px-3 text-content-inverse hover:bg-action-primary-hover transition-colors shrink-0"
          style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
        >
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          Log trade
        </Link>
      </header>

      <section
        aria-label={`${symbol} info`}
        className="shrink-0 overflow-hidden rounded-[var(--radius-xl)] border border-border-default bg-surface-raised"
      >
        <SymbolInfo symbol={symbol} />
      </section>

      <section
        aria-label={`${symbol} price chart`}
        className="flex-1 min-h-[320px] flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border-default bg-surface-raised"
      >
        <AdvancedChart symbol={symbol} minHeight={320} className="flex-1" />
      </section>
    </div>
  )
}

export function DashboardMain({
  view,
  onViewChange,
}: {
  view: DashboardView
  onViewChange: (view: DashboardView) => void
}) {
  if (view.type === "symbol") return <SymbolView symbol={view.symbol} />

  if (view.type === "active-trades") {
    return <ActiveTradesPane onSelectSymbol={onViewChange} />
  }

  return (
    <PlaceholderView
      title="History"
      body="Your past closed trades and P&L will appear here. Coming soon."
    />
  )
}
