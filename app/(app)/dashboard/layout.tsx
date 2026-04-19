export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Break out of parent (app) layout's max-w-2xl container AND negate its
  // vertical padding (pt-6 md:pt-8 pb-24 md:pb-12) so the dashboard sits
  // flush under the top nav and above the mobile bottom nav.
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen -mt-6 md:-mt-8 -mb-24 md:-mb-12">
      {children}
    </div>
  )
}
