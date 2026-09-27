import { cn } from '@/utils/cn'

export function IconButton({ label, className, type = 'button', ...props }) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        'relative grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-paper-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink',
        className,
      )}
      {...props}
    />
  )
}
