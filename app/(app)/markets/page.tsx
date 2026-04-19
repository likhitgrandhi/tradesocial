import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { SymbolSearchInput } from "@/components/market/symbol-search-input"
import { TickerTape } from "@/components/market/ticker-tape"
import { MarketOverview } from "@/components/market/market-overview"
import { POPULAR_SYMBOLS, TICKER_TAPE_SYMBOLS } from "@/lib/market/symbols"

export default function MarketsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-28)", fontWeight: "var(--font-weight-bold)" }}
        >
          Markets
        </h1>
        <p className="text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
          Search a symbol, explore popular tickers, and pick a stock to log a trade.
        </p>
      </header>

      <SymbolSearchInput autoFocus className="max-w-xl" />

      <section aria-label="Live tickers" className="overflow-hidden rounded-[var(--radius-xl)] border border-border-default bg-surface-raised">
        <TickerTape symbols={TICKER_TAPE_SYMBOLS} />
      </section>

      <section aria-label="Popular symbols" className="space-y-3">
        <h2
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-18)", fontWeight: "var(--font-weight-medium)" }}
        >
          Popular
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {POPULAR_SYMBOLS.map((item) => (
            <li key={item.symbol}>
              <Link
                href={`/markets/${item.symbol}`}
                className="group flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-border-default bg-surface-raised px-4 py-3 transition-colors hover:border-border-accent hover:bg-surface-accent-subtle"
              >
                <div className="min-w-0">
                  <div
                    className="truncate text-content-primary"
                    style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {item.symbol}
                  </div>
                  <div
                    className="truncate text-content-muted"
                    style={{ fontSize: "var(--font-size-12)" }}
                  >
                    {item.name}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-content-muted transition-colors group-hover:text-action-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Market overview" className="space-y-3">
        <h2
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-18)", fontWeight: "var(--font-weight-medium)" }}
        >
          Overview
        </h2>
        <div className="overflow-hidden rounded-[var(--radius-xl)] border border-border-default bg-surface-raised">
          <MarketOverview />
        </div>
      </section>
    </div>
  )
}
