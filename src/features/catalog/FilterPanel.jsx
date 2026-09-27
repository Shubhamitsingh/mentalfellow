import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function FilterPanel({ facets, filters, query, onToggle, onSet, onPrice }) {
  return (
    <div className="space-y-5">
      {filters.map((field) => {
        if (field.id === 'price') {
          return <PriceRange key="price" query={query} onPrice={onPrice} />
        }
        if (field.id === 'stock') {
          return (
            <label key="stock" className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={query.inStock} onChange={(event) => onSet('stock', event.target.checked ? '1' : '')} />
              In stock
            </label>
          )
        }
        if (field.id === 'color') {
          return <ColorGroup key="color" title={field.label} options={facets.colors} selected={query.multi.color || []} onToggle={onToggle} />
        }
        const options = facets[field.facet] || []
        return (
          <CheckGroup
            key={field.id}
            title={field.label}
            param={field.param}
            options={options}
            selected={query.multi[field.param] || []}
            onToggle={onToggle}
          />
        )
      })}
    </div>
  )
}

function CheckGroup({ title, param, options, selected, onToggle }) {
  if (!options?.length) return null
  return (
    <fieldset>
      <legend className="text-[11px] uppercase tracking-[0.16em]">{title}</legend>
      <div className={`mt-2 space-y-1.5 ${options.length > 7 ? 'scrollbar-thin max-h-44 overflow-y-auto pr-1' : ''}`}>
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={selected.includes(option.value)} onChange={() => onToggle(param, option.value)} />
            <span>
              {option.name}
              <span className="text-muted"> {option.count}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ColorGroup({ title, options, selected, onToggle }) {
  if (!options?.length) return null
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em]">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((color) => {
          const active = selected.includes(color.value)
          return (
            <button
              key={color.value}
              type="button"
              aria-pressed={active}
              className={`flex h-9 items-center gap-2 border px-2 text-sm ${active ? 'border-ink' : 'border-line'}`}
              onClick={() => onToggle('color', color.value)}
            >
              <span className="h-4 w-4 border border-line" style={{ backgroundColor: color.hex }} />
              {color.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PriceRange({ query, onPrice }) {
  const [min, setMin] = useState(query.minPrice ?? '')
  const [max, setMax] = useState(query.maxPrice ?? '')

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em]">Price</p>
      <div className="mt-2 flex items-center gap-2">
        <input
          inputMode="numeric"
          aria-label="Minimum price"
          value={min}
          onChange={(event) => setMin(event.target.value)}
          placeholder="Min"
          className="h-10 w-full border border-line bg-white px-2 text-sm"
        />
        <input
          inputMode="numeric"
          aria-label="Maximum price"
          value={max}
          onChange={(event) => setMax(event.target.value)}
          placeholder="Max"
          className="h-10 w-full border border-line bg-white px-2 text-sm"
        />
      </div>
      <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => onPrice(min, max)}>
        Apply
      </Button>
    </div>
  )
}
