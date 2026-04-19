"use client"

import { useCallback, useEffect, useState } from "react"

export function useWatchlist() {
  const [symbols, setSymbols] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    fetch("/api/watchlist")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.symbols)) setSymbols(data.symbols)
      })
      .catch(() => {})
      .finally(() => setHydrated(true))
  }, [])

  const add = useCallback((symbol: string) => {
    const upper = symbol.toUpperCase()
    setSymbols((prev) => (prev.includes(upper) ? prev : [...prev, upper]))
    fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol: upper }),
    }).catch(() => {
      setSymbols((prev) => prev.filter((s) => s !== upper))
    })
  }, [])

  const remove = useCallback((symbol: string) => {
    setSymbols((prev) => prev.filter((s) => s !== symbol))
    fetch(`/api/watchlist/${encodeURIComponent(symbol)}`, { method: "DELETE" }).catch(() => {
      setSymbols((prev) => [...prev, symbol])
    })
  }, [])

  return { symbols, add, remove, hydrated }
}
