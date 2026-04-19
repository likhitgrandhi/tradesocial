import { LogTradeForm } from "@/components/log-trade/log-trade-form"
import { isValidSymbol, normalizeSymbol } from "@/lib/market/symbols"

export const metadata = {
  title: "Log Trade — TradeSocial",
}

export default async function LogTradePage({
  searchParams,
}: {
  searchParams: Promise<{ symbol?: string | string[] }>
}) {
  const params = await searchParams
  const raw = Array.isArray(params.symbol) ? params.symbol[0] : params.symbol
  const normalized = raw ? normalizeSymbol(raw) : ""
  const symbol = normalized && isValidSymbol(normalized) ? normalized : ""

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-semibold)" }}
        >
          Log a trade
        </h1>
        <p className="text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
          Record an open position. It will appear in your Active Trades with live PnL.
        </p>
      </header>
      <LogTradeForm initialSymbol={symbol} />
    </div>
  )
}
