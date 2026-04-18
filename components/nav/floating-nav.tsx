"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"
import { NavLogo } from "./nav-logo"
import { useAuth } from "@/hooks/use-auth"
import { useSession } from "@hawcx/react"

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/explore", label: "Explore" },
  { href: "/leaderboard", label: "Leaderboard" },
]

function getEmailInitials(email: string | undefined): string {
  if (!email) return "??"
  return email.split("@")[0].slice(0, 2).toUpperCase()
}

export function FloatingNav() {
  const pathname = usePathname()
  const { email, logout } = useAuth()
  const { actions: hawcxActions } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const desktopDropdownRef = useRef<HTMLDivElement>(null)
  const mobileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      const insideDesktop = desktopDropdownRef.current?.contains(target) ?? false
      const insideMobile = mobileDropdownRef.current?.contains(target) ?? false
      if (!insideDesktop && !insideMobile) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleLogout() {
    setDropdownOpen(false)
    hawcxActions.signOut()
    sessionStorage.removeItem("hawcx_pending_email")
    await logout()
  }

  const initials = getEmailInitials(email)

  return (
    <>
      {/* ── Desktop: sticky top bar (64px, flat) ───────────────────── */}
      <header className="sticky top-0 z-50 hidden md:flex h-16 w-full bg-surface-base border-b border-border-default relative">
        {/* Nav anchored to true viewport center — must be child of the full-width header, not the max-w inner div */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
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

        <div className="mx-auto flex items-center justify-between w-full max-w-[1280px] px-8">
          {/* Logo */}
          <NavLogo />

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

            {/* Avatar + dropdown */}
            <div className="relative" ref={desktopDropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-surface-accent-subtle flex items-center justify-center text-action-primary text-[11px] cursor-pointer transition-colors hover:bg-surface-accent"
                style={{ fontWeight: "var(--font-weight-bold)" }}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-44 rounded-[var(--radius-md)] bg-surface-raised border border-border-default shadow-lg py-1 z-50">
                  <button
                    className="w-full px-4 py-2 text-left text-content-disabled cursor-not-allowed"
                    style={{ fontSize: "var(--font-size-14)" }}
                    disabled
                  >
                    Profile
                  </button>
                  <div className="h-px bg-border-default mx-2 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-loss hover:bg-surface-muted transition-colors"
                    style={{ fontSize: "var(--font-size-14)" }}
                  >
                    Log out
                  </button>
                </div>
              )}
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

          {/* Mobile avatar + dropdown */}
          <div className="relative ml-1" ref={mobileDropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="w-8 h-8 rounded-full bg-action-primary flex items-center justify-center text-content-inverse text-[10px] cursor-pointer"
              style={{ fontWeight: "var(--font-weight-bold)" }}
              aria-label="User menu"
              aria-expanded={dropdownOpen}
            >
              {initials}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-44 rounded-[var(--radius-md)] bg-surface-raised border border-border-default shadow-lg py-1 z-50">
                <button
                  className="w-full px-4 py-2 text-left text-content-disabled cursor-not-allowed"
                  style={{ fontSize: "var(--font-size-14)" }}
                  disabled
                >
                  Profile
                </button>
                <div className="h-px bg-border-default mx-2 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-loss hover:bg-surface-muted transition-colors"
                  style={{ fontSize: "var(--font-size-14)" }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
