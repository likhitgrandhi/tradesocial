export type AssetFocus = "STOCKS" | "CRYPTO" | "OPTIONS" | "FUTURES" | "MIXED"

export interface PublicProfile {
  id: string
  username: string | null
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  asset_focus: AssetFocus | null
  followers_count: number
  following_count: number
  is_verified: boolean
  onboarding_completed: boolean
  created_at: string
}
