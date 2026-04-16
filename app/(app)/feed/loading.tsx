export default function FeedLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-1.5">
        <div className="h-7 w-36 bg-[#F3F0EE] dark:bg-white/8 rounded-full animate-pulse" />
        <div className="h-4 w-56 bg-[#F3F0EE] dark:bg-white/6 rounded-full animate-pulse" />
      </div>

      {/* Card skeletons */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[20px] bg-white dark:bg-[#1e1c1a] p-5 shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] space-y-4 border border-[#F3F0EE] dark:border-white/6 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F3F0EE] dark:bg-white/8" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-[#F3F0EE] dark:bg-white/8 rounded-full" />
              <div className="h-2.5 w-20 bg-[#F3F0EE] dark:bg-white/6 rounded-full" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-16 bg-[#F3F0EE] dark:bg-white/8 rounded-[10px]" />
            <div className="h-3 w-24 self-center bg-[#F3F0EE] dark:bg-white/6 rounded-full" />
          </div>
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-[#F3F0EE] dark:bg-white/6 rounded-full" />
            <div className="h-3 w-4/5 bg-[#F3F0EE] dark:bg-white/6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
