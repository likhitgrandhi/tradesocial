import { NavLogo } from "@/components/nav/nav-logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-surface-base flex flex-col">
      {/* Minimal auth header */}
      <header className="flex h-16 items-center px-6 md:px-8 border-b border-border-default">
        <NavLogo href="/" />
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-content-disabled">
          © {new Date().getFullYear()} TradeSocial. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
