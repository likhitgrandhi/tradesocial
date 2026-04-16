export default function FeedPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#141413] dark:text-[#F3F0EE]">
          Your Feed
        </h1>
        <p className="text-[14px] text-[#696969] dark:text-[#F3F0EE]/40 mt-0.5">
          Trades and activity from traders you follow
        </p>
      </div>

      {/* Trade card skeletons — replaced with real cards in Phase 3 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <TradeCardSkeleton key={i} />
      ))}
    </div>
  )
}

function TradeCardSkeleton() {
  return (
    <div className="rounded-[20px] bg-white dark:bg-[#1e1c1a] p-5 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] space-y-4 border border-[#F3F0EE] dark:border-white/6">
      {/* User row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F3F0EE] dark:bg-white/8 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-[#F3F0EE] dark:bg-white/8 rounded-full animate-pulse" />
            <div className="h-2.5 w-20 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-16 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
      </div>

      {/* Trade details row */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 bg-[#F3F0EE] dark:bg-white/8 rounded-[10px] animate-pulse" />
        <div className="h-3 w-24 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
        <div className="h-3 w-4/5 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
      </div>

      {/* Actions row */}
      <div className="flex items-center gap-4 pt-1">
        <div className="h-3 w-12 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
        <div className="h-3 w-16 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
