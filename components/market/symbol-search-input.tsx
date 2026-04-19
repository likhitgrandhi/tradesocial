"use client"

import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { isValidSymbol, normalizeSymbol } from "@/lib/market/symbols"

type SymbolSuggestion = {
  symbol: string
  fullName: string
  description: string
  exchange: string
  type: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

async function searchSymbols(q: string): Promise<SymbolSuggestion[]> {
  const res = await fetch(`/api/market/search?q=${encodeURIComponent(q)}`)
  if (!res.ok) return []
  const data: { symbols?: SymbolSuggestion[] } = await res.json()
  return data.symbols ?? []
}

export function SymbolSearchInput({
  className,
  placeholder = "Search a symbol, company, or crypto (e.g. Apple, AAPL, BTC)",
  autoFocus = false,
}: {
  className?: string
  placeholder?: string
  autoFocus?: boolean
}) {
  const router = useRouter()
  const [value, setValue] = useState("")
  const [suggestions, setSuggestions] = useState<SymbolSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(value, 300)

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (!q) {
      setSuggestions([])
      setOpen(false)
      return
    }
    let cancelled = false
    setLoading(true)
    searchSymbols(q)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results)
          setOpen(results.length > 0)
          setActiveIdx(-1)
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedQuery])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  function navigateTo(symbol: string) {
    const normalized = normalizeSymbol(symbol)
    if (!isValidSymbol(normalized)) return
    setOpen(false)
    setValue("")
    router.push(`/markets/${encodeURIComponent(normalized)}`)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (activeIdx >= 0 && suggestions[activeIdx]) {
      navigateTo(suggestions[activeIdx].symbol)
      return
    }
    const normalized = normalizeSymbol(value)
    if (isValidSymbol(normalized)) navigateTo(normalized)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === "Escape") {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={onSubmit} role="search">
        <label htmlFor="symbol-search" className="sr-only">
          Search a symbol
        </label>
        <div className="relative">
          {loading ? (
            <Loader2
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted"
              aria-hidden="true"
            />
          )}
          <input
            ref={inputRef}
            id="symbol-search"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={open}
            aria-controls="symbol-suggestions"
            aria-activedescendant={activeIdx >= 0 ? `suggestion-${activeIdx}` : undefined}
            aria-autocomplete="list"
            className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised pl-10 pr-16 text-content-primary placeholder:text-content-muted outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
            style={{ fontSize: "var(--font-size-14)" }}
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-3 rounded-[var(--radius-md)] bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors"
            style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-medium)" }}
          >
            Go
          </button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <ul
          id="symbol-suggestions"
          role="listbox"
          aria-label="Symbol suggestions"
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-surface-raised shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.fullName}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault()
                navigateTo(s.symbol)
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors",
                i === activeIdx
                  ? "bg-surface-accent-subtle"
                  : "hover:bg-surface-muted"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "truncate",
                      i === activeIdx ? "text-action-primary" : "text-content-primary"
                    )}
                    style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {s.symbol}
                  </span>
                  <span
                    className="shrink-0 rounded px-1.5 py-0.5 bg-surface-muted text-content-muted"
                    style={{ fontSize: "var(--font-size-10)" }}
                  >
                    {s.exchange}
                  </span>
                </div>
                {s.description && (
                  <div
                    className="truncate text-content-muted"
                    style={{ fontSize: "var(--font-size-12)" }}
                  >
                    {s.description}
                  </div>
                )}
              </div>
              <span
                className="shrink-0 text-content-disabled capitalize"
                style={{ fontSize: "var(--font-size-11)" }}
              >
                {s.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
