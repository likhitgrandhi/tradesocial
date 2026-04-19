"use client"

import { useState } from "react"
import { History, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"
import { useWatchlist } from "@/lib/dashboard/use-watchlist"
import { AddStocksPanel } from "./add-stocks-panel"
import { WatchlistPanel } from "./watchlist-panel"
import type { DashboardView } from "./types"

type DashboardSidebarProps = {
  view: DashboardView
  onViewChange: (view: DashboardView) => void
}

const TOP_LINKS = [
  { id: "active-trades", label: "Active trades", icon: Wallet },
  { id: "history", label: "History", icon: History },
] as const

export function DashboardSidebar({ view, onViewChange }: DashboardSidebarProps) {
  const { symbols, add, remove } = useWatchlist()
  const [mode, setMode] = useState<"watchlist" | "add-stocks">("watchlist")

  const activeSymbol = view.type === "symbol" ? view.symbol : null

  return (
    <aside
      className="w-[280px] shrink-0 border-r border-border-default bg-surface-base flex flex-col h-full overflow-hidden"
      aria-label="Dashboard sidebar"
    >
      {mode === "watchlist" ? (
        <>
          <nav className="px-2 pt-3 pb-2 space-y-1" aria-label="Dashboard primary">
            {TOP_LINKS.map((link) => {
              const isActive = view.type === link.id
              const Icon = link.icon
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onViewChange({ type: link.id })}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-[var(--radius-md)] transition-colors",
                    isActive
                      ? "bg-surface-accent-subtle text-action-primary"
                      : "text-content-primary hover:bg-surface-raised"
                  )}
                  style={{
                    fontSize: "var(--font-size-14)",
                    fontWeight: isActive
                      ? "var(--font-weight-medium)"
                      : "var(--font-weight-regular)",
                  }}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {link.label}
                </button>
              )
            })}
          </nav>

          <div className="h-px bg-border-default mx-4 my-2" />

          <WatchlistPanel
            symbols={symbols}
            activeSymbol={activeSymbol}
            onSelect={(s) => onViewChange({ type: "symbol", symbol: s })}
            onRemove={remove}
            onAddClick={() => setMode("add-stocks")}
          />
        </>
      ) : (
        <AddStocksPanel
          addedSymbols={symbols}
          onAdd={add}
          onBack={() => setMode("watchlist")}
        />
      )}
    </aside>
  )
}
