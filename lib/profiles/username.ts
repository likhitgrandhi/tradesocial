const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/

const RESERVED = new Set([
  "admin", "api", "auth", "feed", "explore", "settings", "onboarding",
  "login", "signup", "terms", "privacy", "me", "p", "u", "dashboard",
  "markets", "log-trade", "logout", "help", "about", "support", "home",
  "notifications", "search", "new", "edit", "trade", "trades", "post",
  "posts", "www", "root", "system", "null", "undefined",
])

export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase()
}

export function validateUsername(raw: string): { ok: true; normalized: string } | { ok: false; reason: string } {
  const normalized = normalizeUsername(raw)
  if (!USERNAME_REGEX.test(normalized)) {
    return { ok: false, reason: "Use 3–20 lowercase letters, numbers, or underscores." }
  }
  if (RESERVED.has(normalized)) {
    return { ok: false, reason: "That username is reserved." }
  }
  return { ok: true, normalized }
}
