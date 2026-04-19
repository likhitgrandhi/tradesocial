import { createServiceClient } from "@/lib/supabase/service"

function client() {
  return createServiceClient()
}

export async function listWatchlist(userId: string): Promise<string[]> {
  const { data, error } = await client()
    .from("watchlists")
    .select("symbol")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => r.symbol as string)
}

export async function addToWatchlist(userId: string, symbol: string): Promise<void> {
  const { error } = await client()
    .from("watchlists")
    .insert({ user_id: userId, symbol })
  if (error && error.code !== "23505") throw error // 23505 = unique violation (already exists)
}

export async function removeFromWatchlist(userId: string, symbol: string): Promise<void> {
  const { error } = await client()
    .from("watchlists")
    .delete()
    .eq("user_id", userId)
    .eq("symbol", symbol)
  if (error) throw error
}
