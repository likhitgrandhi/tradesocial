"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50",
        "flex items-center gap-2 rounded-md px-3 py-2",
        // Flat design — border only, no shadow
        "bg-surface-base border border-border-default",
        "hover:bg-surface-raised transition-colors group"
      )}
    >
      {/* Icon */}
      {isDark ? (
        <Moon className="w-3.5 h-3.5 text-content-muted group-hover:text-content-primary transition-colors" />
      ) : (
        <Sun className="w-3.5 h-3.5 text-content-muted group-hover:text-content-primary transition-colors" />
      )}

      {/* Toggle track */}
      <div
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors duration-200",
          isDark ? "bg-action-primary" : "bg-surface-muted"
        )}
      >
        {/* Thumb */}
        <div
          className={cn(
            "absolute top-[3px] w-[14px] h-[14px] rounded-full bg-surface-base transition-transform duration-200",
            isDark ? "translate-x-[19px]" : "translate-x-[3px]"
          )}
        />
      </div>
    </button>
  )
}
