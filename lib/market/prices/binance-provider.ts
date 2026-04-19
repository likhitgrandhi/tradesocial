import type { AssetType } from "@/lib/trades/types"
import type { PriceProvider, Quote, Unsubscribe } from "./provider"

const BINANCE_REST = "https://api.binance.com/api/v3/ticker/price"
const BINANCE_WS = "wss://stream.binance.com:9443/ws/!ticker@arr"
const RECONNECT_DELAY_MS = 2000
const MAX_RECONNECT_DELAY_MS = 30000

type TickerMessage = { s?: string; c?: string; E?: number }

export class BinanceProvider implements PriceProvider {
  readonly name = "binance"

  private ws: WebSocket | null = null
  private subscribers = new Map<string, Set<(q: Quote) => void>>()
  private reconnectDelay = RECONNECT_DELAY_MS
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private latest = new Map<string, Quote>()

  supports(assetType: AssetType): boolean {
    return assetType === "crypto"
  }

  async getQuotes(providerSymbols: string[]): Promise<Quote[]> {
    if (providerSymbols.length === 0) return []

    const missing = providerSymbols.filter((s) => !this.latest.has(s))
    if (missing.length > 0) {
      try {
        const res = await fetch(
          `${BINANCE_REST}?symbols=${encodeURIComponent(JSON.stringify(missing))}`,
          { cache: "no-store" }
        )
        if (res.ok) {
          const rows = (await res.json()) as Array<{ symbol: string; price: string }>
          const now = Date.now()
          for (const r of rows) {
            const price = Number(r.price)
            if (Number.isFinite(price)) {
              this.latest.set(r.symbol, {
                symbol: r.symbol,
                price,
                currency: "USD",
                updatedAt: now,
              })
            }
          }
        }
      } catch {
        // REST fallback failed; return whatever we have cached.
      }
    }

    return providerSymbols
      .map((s) => this.latest.get(s))
      .filter((q): q is Quote => q !== undefined)
  }

  subscribe(providerSymbol: string, onTick: (q: Quote) => void): Unsubscribe {
    const key = providerSymbol.toUpperCase()
    let set = this.subscribers.get(key)
    if (!set) {
      set = new Set()
      this.subscribers.set(key, set)
    }
    set.add(onTick)

    this.ensureConnection()

    const cached = this.latest.get(key)
    if (cached) queueMicrotask(() => onTick(cached))

    return () => {
      const s = this.subscribers.get(key)
      if (!s) return
      s.delete(onTick)
      if (s.size === 0) this.subscribers.delete(key)
    }
  }

  private ensureConnection() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return
    }
    this.connect()
  }

  private connect() {
    try {
      this.ws = new WebSocket(BINANCE_WS)
    } catch {
      this.scheduleReconnect()
      return
    }

    this.ws.onopen = () => {
      this.reconnectDelay = RECONNECT_DELAY_MS
    }

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string)
        const tickers: TickerMessage[] = Array.isArray(data) ? data : [data]
        for (const t of tickers) {
          if (!t.s || !t.c) continue
          const price = Number(t.c)
          if (!Number.isFinite(price)) continue
          const quote: Quote = {
            symbol: t.s,
            price,
            currency: "USD",
            updatedAt: t.E ?? Date.now(),
          }
          this.latest.set(t.s, quote)
          const subs = this.subscribers.get(t.s)
          if (subs) for (const fn of subs) fn(quote)
        }
      } catch {
        // ignore malformed frame
      }
    }

    this.ws.onerror = () => {
      try { this.ws?.close() } catch {}
    }

    this.ws.onclose = () => {
      this.ws = null
      if (this.subscribers.size > 0) this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return
    const delay = this.reconnectDelay
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY_MS)
      this.connect()
    }, delay)
  }
}
