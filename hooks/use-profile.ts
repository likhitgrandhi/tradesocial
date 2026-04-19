"use client"

import { useEffect, useState } from "react"

export interface MeProfile {
  userId: string
  email: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  onboarding_completed: boolean
}

type Listener = (p: MeProfile | null) => void

let cached: MeProfile | null | undefined = undefined
let inflight: Promise<MeProfile | null> | null = null
const listeners = new Set<Listener>()

async function fetchMe(): Promise<MeProfile | null> {
  const res = await fetch("/api/auth/me")
  if (!res.ok) return null
  return (await res.json()) as MeProfile
}

function loadOnce(): Promise<MeProfile | null> {
  if (cached !== undefined) return Promise.resolve(cached)
  if (inflight) return inflight
  inflight = fetchMe().then((p) => {
    cached = p
    inflight = null
    for (const l of listeners) l(p)
    return p
  })
  return inflight
}

export function refreshProfile(): Promise<MeProfile | null> {
  cached = undefined
  inflight = null
  return loadOnce()
}

export function clearProfileCache(): void {
  cached = null
  inflight = null
  for (const l of listeners) l(null)
}

export function useProfile(): { profile: MeProfile | null; isLoading: boolean } {
  const [profile, setProfile] = useState<MeProfile | null>(cached ?? null)
  const [isLoading, setIsLoading] = useState(cached === undefined)

  useEffect(() => {
    let mounted = true
    const listener: Listener = (p) => {
      if (mounted) setProfile(p)
    }
    listeners.add(listener)
    loadOnce().then((p) => {
      if (mounted) {
        setProfile(p)
        setIsLoading(false)
      }
    })
    return () => {
      mounted = false
      listeners.delete(listener)
    }
  }, [])

  return { profile, isLoading }
}
