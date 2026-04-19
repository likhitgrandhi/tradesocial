import { YahooProvider } from "./yahoo-provider"
import { resolveSymbol, toYahooSymbol } from "./symbol-map"
import type { Quote } from "./provider"
import type { AssetType } from "@/lib/trades/types"

const YAHOO_POLL_MS = 15_000
const CRYPTO_POLL_MS = 5_000
const STALE_MS = 60_000
const BINANCE_REST = "https://api.binance.com/api/v3/ticker/price"

type Subscriber = {
  id: symbol
  symbols: Set<string>
  onUpdate: (quote: Quote, userSymbol: string) => void
}

type ResolvedEntry = {
  userSymbol: string
  providerSymbol: string
  yahooSymbol: string
  assetType: AssetType
  currency: string
}

declare global {
  var __tsPriceCache: PriceCache | undefined
}

class PriceCache {
  private yahoo = new YahooProvider()
  private quotes = new Map<string, Quote>()
  private resolved = new Map<string, ResolvedEntry>()
  private subscribers = new Map<symbol, Subscriber>()

  private yahooRefCount = new Map<string, number>()
  private cryptoRefCount = new Map<string, number>()
  private yahooTimer: ReturnType<typeof setInterval> | null = null
  private cryptoTimer: ReturnType<typeof setInterval> | null = null

  getQuote(userSymbol: string): Quote | undefined {
    const q = this.quotes.get(userSymbol.toUpperCase())
    if (!q) return undefined
    const stale = Date.now() - q.updatedAt > STALE_MS
    return stale ? { ...q, stale: true } : q
  }

  async getQuotes(userSymbols: string[]): Promise<Record<string, Quote>> {
    const uniq = Array.from(new Set(userSymbols.map((s) => s.toUpperCase())))
    const missing = uniq.filter((s) => !this.quotes.has(s))
    if (missing.length > 0) await this.fetchOnce(missing)

    const out: Record<string, Quote> = {}
    for (const s of uniq) {
      const q = this.getQuote(s)
      if (q) out[s] = q
    }
    return out
  }

  subscribe(userSymbols: string[], onUpdate: (q: Quote, userSymbol: string) => void): () => void {
    const id = Symbol("subscriber")
    const normalized = new Set(userSymbols.map((s) => s.toUpperCase()))
    this.subscribers.set(id, { id, symbols: normalized, onUpdate })

    for (const s of normalized) this.refAdd(s)

    queueMicrotask(() => {
      for (const s of normalized) {
        const q = this.getQuote(s)
        if (q) onUpdate(q, s)
      }
    })

    const missing = Array.from(normalized).filter((s) => !this.quotes.has(s))
    if (missing.length > 0) void this.fetchOnce(missing)

    return () => {
      const sub = this.subscribers.get(id)
      if (!sub) return
      this.subscribers.delete(id)
      for (const s of sub.symbols) this.refRemove(s)
    }
  }

  private refAdd(userSymbol: string) {
    const { assetType } = this.resolve(userSymbol)
    if (assetType === "crypto") {
      const c = (this.cryptoRefCount.get(userSymbol) ?? 0) + 1
      this.cryptoRefCount.set(userSymbol, c)
      this.ensureCryptoPolling()
    } else {
      const c = (this.yahooRefCount.get(userSymbol) ?? 0) + 1
      this.yahooRefCount.set(userSymbol, c)
      this.ensureYahooPolling()
    }
  }

  private refRemove(userSymbol: string) {
    const { assetType } = this.resolve(userSymbol)
    if (assetType === "crypto") {
      const c = (this.cryptoRefCount.get(userSymbol) ?? 1) - 1
      if (c <= 0) this.cryptoRefCount.delete(userSymbol)
      else this.cryptoRefCount.set(userSymbol, c)
      if (this.cryptoRefCount.size === 0) this.stopCryptoPolling()
    } else {
      const c = (this.yahooRefCount.get(userSymbol) ?? 1) - 1
      if (c <= 0) this.yahooRefCount.delete(userSymbol)
      else this.yahooRefCount.set(userSymbol, c)
      if (this.yahooRefCount.size === 0) this.stopYahooPolling()
    }
  }

