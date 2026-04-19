import { createServiceClient } from "@/lib/supabase/service"
import type { PublicProfile, AssetFocus } from "./types"
import type { UpdateProfileInput } from "./schema"

function client() {
  return createServiceClient()
}

function mapProfile(row: Record<string, unknown>): PublicProfile {
  return {
    id: row.id as string,
    username: (row.username as string | null) ?? null,
    display_name: (row.display_name as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
    asset_focus: (row.asset_focus as AssetFocus | null) ?? null,
    followers_count: Number(row.followers_count ?? 0),
    following_count: Number(row.following_count ?? 0),
    is_verified: Boolean(row.is_verified),
    onboarding_completed: Boolean(row.onboarding_completed),
    created_at: row.created_at as string,
  }
}

const PROFILE_COLUMNS =
  "id, username, display_name, bio, avatar_url, asset_focus, followers_count, following_count, is_verified, onboarding_completed, created_at"

export async function getProfileById(id: string): Promise<PublicProfile | null> {
  const { data, error } = await client()
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle()
  if (error) throw error
  return data ? mapProfile(data as Record<string, unknown>) : null
}

export async function getProfileByUsername(username: string): Promise<PublicProfile | null> {
  const { data, error } = await client()
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .ilike("username", username)
    .maybeSingle()
  if (error) throw error
  return data ? mapProfile(data as Record<string, unknown>) : null
}

export async function updateProfile(
  id: string,
  patch: UpdateProfileInput
): Promise<PublicProfile> {
  const update: Record<string, unknown> = {}
  if (patch.display_name !== undefined) update.display_name = patch.display_name
  if (patch.bio !== undefined) update.bio = patch.bio
  if (patch.avatar_url !== undefined) update.avatar_url = patch.avatar_url === "" ? null : patch.avatar_url
  if (patch.asset_focus !== undefined) update.asset_focus = patch.asset_focus

  const { data, error } = await client()
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select(PROFILE_COLUMNS)
    .single()
  if (error) throw error
  return mapProfile(data as Record<string, unknown>)
}

export async function claimUsername(
  id: string,
  normalizedUsername: string,
  displayName: string,
  assetFocus?: AssetFocus
): Promise<PublicProfile> {
  const update: Record<string, unknown> = {
    username: normalizedUsername,
    display_name: displayName,
    onboarding_completed: true,
  }
  if (assetFocus) update.asset_focus = assetFocus

  const { data, error } = await client()
    .from("profiles")
    .update(update)
    .eq("id", id)
    .select(PROFILE_COLUMNS)
    .single()
  if (error) throw error
  return mapProfile(data as Record<string, unknown>)
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { count, error } = await client()
    .from("follows")
    .select("follower_id", { count: "exact", head: true })
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
  if (error) throw error
  return (count ?? 0) > 0
}

export async function follow(followerId: string, followingId: string): Promise<void> {
  const { error } = await client()
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId })
  // 23505 = unique violation (already following) — idempotent success
  // 23514 = check constraint (self-follow) — propagate
  if (error && error.code !== "23505") throw error
}

export async function unfollow(followerId: string, followingId: string): Promise<void> {
  const { error } = await client()
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
  if (error) throw error
}

export async function listSuggestedProfiles(limit = 5): Promise<PublicProfile[]> {
  const { data, error } = await client()
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("is_verified", true)
    .not("username", "is", null)
    .limit(limit)
  if (error) throw error
  return (data ?? []).map((r) => mapProfile(r as Record<string, unknown>))
}
