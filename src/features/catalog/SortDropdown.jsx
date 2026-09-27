import { useEffect, useRef, useState } from 'react'
import { sortOptions } from '@/features/catalog/catalogQuery'

export function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = sortOptions.find((option) => option.id === value) || sortOptions[0]

  useEffect(() => {
    function onPointer(event) {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    return () => window.removeEventListener('pointerdown', onPointer)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="text-[11px] uppercase tracking-[0.16em]"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((next) => !next)}
      >
        Sort: {current.label}
      </button>
      {open ? (
        <ul role="listbox" className="absolute right-0 z-20 mt-3 min-w-52 border border-line bg-paper py-2">
          {sortOptions.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                role="option"
                aria-selected={option.id === value}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-paper-2"
                onClick={() => {
                  onChange(option.id)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
