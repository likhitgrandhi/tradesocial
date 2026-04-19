"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { TradingViewWidget } from "./tradingview-widget"

type TickerTapeSymbol = {
  proName: string
  title: string
}

type TickerTapeProps = {
  symbols: TickerTapeSymbol[]
  className?: string
}

export function TickerTape({ symbols, className }: TickerTapeProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn("w-full", className)} style={{ minHeight: 72 }} aria-hidden="true" />
  }

  const colorTheme = resolvedTheme === "dark" ? "dark" : "light"

  const config = {
    symbols,
    showSymbolLogo: true,
    isTransparent: true,
    displayMode: "adaptive",
    colorTheme,
    locale: "en",
  }

  return (
    <TradingViewWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
      config={config}
      className={className}
      minHeight={72}
    />
  )
}
