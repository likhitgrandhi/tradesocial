import type { AssetType } from "@/lib/trades/types"
import type { PriceProvider, Quote } from "./provider"

// v7 batch (up to 50 symbols)
const BATCH_ENDPOINT = "https://query1.finance.yahoo.com/v7/finance/quote"
// v8 chart — per-symbol, more permissive, used as fallback
const CHART_ENDPOINT = "https://query1.finance.yahoo.com/v8/finance/chart"

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://finance.yahoo.com",
  Referer: "https://finance.yahoo.com/",
}

const BATCH_SIZE = 50

type YahooQuote = {
  symbol?: string
  regularMarketPrice?: number
  postMarketPrice?: number
  preMarketPrice?: number
  currency?: string
  regularMarketTime?: number
}

type YahooV7Response = {
  quoteResponse?: { result?: YahooQuote[] }
}

type YahooV8Response = {
  chart?: {
    result?: Array<{
      meta?: {
        symbol?: string
        regularMarketPrice?: number
        currency?: string
        regularMarketTime?: number
      }
    }>
  }
}

export class YahooProvider implements PriceProvider {
  readonly name = "yahoo"

  supports(assetType: AssetType): boolean {
    return assetType !== "crypto"
  }

  async getQuotes(providerSymbols: string[]): Promise<Quote[]> {
    if (providerSymbols.length === 0) return []
    const results: Quote[] = []
    for (let i = 0; i < providerSymbols.length; i += BATCH_SIZE) {
      const batch = providerSymbols.slice(i, i + BATCH_SIZE)
      const quotes = await this.fetchBatch(batch)
      results.push(...quotes)
    }
    return results
  }

  private async fetchBatch(symbols: string[]): Promise<Quote[]> {
    try {
      const url = `${BATCH_ENDPOINT}?symbols=${encodeURIComponent(symbols.join(","))}`
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        cache: "no-store",
      })
      if (res.ok) {
        const json = (await res.json()) as YahooV7Response
        const raw = json.quoteResponse?.result ?? []
        const quotes = raw.map(toQuote).filter((q): q is Quote => q !== null)
        if (quotes.length > 0) return quotes
      }
    } catch {
      // fall through to per-symbol chart fallback
    }

    // Per-symbol chart fallback — more permissive but one request per symbol
    const settled = await Promise.allSettled(
      symbols.map((s) => this.fetchChart(s))
    )
    return settled
      .filter((r): r is PromiseFulfilledResult<Quote | null> => r.status === "fulfilled")
      .map((r) => r.value)
      .filter((q): q is Quote => q !== null)
  }

  private async fetchChart(symbol: string): Promise<Quote | null> {
    try {
      const url = `${CHART_ENDPOINT}/${encodeURIComponent(symbol)}?interval=1d&range=1d`
      const res = await fetch(url, {
        headers: BROWSER_HEADERS,
        cache: "no-store",
      })
      if (!res.ok) return null
      const json = (await res.json()) as YahooV8Response
      const meta = json.chart?.result?.[0]?.meta
      if (!meta?.symbol || !meta?.regularMarketPrice) return null
      return {
        symbol,
        price: meta.regularMarketPrice,
        currency: meta.currency ?? "USD",
        updatedAt: meta.regularMarketTime ? meta.regularMarketTime * 1000 : Date.now(),
      }
    } catch {
      return null
    }
  }
}

function toQuote(row: YahooQuote): Quote | null {
  const price = row.regularMarketPrice ?? row.postMarketPrice ?? row.preMarketPrice
  if (!row.symbol || typeof price !== "number" || !Number.isFinite(price)) return null
  const updatedAt = row.regularMarketTime ? row.regularMarketTime * 1000 : Date.now()
  return {
    symbol: row.symbol,
    price,
    currency: row.currency ?? "USD",
    updatedAt,
  }
}
