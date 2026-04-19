"use client"

import { Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { SYMBOL_CATALOG } from "@/lib/market/symbols-catalog"

const CATALOG_BY_SYMBOL = new Map(SYMBOL_CATALOG.map((e) => [e.symbol, e]))

type WatchlistPanelProps = {
  symbols: string[]
  activeSymbol: string | null
  onSelect: (symbol: string) => void
  onRemove: (symbol: string) => void
  onAddClick: () => void
}

export function WatchlistPanel({
  symbols,
  activeSymbol,
  onSelect,
  onRemove,
  onAddClick,
}: WatchlistPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-semibold)" }}
        >
          Watch list
        </h3>
        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add stocks to watch list"
          className="w-7 h-7 flex items-center justify-center rounded-md border border-border-default text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {symbols.length === 0 ? (
        <div
          className="px-4 pb-4 text-content-muted"
          style={{ fontSize: "var(--font-size-12)" }}
        >
          No stocks yet. Tap + to add from the catalog.
        </div>
      ) : (
        <ul className="flex-1 overflow-auto px-2 pb-2" role="list">
          {symbols.map((sym) => {
            const entry = CATALOG_BY_SYMBOL.get(sym)
            const isActive = activeSymbol === sym
            return (
              <li key={sym}>
                <div
                  className={cn(
                    "group flex items-center gap-2 px-2 py-2 rounded-[var(--radius-md)] transition-colors cursor-pointer",
                    isActive
                      ? "bg-surface-accent-subtle"
                      : "hover:bg-surface-raised"
                  )}
                  onClick={() => onSelect(sym)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelect(sym)
                    }
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "truncate",
                        isActive ? "text-action-primary" : "text-content-primary"
                      )}
                      style={{
                        fontSize: "var(--font-size-14)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      {sym}
                    </div>
                    {entry && (
                      <div
                        className="truncate text-content-muted"
                        style={{ fontSize: "var(--font-size-12)" }}
                      >
                        {entry.name}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${sym} from watch list`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(sym)
                    }}
                    className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-content-muted opacity-0 group-hover:opacity-100 hover:text-content-primary hover:bg-surface-muted transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
