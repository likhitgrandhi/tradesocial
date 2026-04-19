export function formatCurrency(
  value: number,
  currency = "USD",
  opts: { sign?: boolean; maxDigits?: number } = {}
): string {
  const maxDigits = opts.maxDigits ?? (Math.abs(value) >= 1 ? 2 : 6)
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: Math.min(maxDigits, 2),
    signDisplay: opts.sign ? "exceptZero" : "auto",
  })
  return formatter.format(value)
}

export function formatPercent(value: number, opts: { sign?: boolean } = {}): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    signDisplay: opts.sign ? "exceptZero" : "auto",
  })
  return formatter.format(value / 100)
}

export function formatPrice(value: number, currency = "USD"): string {
  return formatCurrency(value, currency, {
    maxDigits: Math.abs(value) >= 100 ? 2 : Math.abs(value) >= 1 ? 2 : 6,
  })
}

export function formatRelativeTime(ms: number, now = Date.now()): string {
  const diff = Math.max(0, now - ms)
  const s = Math.round(diff / 1000)
  if (s < 5) return "just now"
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}
