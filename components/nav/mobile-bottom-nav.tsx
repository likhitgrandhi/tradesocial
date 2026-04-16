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
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 dark:bg-[#1e1c1a]/95 backdrop-blur-md border-t border-[#D1CDC7]/40 dark:border-white/8 safe-area-pb"
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
                className="flex flex-col items-center gap-1 -mt-5"
              >
                <span className="w-12 h-12 flex items-center justify-center rounded-full bg-[#141413] dark:bg-[#F3F0EE] text-[#F3F0EE] dark:text-[#141413] shadow-[0_4px_20px_0_rgba(0,0,0,0.18)] hover:opacity-90 transition-opacity">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[10px] font-medium text-[#696969] dark:text-[#F3F0EE]/40">
                  Log
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors min-w-[52px]",
                isActive
                  ? "text-[#141413] dark:text-[#F3F0EE]"
                  : "text-[#696969] dark:text-[#F3F0EE]/40 hover:text-[#141413] dark:hover:text-[#F3F0EE]"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all",
                  isActive && "stroke-[2.2px]"
                )}
              />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
