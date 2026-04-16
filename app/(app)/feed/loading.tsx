export default function FeedLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-6 w-36 bg-surface-muted rounded animate-pulse" />
        <div className="h-4 w-56 bg-surface-muted rounded animate-pulse" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-4 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-muted" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-surface-muted rounded" />
              <div className="h-2.5 w-20 bg-surface-muted rounded" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-8 w-16 bg-surface-muted rounded-[var(--radius-md)]" />
            <div className="h-3 w-24 self-center bg-surface-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-surface-muted rounded" />
            <div className="h-3 w-4/5 bg-surface-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
