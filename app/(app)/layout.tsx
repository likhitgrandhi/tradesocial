import { redirect } from "next/navigation"

import { FloatingNav } from "@/components/nav/floating-nav"
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav"
import { getSession } from "@/lib/session"
import { getProfileById } from "@/lib/profiles/queries"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (session.userId) {
    const profile = await getProfileById(session.userId)
    if (!profile || !profile.onboarding_completed) {
      redirect("/onboarding")
    }
  }

  return (
    <div className="min-h-svh bg-background">
      <FloatingNav />

      <main
        className="mx-auto max-w-2xl px-4 md:px-6 pt-6 md:pt-8 pb-24 md:pb-12"
        id="main-content"
      >
        {children}
      </main>

      <MobileBottomNav />
    </div>
  )
}