  private resolve(userSymbol: string): ResolvedEntry {
    const cached = this.resolved.get(userSymbol)
    if (cached) return cached
    const r = resolveSymbol(userSymbol)
    const entry: ResolvedEntry = {
      userSymbol: r.symbol,
      providerSymbol: r.providerSymbol,
      yahooSymbol: toYahooSymbol(r.symbol, r.assetType),
      assetType: r.assetType,
      currency: r.currency,
    }
    this.resolved.set(userSymbol, entry)
    return entry
  }

  // ── Yahoo polling ─────────────────────────────────────────────────────────

  private ensureYahooPolling() {
    if (this.yahooTimer) return
    void this.pollYahoo()
    this.yahooTimer = setInterval(() => void this.pollYahoo(), YAHOO_POLL_MS)
  }

  private stopYahooPolling() {
    if (!this.yahooTimer) return
    clearInterval(this.yahooTimer)
    this.yahooTimer = null
  }

  private async pollYahoo() {
    const userSymbols = Array.from(this.yahooRefCount.keys())
    if (userSymbols.length === 0) return
    await this.fetchYahoo(userSymbols)
  }

  // ── Crypto (Binance REST) polling ─────────────────────────────────────────

  private ensureCryptoPolling() {
    if (this.cryptoTimer) return
    void this.pollCrypto()
    this.cryptoTimer = setInterval(() => void this.pollCrypto(), CRYPTO_POLL_MS)
  }

  private stopCryptoPolling() {
    if (!this.cryptoTimer) return
    clearInterval(this.cryptoTimer)
    this.cryptoTimer = null
  }

  private async pollCrypto() {
    const userSymbols = Array.from(this.cryptoRefCount.keys())
    if (userSymbols.length === 0) return
    await this.fetchCrypto(userSymbols)
  }

  // ── Fetch helpers ─────────────────────────────────────────────────────────

  private async fetchOnce(userSymbols: string[]) {
    const crypto = userSymbols.filter((s) => this.resolve(s).assetType === "crypto")
    const yahoo = userSymbols.filter((s) => this.resolve(s).assetType !== "crypto")
    await Promise.all([
      crypto.length > 0 ? this.fetchCrypto(crypto) : Promise.resolve(),
      yahoo.length > 0 ? this.fetchYahoo(yahoo) : Promise.resolve(),
    ])
  }

  private async fetchCrypto(userSymbols: string[]) {
    try {
      const providerSymbols = userSymbols.map((s) => this.resolve(s).providerSymbol)
      const url =
        providerSymbols.length === 1
          ? `${BINANCE_REST}?symbol=${encodeURIComponent(providerSymbols[0])}`
          : `${BINANCE_REST}?symbols=${encodeURIComponent(JSON.stringify(providerSymbols))}`

      const res = await fetch(url, { cache: "no-store" })
      if (!res.ok) return

      const raw = await res.json()
      const rows: Array<{ symbol: string; price: string }> = Array.isArray(raw) ? raw : [raw]
      const byProvider = new Map(rows.map((r) => [r.symbol, Number(r.price)]))
      const now = Date.now()

      for (const us of userSymbols) {
        const entry = this.resolve(us)
        const price = byProvider.get(entry.providerSymbol)
        if (price != null && Number.isFinite(price)) {
          const quote: Quote = { symbol: us, price, currency: entry.currency, updatedAt: now }
          this.quotes.set(us, quote)
          this.broadcast(us, quote)
        }
      }
    } catch {
      // stale cache serves until next poll
    }
  }

  private async fetchYahoo(userSymbols: string[]) {
    try {
      const providerSymbols = userSymbols.map((s) => this.resolve(s).yahooSymbol)
      const quotes = await this.yahoo.getQuotes(providerSymbols)
      const byProvider = new Map(quotes.map((q) => [q.symbol, q]))
      for (const us of userSymbols) {
        const entry = this.resolve(us)
        const q = byProvider.get(entry.yahooSymbol)
        if (q) {
          const quote: Quote = { ...q, symbol: us, currency: entry.currency }
          this.quotes.set(us, quote)
          this.broadcast(us, quote)
        }
      }
    } catch {
      // stale cache is acceptable up to STALE_MS
    }
  }

  private broadcast(userSymbol: string, quote: Quote) {
    for (const sub of this.subscribers.values()) {
      if (sub.symbols.has(userSymbol)) sub.onUpdate(quote, userSymbol)
    }
  }
}

export function getPriceCache(): PriceCache {
  if (!globalThis.__tsPriceCache) {
    globalThis.__tsPriceCache = new PriceCache()
  }
  return globalThis.__tsPriceCache
}
