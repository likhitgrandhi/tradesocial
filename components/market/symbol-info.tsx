"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { TradingViewWidget } from "./tradingview-widget"

export function SymbolInfo({ symbol, className }: { symbol: string; className?: string }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn("w-full", className)} style={{ minHeight: 180 }} aria-hidden="true" />
  }

  const colorTheme = resolvedTheme === "dark" ? "dark" : "light"

  const config = {
    symbol,
    width: "100%",
    locale: "en",
    colorTheme,
    isTransparent: true,
  }

  return (
    <TradingViewWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
      config={config}
      className={className}
      minHeight={180}
    />
  )
}
