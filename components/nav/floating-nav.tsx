"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { NavLogo } from "./nav-logo"

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/leaderboard", label: "Leaderboard" },
]

export function FloatingNav() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop: floating pill nav ─────────────────────────────── */}
      <header className="fixed top-6 inset-x-0 z-50 px-6 hidden md:flex justify-center pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-6 bg-white dark:bg-[#1e1c1a] rounded-[999px] px-6 py-3 shadow-[0_4px_24px_0_rgba(0,0,0,0.06)] max-w-3xl w-full border border-[#F3F0EE] dark:border-white/8">
          {/* Logo */}
          <NavLogo />

          {/* Center links */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 text-[14px] font-medium tracking-tight rounded-full transition-all",
                    isActive
                      ? "bg-[#F3F0EE] dark:bg-white/10 text-[#141413] dark:text-[#F3F0EE]"
                      : "text-[#141413]/50 dark:text-[#F3F0EE]/40 hover:text-[#141413] dark:hover:text-[#F3F0EE] hover:bg-[#F3F0EE]/60 dark:hover:bg-white/6"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/log-trade"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#141413] dark:bg-[#F3F0EE] text-[#F3F0EE] dark:text-[#141413] text-[13px] font-medium tracking-tight hover:opacity-90 transition-opacity"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Log Trade
            </Link>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#141413]/50 dark:text-[#F3F0EE]/40 hover:bg-[#F3F0EE] dark:hover:bg-white/8 hover:text-[#141413] dark:hover:text-[#F3F0EE] transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full text-[#141413]/50 dark:text-[#F3F0EE]/40 hover:bg-[#F3F0EE] dark:hover:bg-white/8 hover:text-[#141413] dark:hover:text-[#F3F0EE] transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            {/* Avatar — auth stub, replaced by Clerk in Phase 1 auth task */}
            <div className="w-8 h-8 rounded-full bg-[#141413] dark:bg-[#F3F0EE] flex items-center justify-center text-[#F3F0EE] dark:text-[#141413] text-[11px] font-semibold cursor-pointer hover:opacity-85 transition-opacity">
              TS
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile: compact top bar ──────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 flex md:hidden items-center justify-between px-4 h-14 bg-[#F3F0EE]/90 dark:bg-[#141413]/90 backdrop-blur-md border-b border-[#D1CDC7]/40 dark:border-white/8">
        <NavLogo />
        <div className="flex items-center gap-1">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#141413]/60 dark:text-[#F3F0EE]/50 hover:bg-[#141413]/6 dark:hover:bg-white/8 transition-all"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#141413]/60 dark:text-[#F3F0EE]/50 hover:bg-[#141413]/6 dark:hover:bg-white/8 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-7 h-7 rounded-full bg-[#141413] dark:bg-[#F3F0EE] flex items-center justify-center text-[#F3F0EE] dark:text-[#141413] text-[10px] font-semibold cursor-pointer ml-1">
            TS
          </div>
        </div>
      </header>
    </>
  )
}
