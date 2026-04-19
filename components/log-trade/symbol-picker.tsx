"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Loader2, Search } from "lucide-react"

import { cn } from "@/lib/utils"

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

interface SymbolPickerProps {
  value: string
  onChange: (symbol: string) => void
  placeholder?: string
  autoFocus?: boolean
}

export function SymbolPicker({ value, onChange, placeholder, autoFocus }: SymbolPickerProps) {
  const [input, setInput] = useState(value)
  const [suggestions, setSuggestions] = useState<SymbolSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounced = useDebounce(input, 250)

  useEffect(() => {
    setInput(value)
  }, [value])

  useEffect(() => {
    const q = debounced.trim()
    if (!q) {
      setSuggestions([])
      setOpen(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/market/search?q=${encodeURIComponent(q)}`)
      .then((r) => (r.ok ? r.json() : { symbols: [] }))
      .then((data: { symbols?: SymbolSuggestion[] }) => {
        if (cancelled) return
        setSuggestions(data.symbols ?? [])
        setOpen((data.symbols ?? []).length > 0)
        setActiveIdx(-1)
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [debounced])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [])

  function pick(symbol: string) {
    const upper = symbol.trim().toUpperCase()
    setInput(upper)
    onChange(upper)
    setOpen(false)
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault()
        pick(input)
      }
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIdx >= 0 && suggestions[activeIdx]) pick(suggestions[activeIdx].symbol)
      else pick(input)
    } else if (e.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        {loading ? (
          <Loader2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted animate-spin" aria-hidden="true" />
        ) : (
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-content-muted" aria-hidden="true" />
        )}
        <input
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus={autoFocus}
          value={input}
          onChange={(e) => {
            const v = e.target.value
            setInput(v)
            onChange(v.toUpperCase())
          }}
          onBlur={() => onChange(input.trim().toUpperCase())}
          onKeyDown={onKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder ?? "Search a symbol, company, or crypto"}
          className="h-11 w-full rounded-[var(--radius-md)] border border-border-default bg-surface-raised pl-10 pr-3 text-content-primary placeholder:text-content-muted outline-none focus:border-border-accent focus:ring-2 focus:ring-action-primary/20 transition-colors"
          style={{ fontSize: "var(--font-size-14)" }}
        />
      </div>
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-[var(--radius-md)] border border-border-default bg-surface-raised shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.fullName}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(s.symbol)
              }}
              onMouseEnter={() => setActiveIdx(i)}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors",
                i === activeIdx ? "bg-surface-accent-subtle" : "hover:bg-surface-muted"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn("truncate", i === activeIdx ? "text-action-primary" : "text-content-primary")}
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
                  <div className="truncate text-content-muted" style={{ fontSize: "var(--font-size-12)" }}>
                    {s.description}
                  </div>
                )}
              </div>
              <span className="shrink-0 text-content-disabled capitalize" style={{ fontSize: "var(--font-size-11)" }}>
                {s.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
