import type { AssetType } from "@/lib/trades/types"

export interface Quote {
  symbol: string
  price: number
  currency: string
  updatedAt: number
  stale?: boolean
}

export type Unsubscribe = () => void

export interface PriceProvider {
  readonly name: string
  supports(assetType: AssetType): boolean
  getQuotes(providerSymbols: string[]): Promise<Quote[]>
  subscribe?(providerSymbol: string, onTick: (q: Quote) => void): Unsubscribe
}
