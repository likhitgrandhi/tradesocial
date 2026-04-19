export type DiscoverySymbol = {
  /** URL-facing symbol, e.g. "AAPL" or "BTCUSDT" */
  symbol: string
  /** TradingView fully-qualified symbol used inside widgets, e.g. "NASDAQ:AAPL" */
  tvSymbol: string
  name: string
  assetClass: "stock" | "crypto" | "forex" | "index"
}

export const POPULAR_SYMBOLS: DiscoverySymbol[] = [
  { symbol: "AAPL", tvSymbol: "NASDAQ:AAPL", name: "Apple", assetClass: "stock" },
  { symbol: "TSLA", tvSymbol: "NASDAQ:TSLA", name: "Tesla", assetClass: "stock" },
  { symbol: "NVDA", tvSymbol: "NASDAQ:NVDA", name: "Nvidia", assetClass: "stock" },
  { symbol: "MSFT", tvSymbol: "NASDAQ:MSFT", name: "Microsoft", assetClass: "stock" },
  { symbol: "AMZN", tvSymbol: "NASDAQ:AMZN", name: "Amazon", assetClass: "stock" },
  { symbol: "GOOGL", tvSymbol: "NASDAQ:GOOGL", name: "Alphabet", assetClass: "stock" },
  { symbol: "META", tvSymbol: "NASDAQ:META", name: "Meta", assetClass: "stock" },
  { symbol: "SPY", tvSymbol: "AMEX:SPY", name: "S&P 500 ETF", assetClass: "index" },
  { symbol: "QQQ", tvSymbol: "NASDAQ:QQQ", name: "Nasdaq 100 ETF", assetClass: "index" },
  { symbol: "BTCUSDT", tvSymbol: "BINANCE:BTCUSDT", name: "Bitcoin", assetClass: "crypto" },
  { symbol: "ETHUSDT", tvSymbol: "BINANCE:ETHUSDT", name: "Ethereum", assetClass: "crypto" },
  { symbol: "SOLUSDT", tvSymbol: "BINANCE:SOLUSDT", name: "Solana", assetClass: "crypto" },
]

export const TICKER_TAPE_SYMBOLS = [
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
  { proName: "NASDAQ:AAPL", title: "Apple" },
  { proName: "NASDAQ:TSLA", title: "Tesla" },
  { proName: "NASDAQ:NVDA", title: "Nvidia" },
  { proName: "NASDAQ:MSFT", title: "Microsoft" },
  { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
  { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
  { proName: "FX:EURUSD", title: "EUR/USD" },
]

const SYMBOL_PATTERN = /^[A-Z0-9.\-:]{1,20}$/

export function isValidSymbol(raw: string): boolean {
  return SYMBOL_PATTERN.test(raw)
}

export function normalizeSymbol(raw: string): string {
  return raw.trim().toUpperCase()
}
