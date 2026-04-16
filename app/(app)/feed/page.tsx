export default function FeedPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-content-secondary" style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-medium)", lineHeight: "32px" }}>
          Your Feed
        </h1>
        <p className="text-content-muted mt-0.5" style={{ fontSize: "var(--font-size-14)" }}>
          Trades and activity from traders you follow
        </p>
      </div>

      {/* Skeleton cards — replaced with real cards in Phase 3 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <TradeCardSkeleton key={i} />
      ))}
    </div>
  )
}

function TradeCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-4 space-y-4">
      {/* User row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-28 bg-surface-muted rounded animate-pulse" />
            <div className="h-2.5 w-20 bg-surface-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-16 bg-surface-muted rounded-[var(--radius-md)] animate-pulse" />
      </div>

      {/* Trade chip + label */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-16 bg-surface-muted rounded-[var(--radius-md)] animate-pulse" />
        <div className="h-3 w-24 bg-surface-muted rounded animate-pulse" />
      </div>

      {/* Note lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-surface-muted rounded animate-pulse" />
        <div className="h-3 w-4/5 bg-surface-muted rounded animate-pulse" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1">
        <div className="h-3 w-12 bg-surface-muted rounded animate-pulse" />
        <div className="h-3 w-16 bg-surface-muted rounded animate-pulse" />
      </div>
    </div>
  )
}
