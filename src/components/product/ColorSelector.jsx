import { cn } from '@/utils/cn'

export function ColorSelector({ colors, value, onChange, rounded = false }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em]">
        Colour <span className="text-muted">{value}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {colors.map((color) => {
          const selected = color.name === value
          return (
            <button
              key={color.name}
              type="button"
              aria-label={color.name}
              aria-pressed={selected}
              className={cn('h-11 w-11 border p-1', rounded && 'rounded-lg', selected ? 'border-leaf' : 'border-line')}
              onClick={() => onChange(color.name)}
            >
              <span className={cn('block h-full w-full', rounded && 'rounded-md')} style={{ backgroundColor: color.hex }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
