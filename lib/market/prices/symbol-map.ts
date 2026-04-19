import type { AssetType } from "@/lib/trades/types"
import { SYMBOL_CATALOG, type CatalogEntry } from "@/lib/market/symbols-catalog"

const BY_SYMBOL = new Map<string, CatalogEntry>(
  SYMBOL_CATALOG.map((e) => [e.symbol.toUpperCase(), e])
)

export interface ResolvedSymbol {
  symbol: string
  providerSymbol: string
  assetType: AssetType
  currency: string
}

export function resolveSymbol(symbolInput: string): ResolvedSymbol {
  const symbol = symbolInput.trim().toUpperCase()
  const entry = BY_SYMBOL.get(symbol)
  const assetType: AssetType = entry?.type ?? inferAssetType(symbol)

  return {
    symbol,
    providerSymbol: toProviderSymbol(symbol, assetType),
    assetType,
    currency: currencyFor(assetType, symbol),
  }
}

function inferAssetType(symbol: string): AssetType {
  if (/USDT$|USDC$|BUSD$/.test(symbol)) return "crypto"
  if (/^[A-Z]{6}$/.test(symbol)) return "forex"
  return "stock"
}

export function toProviderSymbol(symbol: string, assetType: AssetType): string {
  if (assetType === "crypto") return symbol
  if (assetType === "forex") return `${symbol}=X`
  return symbol
}

export function toYahooSymbol(symbol: string, assetType: AssetType): string {
  if (assetType === "crypto") {
    const m = symbol.match(/^([A-Z0-9]+?)(USDT|USDC|BUSD)$/)
    if (m) return `${m[1]}-USD`
    return symbol
  }
  if (assetType === "forex") {
    if (symbol.endsWith("=X")) return symbol
    return `${symbol}=X`
  }
  return symbol
}

function currencyFor(assetType: AssetType, symbol: string): string {
  if (assetType === "crypto") {
    if (symbol.endsWith("USDT") || symbol.endsWith("USDC") || symbol.endsWith("BUSD")) return "USD"
    return "USD"
  }
  if (assetType === "forex") {
    return symbol.slice(3, 6) || "USD"
  }
  return "USD"
}
