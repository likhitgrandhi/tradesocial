export default function MarketsLayout({ children }: { children: React.ReactNode }) {
  // Break out of the parent (app) layout's max-w-2xl centered column so
  // charts and market widgets can use the full viewport width.
  return (
    <div className="relative left-1/2 -ml-[50vw] w-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6">{children}</div>
    </div>
  )
}
