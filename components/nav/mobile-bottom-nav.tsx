"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, TrendingUp, Bell, User } from "lucide-react"

import { cn } from "@/lib/utils"

const TABS = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/log-trade", icon: TrendingUp, label: "Log Trade", isAction: true },
  { href: "/notifications", icon: Bell, label: "Alerts" },
  { href: "/profile", icon: User, label: "Profile" },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-surface-base border-t border-border-default"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/feed"
              ? pathname === "/feed" || pathname === "/"
              : pathname.startsWith(tab.href)
          const Icon = tab.icon

          if (tab.isAction) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                aria-label={tab.label}
                className="flex flex-col items-center gap-1 -mt-4"
              >
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] text-content-muted">Log</span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors min-w-[52px]",
                isActive
                  ? "text-action-primary"
                  : "text-content-muted hover:text-content-primary"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive && "stroke-[2.2px]"
                )}
              />
              <span className="text-[10px]" style={{ fontWeight: "var(--font-weight-medium)" }}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
