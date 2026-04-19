import { FeedView } from "@/components/feed/feed-view"
import type { FeedScope } from "@/lib/posts/types"

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; share?: string }>
}) {
  const params = await searchParams
  const scope: FeedScope = params.tab === "following" ? "following" : "for-you"
  const initialTradeId = params.share ?? null

  return <FeedView scope={scope} initialTradeId={initialTradeId} />
}
