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
      {/* ── Desktop: sticky top bar (64px, flat) ───────────────────── */}
      <header className="sticky top-0 z-50 hidden md:flex h-16 w-full bg-surface-base border-b border-border-default">
        <div className="mx-auto grid grid-cols-[auto_1fr_auto] items-center w-full max-w-[1280px] px-8 gap-8">
          {/* Logo */}
          <NavLogo />

          {/* Center nav links */}
          <nav className="flex flex-1 items-center justify-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "text-action-primary bg-surface-accent-subtle"
                      : "text-content-muted hover:text-content-primary hover:bg-surface-raised"
                  )}
                  style={{ fontWeight: isActive ? "var(--font-weight-medium)" : "var(--font-weight-regular)" }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Primary CTA */}
            <Link
              href="/log-trade"
              className="flex items-center gap-1.5 h-10 px-4 rounded-md border border-border-default bg-surface-raised text-content-primary text-sm hover:bg-surface-muted transition-colors"
              style={{ fontWeight: "var(--font-weight-medium)" }}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Log Trade
            </Link>

            <button
              className="w-9 h-9 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Avatar stub — replaced by Clerk in TRA-8 */}
            <div className="w-8 h-8 rounded-full bg-surface-accent-subtle flex items-center justify-center text-action-primary text-[11px] cursor-pointer transition-colors"
              style={{ fontWeight: "var(--font-weight-bold)" }}>
              TS
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile: compact top bar (64px, flat) ───────────────────── */}
      <header className="sticky top-0 z-50 flex md:hidden h-16 w-full items-center justify-between px-4 bg-surface-base border-b border-border-default">
        <NavLogo />
        <div className="flex items-center gap-1">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-raised transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-action-primary flex items-center justify-center text-content-inverse text-[10px] cursor-pointer ml-1"
            style={{ fontWeight: "var(--font-weight-bold)" }}>
            TS
          </div>
        </div>
      </header>
    </>
  )
}
