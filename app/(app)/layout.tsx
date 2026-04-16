import { FloatingNav } from "@/components/nav/floating-nav"
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      <FloatingNav />

      {/* Content area — padded for fixed nav on desktop and mobile top/bottom bars */}
      <main
        className="mx-auto max-w-2xl px-4 md:px-6 pt-[3.5rem] md:pt-28 pb-24 md:pb-12"
        id="main-content"
      >
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
