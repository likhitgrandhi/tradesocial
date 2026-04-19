import { notFound, redirect } from "next/navigation"

import { getSession } from "@/lib/session"
import { getProfileByUsername, isFollowing } from "@/lib/profiles/queries"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileTimeline } from "@/components/profile/profile-timeline"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const session = await getSession()
  if (!session.userId) notFound()

  const profile = await getProfileByUsername(username)
  if (!profile) notFound()

  // Case-insensitive canonicalization: always route to lowercase.
  if (profile.username && profile.username !== username) {
    redirect(`/u/${profile.username}`)
  }

  const isSelf = profile.id === session.userId
  const following = isSelf ? false : await isFollowing(session.userId, profile.id)

  return (
    <div className="space-y-4">
      <ProfileHeader profile={profile} isSelf={isSelf} isFollowing={following} />
      <h2
        className="text-content-secondary pt-2"
        style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
      >
        Posts
      </h2>
      {profile.username ? <ProfileTimeline username={profile.username} /> : null}
    </div>
  )
}
