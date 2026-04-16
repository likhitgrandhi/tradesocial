import { redirect } from "next/navigation"

// Root route redirects to the main feed
export default function RootPage() {
  redirect("/feed")
}
