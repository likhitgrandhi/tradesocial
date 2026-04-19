"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, Check, Plus, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { SYMBOL_CATALOG, searchCatalog } from "@/lib/market/symbols-catalog"

type AddStocksPanelProps = {
  addedSymbols: string[]
  onAdd: (symbol: string) => void
  onBack: () => void
}

export function AddStocksPanel({ addedSymbols, onAdd, onBack }: AddStocksPanelProps) {
  const [query, setQuery] = useState("")
  const addedSet = useMemo(() => new Set(addedSymbols), [addedSymbols])

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return SYMBOL_CATALOG
    return searchCatalog(q, 200)
  }, [query])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to watch list"
          className="w-7 h-7 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3
          className="text-content-primary"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-semibold)" }}
        >
          Add stocks
        </h3>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-content-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol or name"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="h-9 w-full pl-9 pr-3 rounded-[var(--radius-md)] border border-border-default bg-surface-raised text-content-primary placeholder:text-content-muted outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
            style={{ fontSize: "var(--font-size-13)" }}
          />
        </div>
      </div>

      {results.length === 0 ? (
        <div
          className="px-4 py-6 text-content-muted"
          style={{ fontSize: "var(--font-size-13)" }}
        >
          No matches for &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <ul className="flex-1 overflow-auto px-2 pb-2" role="list">
          {results.map((entry) => {
            const added = addedSet.has(entry.symbol)
            return (
              <li
                key={entry.symbol}
                className="flex items-center gap-2 px-2 py-2 rounded-[var(--radius-md)] hover:bg-surface-raised transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-content-primary truncate"
                      style={{
                        fontSize: "var(--font-size-13)",
                        fontWeight: "var(--font-weight-medium)",
                      }}
                    >
                      {entry.symbol}
                    </span>
                    <span
                      className="shrink-0 px-1.5 py-0.5 rounded bg-surface-muted text-content-muted"
                      style={{ fontSize: "var(--font-size-10)" }}
                    >
                      {entry.exchange}
                    </span>
                  </div>
                  <div
                    className="truncate text-content-muted"
                    style={{ fontSize: "var(--font-size-11)" }}
                  >
                    {entry.name}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onAdd(entry.symbol)}
                  disabled={added}
                  aria-label={added ? `${entry.symbol} added` : `Add ${entry.symbol}`}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1 h-7 px-2 rounded-[var(--radius-md)] transition-colors",
                    added
                      ? "text-content-muted bg-surface-muted cursor-default"
                      : "text-action-primary bg-surface-accent-subtle hover:bg-surface-accent"
                  )}
                  style={{
                    fontSize: "var(--font-size-11)",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  {added ? (
                    <>
                      <Check className="w-3 h-3" aria-hidden="true" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" aria-hidden="true" />
                      Add
                    </>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
