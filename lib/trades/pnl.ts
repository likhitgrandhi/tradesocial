import type { TradeSide } from "./types"

export interface PnlInput {
  side: TradeSide
  quantity: number
  entryPrice: number
  currentPrice: number
  fees?: number
}

export function computePnl({
  side,
  quantity,
  entryPrice,
  currentPrice,
  fees = 0,
}: PnlInput): number {
  const direction = side === "long" ? 1 : -1
  return (currentPrice - entryPrice) * quantity * direction - fees
}

export function computePnlPercent({
  side,
  entryPrice,
  currentPrice,
}: {
  side: TradeSide
  entryPrice: number
  currentPrice: number
}): number {
  if (entryPrice === 0) return 0
  const direction = side === "long" ? 1 : -1
  return ((currentPrice - entryPrice) / entryPrice) * 100 * direction
}
