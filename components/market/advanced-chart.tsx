"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { TradingViewWidget } from "./tradingview-widget"

type AdvancedChartProps = {
  symbol: string
  interval?: "1" | "5" | "15" | "30" | "60" | "240" | "D" | "W" | "M"
  className?: string
  minHeight?: number
}

export function AdvancedChart({
  symbol,
  interval = "D",
  className,
  minHeight = 600,
}: AdvancedChartProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn("w-full", className)} style={{ minHeight }} aria-hidden="true" />
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  const config = {
    autosize: true,
    symbol,
    interval,
    timezone: "Etc/UTC",
    theme,
    style: "1",
    locale: "en",
    enable_publishing: false,
    allow_symbol_change: true,
    calendar: false,
    hide_side_toolbar: false,
    withdateranges: true,
    support_host: "https://www.tradingview.com",
  }

  return (
    <TradingViewWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      config={config}
      className={className}
      minHeight={minHeight}
      fillHeight
    />
  )
}
