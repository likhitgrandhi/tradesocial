"use client"

import { useEffect, useMemo, useState } from "react"

import type { Quote } from "@/lib/market/prices/provider"

const POLL_FALLBACK_MS = 15_000
const MAX_SSE_FAILURES = 2

interface LivePricesState {
  quotes: Record<string, Quote>
  lastUpdatedAt: number
}

export function useLivePrices(symbols: string[]): LivePricesState {
  const key = useMemo(() => {
    const normalized = Array.from(new Set(symbols.map((s) => s.toUpperCase()))).sort()
    return normalized.join(",")
  }, [symbols])

  const [quotes, setQuotes] = useState<Record<string, Quote>>({})
  const [lastUpdatedAt, setLastUpdatedAt] = useState(0)

  useEffect(() => {
    if (!key) return

    let cancelled = false
    let es: EventSource | null = null
    let pollTimer: ReturnType<typeof setInterval> | null = null
    let sseFailures = 0
    let paused = false

    const apply = (incoming: Record<string, Quote>) => {
      if (cancelled || Object.keys(incoming).length === 0) return
      setQuotes((prev) => ({ ...prev, ...incoming }))
      setLastUpdatedAt(Date.now())
    }

    const fetchSnapshot = async () => {
      try {
        const res = await fetch(`/api/market/prices?symbols=${encodeURIComponent(key)}`, {
          cache: "no-store",
        })
        if (!res.ok) return
        const json = (await res.json()) as { quotes: Record<string, Quote> }
        apply(json.quotes)
      } catch {
        // swallow; SSE or next poll will catch up
      }
    }

    const startPolling = () => {
      if (pollTimer) return
      void fetchSnapshot()
      pollTimer = setInterval(() => {
        if (!paused) void fetchSnapshot()
      }, POLL_FALLBACK_MS)
    }

    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = null
      }
    }

    const openSse = () => {
      try {
        es = new EventSource(`/api/market/prices/stream?symbols=${encodeURIComponent(key)}`)
      } catch {
        startPolling()
        return
      }

      es.addEventListener("quote", (ev: MessageEvent) => {
        try {
          const data = JSON.parse(ev.data) as Quote & { symbol: string }
          apply({ [data.symbol]: data })
        } catch {
          // ignore
        }
      })

      es.onerror = () => {
        sseFailures += 1
        try { es?.close() } catch {}
        es = null
        if (sseFailures >= MAX_SSE_FAILURES || cancelled) {
          startPolling()
        } else if (!cancelled) {
          setTimeout(() => {
            if (!cancelled && !paused) openSse()
          }, 1000 * sseFailures)
        }
      }
    }

    const onVisibility = () => {
      paused = document.visibilityState === "hidden"
      if (!paused) void fetchSnapshot()
    }

    document.addEventListener("visibilitychange", onVisibility)

    void fetchSnapshot()
    openSse()

    return () => {
      cancelled = true
      document.removeEventListener("visibilitychange", onVisibility)
      try { es?.close() } catch {}
      stopPolling()
    }
  }, [key])

  return { quotes, lastUpdatedAt }
}
