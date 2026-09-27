import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { popularSearches } from '@/lib/site'
import { searchProducts } from '@/services/catalog'
import { track } from '@/services/analytics'
import { readJson, writeJson } from '@/utils/storage'
import { formatMoney } from '@/utils/format'

const RECENT_KEY = 'mf_recent_searches'

export function SearchModal({ open, onClose }) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)
  const debounced = useDebouncedValue(term, 250)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (open) setRecent(readJson(RECENT_KEY, []))
  }, [open])

  useEffect(() => {
    let active = true
    if (debounced.trim().length < 2) {
      setResults([])
      return undefined
    }
    searchProducts(debounced).then((items) => {
      if (!active) return
      setResults(items)
      track('search', { term: debounced })
    })
    return () => {
      active = false
    }
  }, [debounced])

  function remember(value) {
    const clean = value.trim()
    if (clean.length < 2) return
    const next = [clean, ...recent.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6)
    setRecent(next)
    writeJson(RECENT_KEY, next)
  }

  return (
    <Modal open={open} onClose={onClose} label="Search" className="w-[min(760px,calc(100%-1.5rem))]">
      <div className="p-5 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="site-search" className="text-[11px] uppercase tracking-[0.18em]">
            Search
          </label>
          <button type="button" className="text-[11px] uppercase tracking-[0.16em]" onClick={onClose}>
            Close
          </button>
        </div>
        <input
          id="site-search"
          ref={inputRef}
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') remember(term)
          }}
          placeholder="Bags, wallets, materials, SKU"
          className="mt-4 h-14 w-full border-b border-ink bg-transparent text-2xl font-serif outline-none placeholder:text-muted"
        />
        {debounced.trim().length < 2 ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <SearchList title="Recent" items={recent} onPick={(value) => setTerm(value)} empty="No recent searches" />
            <SearchList title="Popular" items={popularSearches} onPick={(value) => setTerm(value)} />
          </div>
        ) : (
          <div className="mt-6">
            {results.length === 0 ? (
              <p className="text-sm text-muted">No pieces match “{debounced}”.</p>
            ) : (
              <ul>
                {results.map((product) => (
                  <li key={product.id} className="border-b border-line">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => {
                        remember(term)
                        onClose()
                      }}
                      className="flex items-center gap-4 py-3"
                    >
                      <img src={product.colors[0]?.images[0]} alt="" className="h-16 w-12 object-cover" />
                      <span className="flex-1">
                        <span className="block text-sm">{product.name}</span>
                        <span className="text-sm text-muted">{product.descriptor}</span>
                      </span>
                      <span className="text-sm">{formatMoney(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

function SearchList({ title, items, onPick, empty }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{title}</p>
      {items.length === 0 ? <p className="mt-3 text-sm text-muted">{empty}</p> : null}
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item}>
            <button type="button" className="text-sm hover:underline" onClick={() => onPick(item)}>
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
