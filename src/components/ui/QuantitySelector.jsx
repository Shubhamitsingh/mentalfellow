import { Minus, Plus } from 'lucide-react'

export function QuantitySelector({ value, min = 1, max = 99, onChange, disabled }) {
  return (
    <div className="inline-flex h-12 items-center overflow-hidden rounded-lg border border-line bg-white">
      <button
        type="button"
        className="grid h-12 w-11 place-items-center disabled:opacity-30"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={16} />
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="grid h-12 w-11 place-items-center disabled:opacity-30"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
