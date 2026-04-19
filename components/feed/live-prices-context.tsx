"use client"

import { createContext, useContext, useMemo } from "react"

import type { Quote } from "@/lib/market/prices/provider"
import { useLivePrices } from "@/components/dashboard/use-live-prices"

interface LivePricesValue {
  quotes: Record<string, Quote>
  lastUpdatedAt: number
}

const LivePricesContext = createContext<LivePricesValue>({
  quotes: {},
  lastUpdatedAt: 0,
})

export function LivePricesProvider({
  symbols,
  children,
}: {
  symbols: string[]
  children: React.ReactNode
}) {
  const { quotes, lastUpdatedAt } = useLivePrices(symbols)
  const value = useMemo(() => ({ quotes, lastUpdatedAt }), [quotes, lastUpdatedAt])
  return <LivePricesContext.Provider value={value}>{children}</LivePricesContext.Provider>
}

export function useLiveQuote(symbol: string | null | undefined): Quote | null {
  const ctx = useContext(LivePricesContext)
  if (!symbol) return null
  return ctx.quotes[symbol.toUpperCase()] ?? null
}
