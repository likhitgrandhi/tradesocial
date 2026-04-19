const NYSE_OPEN_MINUTES = 9 * 60 + 30
const NYSE_CLOSE_MINUTES = 16 * 60

export function isStockMarketOpen(at = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(at)

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? ""
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0")
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0")

  if (weekday === "Sat" || weekday === "Sun") return false
  const minutes = hour * 60 + minute
  return minutes >= NYSE_OPEN_MINUTES && minutes < NYSE_CLOSE_MINUTES
}
