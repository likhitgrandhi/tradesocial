"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        // Position: above mobile bottom nav on small screens, corner on desktop
        "fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50",
        "flex items-center gap-2 rounded-full px-3 py-2",
        "bg-white dark:bg-[#1e1c1a]",
        "border border-[#E8E4E0] dark:border-white/10",
        "shadow-[0_4px_20px_0_rgba(0,0,0,0.07)]",
        "hover:shadow-[0_4px_24px_0_rgba(0,0,0,0.12)]",
        "transition-all duration-200 group"
      )}
    >
      {/* Icon */}
      {isDark ? (
        <Moon className="w-3.5 h-3.5 text-[#F3F0EE]/60 group-hover:text-[#F3F0EE] transition-colors" />
      ) : (
        <Sun className="w-3.5 h-3.5 text-[#141413]/50 group-hover:text-[#141413] transition-colors" />
      )}

      {/* Toggle track */}
      <div
        className={cn(
          "relative w-9 h-5 rounded-full transition-colors duration-200",
          isDark ? "bg-[#F37338]" : "bg-[#D1CDC7]"
        )}
      >
        {/* Thumb */}
        <div
          className={cn(
            "absolute top-[3px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform duration-200",
            isDark ? "translate-x-[19px]" : "translate-x-[3px]"
          )}
        />
      </div>
    </button>
  )
}
