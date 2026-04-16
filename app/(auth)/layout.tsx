import { NavLogo } from "@/components/nav/nav-logo"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-[#F3F0EE] dark:bg-[#141413] flex flex-col">
      {/* Minimal auth header — just the logo */}
      <header className="p-6 md:p-8">
        <NavLogo href="/" />
      </header>

      {/* Centered form area */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        {children}
      </main>

      {/* Footer note */}
      <footer className="p-6 text-center">
        <p className="text-[12px] text-[#696969] dark:text-[#F3F0EE]/30">
          © {new Date().getFullYear()} TradeSocial. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
