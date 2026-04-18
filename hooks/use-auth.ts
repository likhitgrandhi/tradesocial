"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthUser {
  userId: string
  email: string
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .finally(() => setIsLoading(false))
  }, [])

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return {
    email: user?.email,
    userId: user?.userId,
    isLoading,
    logout,
  }
}
