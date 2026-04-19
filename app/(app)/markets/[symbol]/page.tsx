import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, TrendingUp } from "lucide-react"

import { AdvancedChart } from "@/components/market/advanced-chart"
import { SymbolInfo } from "@/components/market/symbol-info"
import { SymbolSearchInput } from "@/components/market/symbol-search-input"
import { isValidSymbol, normalizeSymbol } from "@/lib/market/symbols"

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol: raw } = await params
  const symbol = normalizeSymbol(decodeURIComponent(raw))

  if (!isValidSymbol(symbol)) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <Link
          href="/markets"
          className="inline-flex items-center gap-1.5 text-content-muted hover:text-content-primary transition-colors"
          style={{ fontSize: "var(--font-size-13)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Markets
        </Link>
      </nav>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-32)", fontWeight: "var(--font-weight-bold)" }}
          >
            {symbol}
          </h1>
          <p className="text-content-muted" style={{ fontSize: "var(--font-size-13)" }}>
            Real-time data powered by TradingView.
          </p>
        </div>

        <Link
          href={`/log-trade?symbol=${encodeURIComponent(symbol)}`}
          className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-md)] bg-action-primary px-4 text-content-inverse hover:bg-action-primary-hover transition-colors"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
        >
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          Log trade with {symbol}
        </Link>
      </header>

      <SymbolSearchInput className="max-w-xl" />

      <section
        aria-label={`${symbol} info`}
        className="overflow-hidden rounded-[var(--radius-xl)] border border-border-default bg-surface-raised"
      >
        <SymbolInfo symbol={symbol} />
      </section>

      <section
        aria-label={`${symbol} price chart`}
        className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border-default bg-surface-raised"
        style={{ height: "calc(100vh - 280px)", minHeight: 500 }}
      >
        <AdvancedChart symbol={symbol} minHeight={500} className="flex-1" />
      </section>
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>
}) {
  const { symbol: raw } = await params
  const symbol = normalizeSymbol(decodeURIComponent(raw))
  return {
    title: isValidSymbol(symbol) ? `${symbol} — Markets` : "Markets",
  }
}
