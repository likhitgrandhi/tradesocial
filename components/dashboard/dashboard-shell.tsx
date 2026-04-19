"use client"

import { useState } from "react"

import { DashboardMain } from "./dashboard-main"
import { DashboardSidebar } from "./dashboard-sidebar"
import type { DashboardView } from "./types"

export function DashboardShell() {
  const [view, setView] = useState<DashboardView>({ type: "active-trades" })

  return (
    <div className="flex w-full h-[calc(100svh-64px-64px)] md:h-[calc(100svh-64px)] overflow-hidden">
      <DashboardSidebar view={view} onViewChange={setView} />
      <main className="flex-1 overflow-hidden bg-surface-base">
        <DashboardMain view={view} onViewChange={setView} />
      </main>
    </div>
  )
}
