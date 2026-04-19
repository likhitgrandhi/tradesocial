/**
 * Per-user sliding-window rate limiter (in-memory).
 *
 * Not shared across serverless instances — this is a blunt tool to stop a
 * single logged-in user from hammering a single process. Swap for Upstash/
 * Redis before public launch if multiple instances matter.
 */

type Entry = { hits: number[]; }

const buckets = new Map<string, Entry>()

export function checkRateLimit(
  key: string,
  maxHits: number,
  windowMs: number,
  now = Date.now()
): { ok: true } | { ok: false; retryAfterMs: number } {
  let entry = buckets.get(key)
  if (!entry) {
    entry = { hits: [] }
    buckets.set(key, entry)
  }
  const cutoff = now - windowMs
  entry.hits = entry.hits.filter((t) => t > cutoff)
  if (entry.hits.length >= maxHits) {
    const oldest = entry.hits[0]
    return { ok: false, retryAfterMs: Math.max(0, oldest + windowMs - now) }
  }
  entry.hits.push(now)
  return { ok: true }
}
