import { createServiceClient } from "@/lib/supabase/service"
import type { Trade, TradeStatus } from "./types"

function client() {
  return createServiceClient()
}

function mapRow(row: Record<string, unknown>): Trade {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    symbol: row.symbol as string,
    provider_symbol: row.provider_symbol as string,
    asset_type: row.asset_type as Trade["asset_type"],
    currency: row.currency as string,
    side: row.side as Trade["side"],
    quantity: Number(row.quantity),
    entry_price: Number(row.entry_price),
    entry_at: row.entry_at as string,
    exit_price: row.exit_price != null ? Number(row.exit_price) : null,
    exit_at: (row.exit_at as string | null) ?? null,
    realized_pnl: row.realized_pnl != null ? Number(row.realized_pnl) : null,
    fees: Number(row.fees ?? 0),
    notes: (row.notes as string | null) ?? null,
    source: row.source as Trade["source"],
    status: row.status as TradeStatus,
    metadata: (row.metadata as Trade["metadata"]) ?? {},
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }
}

export async function insertTrade(input: Omit<Trade, "id" | "created_at" | "updated_at">): Promise<Trade> {
  const { data, error } = await client()
    .from("trades")
    .insert(input)
    .select("*")
    .single()
  if (error) throw error
  return mapRow(data as Record<string, unknown>)
}

export async function listTrades(userId: string, status?: TradeStatus): Promise<Trade[]> {
  let q = client().from("trades").select("*").eq("user_id", userId)
  if (status) q = q.eq("status", status)
  const { data, error } = await q.order("entry_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => mapRow(r as Record<string, unknown>))
}

export async function closeTrade(
  id: string,
  userId: string,
  patch: { exit_price: number; exit_at: string; realized_pnl: number }
): Promise<Trade | null> {
  const { data, error } = await client()
    .from("trades")
    .update({
      status: "closed",
      exit_price: patch.exit_price,
      exit_at: patch.exit_at,
      realized_pnl: patch.realized_pnl,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("status", "open")
    .select("*")
    .maybeSingle()
  if (error) throw error
  return data ? mapRow(data as Record<string, unknown>) : null
}

export async function deleteTrade(id: string, userId: string): Promise<boolean> {
  const { error, count } = await client()
    .from("trades")
    .delete({ count: "exact" })
    .eq("id", id)
    .eq("user_id", userId)
  if (error) throw error
  return (count ?? 0) > 0
}
