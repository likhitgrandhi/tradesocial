import { getPriceCache } from "@/lib/market/prices/cache"
import { computePnl, computePnlPercent } from "@/lib/trades/pnl"
import type { PostWithContext } from "./types"

const STALE_MS = 60_000

/**
 * Enrich each post's trade attachment with the current price and unrealized P&L.
 * Runs server-side during feed/detail hydration. One bulk price fetch per call.
 */
export async function stitchLivePrices(items: PostWithContext[]): Promise<PostWithContext[]> {
  const symbols = Array.from(
    new Set(items.flatMap((p) => (p.trade && p.trade.status === "open" ? [p.trade.symbol] : [])))
  )
  if (symbols.length === 0) return items

  const quotes = await getPriceCache().getQuotes(symbols)
  const now = Date.now()

  for (const post of items) {
    const t = post.trade
    if (!t || t.status !== "open") continue
    const q = quotes[t.symbol]
    if (!q) continue
    const stale = now - q.updatedAt > STALE_MS
    t.current_price = q.price
    t.unrealized_pnl = computePnl({
      side: t.side,
      quantity: t.quantity,
      entryPrice: t.entry_price,
      currentPrice: q.price,
    })
    t.unrealized_pnl_pct = computePnlPercent({
      side: t.side,
      entryPrice: t.entry_price,
      currentPrice: q.price,
    })
    t.stale = stale
  }

  return items
}
