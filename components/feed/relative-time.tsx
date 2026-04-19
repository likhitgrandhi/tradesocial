"use client"

import { useEffect, useState } from "react"

import { formatRelativeTime } from "@/lib/format"

export function RelativeTime({ ts }: { ts: string }) {
  const [, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  const ms = new Date(ts).getTime()
  return (
    <time dateTime={ts} title={new Date(ts).toLocaleString()}>
      {formatRelativeTime(ms)}
    </time>
  )
}
