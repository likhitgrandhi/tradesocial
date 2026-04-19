"use client"

import { useMemo } from "react"

import { cn } from "@/lib/utils"

type TradingViewWidgetProps = {
  scriptSrc: string
  config: Record<string, unknown>
  className?: string
  minHeight?: number
  fillHeight?: boolean
}

// TradingView widgets are rendered inside an isolated iframe via srcDoc. This
// lets us:
//   - swap the whole frame atomically when theme/config changes (no half-torn-down
//     widget state, no "contentWindow is not available" errors bubbling up)
//   - keep TradingView's internal scripts sandboxed from our app
function buildSrcDoc(scriptSrc: string, configJson: string) {
  return `<!DOCTYPE html>
<html style="height:100%">
  <head>
    <meta charset="utf-8" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; height: 100%; background: transparent; overflow: hidden; }
      .tradingview-widget-container { display: flex; flex-direction: column; width: 100%; height: 100%; }
      .tradingview-widget-container__widget { flex: 1; min-height: 0; width: 100%; }
      .tradingview-widget-copyright {
        flex-shrink: 0;
        font: 400 13px 'Trebuchet MS', sans-serif;
        line-height: 32px;
        text-align: center;
      }
      .tradingview-widget-copyright a { text-decoration: none; color: #2962ff; }
      .tradingview-widget-copyright a .blue-text { color: #2962ff; }
    </style>
  </head>
  <body>
    <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span class="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
      <script type="text/javascript" src="${scriptSrc}" async>${configJson}</script>
    </div>
  </body>
</html>`
}

export function TradingViewWidget({
  scriptSrc,
  config,
  className,
  minHeight = 400,
  fillHeight = false,
}: TradingViewWidgetProps) {
  const configJson = useMemo(() => JSON.stringify(config), [config])
  const srcDoc = useMemo(() => buildSrcDoc(scriptSrc, configJson), [scriptSrc, configJson])

  return (
    <iframe
      key={srcDoc}
      srcDoc={srcDoc}
      title="TradingView widget"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      className={cn("w-full border-0 bg-transparent block", className)}
      style={fillHeight ? { minHeight, height: "100%" } : { minHeight, height: minHeight }}
    />
  )
}
