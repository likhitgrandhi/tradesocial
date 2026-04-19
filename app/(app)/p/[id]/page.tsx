import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getSession } from "@/lib/session"
import { getPost } from "@/lib/posts/queries"
import { stitchLivePrices } from "@/lib/posts/hydrate"
import { PostThread } from "@/components/feed/post-thread"

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session.userId) notFound()

  const post = await getPost(session.userId, id)
  if (!post) notFound()
  const [hydrated] = await stitchLivePrices([post])

  return (
    <div className="space-y-4">
      <Link
        href="/feed"
        className="inline-flex items-center gap-2 text-content-muted hover:text-content-primary transition-colors"
        style={{ fontSize: "var(--font-size-14)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to feed
      </Link>

      <PostThread initial={hydrated} />
    </div>
  )
}
