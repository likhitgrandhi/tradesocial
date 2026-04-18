"use client"

import { HawcxProvider } from "@hawcx/react"

export function HawcxAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <HawcxProvider
      config={{
        apiBase: process.env.NEXT_PUBLIC_HAWCX_API_BASE_URL,
        configId: process.env.NEXT_PUBLIC_HAWCX_CONFIG_ID!,
      }}
    >
      {children}
    </HawcxProvider>
  )
}
