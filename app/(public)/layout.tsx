import { FloatingNav } from "@/components/nav/floating-nav"
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav"

// Public pages (e.g. /@username profiles) — nav visible, no auth required
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-background">
      <FloatingNav />
      <main className="mx-auto max-w-2xl px-4 md:px-6 pt-[3.5rem] md:pt-28 pb-24 md:pb-12">
        {children}
      </main>
      <MobileBottomNav />
    </div>
  )
}
