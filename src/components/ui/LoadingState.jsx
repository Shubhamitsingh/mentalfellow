export function LoadingState({ label = 'Loading' }) {
  return (
    <div role="status" className="flex min-h-40 flex-col items-center justify-center gap-4 py-20">
      <span className="text-[11px] uppercase tracking-[0.2em]">{label}</span>
      <span className="h-px w-24 animate-pulse bg-ink" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden>
          <div className="aspect-[3/4] animate-pulse rounded-xl bg-paper-2" />
          <div className="mt-3 h-3 w-2/3 animate-pulse bg-paper-2" />
          <div className="mt-2 h-3 w-1/3 animate-pulse bg-paper-2" />
        </div>
      ))}
    </div>
  )
}
