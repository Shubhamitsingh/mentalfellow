import { cn } from '@/utils/cn'

export function Input({ label, hint, error, id, className, ...props }) {
  const inputId = id || props.name
  return (
    <div className="block">
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'h-12 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none placeholder:text-muted focus:border-leaf',
          error && 'border-sale',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-sale">{error}</p> : null}
      {!error && hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export function Textarea({ label, id, className, ...props }) {
  const inputId = id || props.name
  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-[11px] uppercase tracking-[0.16em]">
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={cn('min-h-32 w-full rounded-lg border border-line bg-white px-3 py-3 text-sm outline-none focus:border-leaf', className)}
        {...props}
      />
    </div>
  )
}
