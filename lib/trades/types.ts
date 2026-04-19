export type AssetType = "stock" | "crypto" | "forex" | "fund" | "index"
export type TradeSide = "long" | "short"
export type TradeStatus = "open" | "closed"
export type TradeSource = "manual" | "import" | "broker"

export interface TradeMetadata {
  strategy?: string
  stopLoss?: number
  takeProfit?: number
  thesis?: string
  tags?: string[]
  [key: string]: unknown
}

export interface Trade {
  id: string
  user_id: string
  symbol: string
  provider_symbol: string
  asset_type: AssetType
  currency: string
  side: TradeSide
  quantity: number
  entry_price: number
  entry_at: string
  exit_price: number | null
  exit_at: string | null
  realized_pnl: number | null
  fees: number
  notes: string | null
  source: TradeSource
  status: TradeStatus
  metadata: TradeMetadata
  created_at: string
  updated_at: string
}
