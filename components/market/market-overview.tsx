"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { TradingViewWidget } from "./tradingview-widget"

export function MarketOverview({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn("w-full", className)} style={{ minHeight: 560 }} aria-hidden="true" />
  }

  const colorTheme = resolvedTheme === "dark" ? "dark" : "light"

  const config = {
    colorTheme,
    dateRange: "12M",
    showChart: true,
    locale: "en",
    largeChartUrl: "",
    isTransparent: true,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    width: "100%",
    height: 550,
    plotLineColorGrowing: "rgba(4, 173, 131, 1)",
    plotLineColorFalling: "rgba(237, 85, 51, 1)",
    gridLineColor: "rgba(42, 46, 57, 0)",
    scaleFontColor: "rgba(120, 123, 134, 1)",
    belowLineFillColorGrowing: "rgba(4, 173, 131, 0.12)",
    belowLineFillColorFalling: "rgba(237, 85, 51, 0.12)",
    belowLineFillColorGrowingBottom: "rgba(4, 173, 131, 0)",
    belowLineFillColorFallingBottom: "rgba(237, 85, 51, 0)",
    symbolActiveColor: "rgba(4, 173, 131, 0.12)",
    tabs: [
      {
        title: "Indices",
        symbols: [
          { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
          { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
          { s: "FOREXCOM:DJI", d: "Dow 30" },
          { s: "INDEX:NKY", d: "Nikkei 225" },
          { s: "INDEX:DEU40", d: "DAX" },
          { s: "FOREXCOM:UKXGBP", d: "FTSE 100" },
        ],
        originalTitle: "Indices",
      },
      {
        title: "Stocks",
        symbols: [
          { s: "NASDAQ:AAPL", d: "Apple" },
          { s: "NASDAQ:TSLA", d: "Tesla" },
          { s: "NASDAQ:NVDA", d: "Nvidia" },
          { s: "NASDAQ:MSFT", d: "Microsoft" },
          { s: "NASDAQ:AMZN", d: "Amazon" },
          { s: "NASDAQ:GOOGL", d: "Alphabet" },
          { s: "NASDAQ:META", d: "Meta" },
        ],
        originalTitle: "Stocks",
      },
      {
        title: "Crypto",
        symbols: [
          { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
          { s: "BINANCE:ETHUSDT", d: "Ethereum" },
          { s: "BINANCE:SOLUSDT", d: "Solana" },
          { s: "BINANCE:BNBUSDT", d: "BNB" },
        ],
        originalTitle: "Crypto",
      },
      {
        title: "Forex",
        symbols: [
          { s: "FX:EURUSD", d: "EUR/USD" },
          { s: "FX:GBPUSD", d: "GBP/USD" },
          { s: "FX:USDJPY", d: "USD/JPY" },
          { s: "FX:USDCAD", d: "USD/CAD" },
        ],
        originalTitle: "Forex",
      },
    ],
  }

  return (
    <TradingViewWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
      config={config}
      className={className}
      minHeight={560}
    />
  )
}
