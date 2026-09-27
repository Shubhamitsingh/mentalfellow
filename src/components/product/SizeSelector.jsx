import { cn } from '@/utils/cn'

export function SizeSelector({ variants, value, onChange, action }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.16em]">Size</p>
        {action}
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="listbox" aria-label="Size">
        {variants.map((variant) => {
          const soldOut = variant.stock < 1
          const selected = value === variant.size
          return (
            <button
              key={variant.id}
              type="button"
              role="option"
              aria-selected={selected}
              disabled={soldOut}
              className={cn(
                'h-11 min-w-11 px-3 text-sm',
                selected ? 'bg-leaf text-paper' : 'border border-line',
                soldOut && 'text-muted line-through opacity-50',
              )}
              onClick={() => onChange(variant.size)}
            >
              {variant.size}
            </button>
          )
        })}
      </div>
    </div>
  )
}
