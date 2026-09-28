import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { popularSearches } from '@/lib/site'
import { searchProducts } from '@/services/catalog'
import { track } from '@/services/analytics'
import { readJson, writeJson } from '@/utils/storage'
import { formatMoney } from '@/utils/format'

const RECENT_KEY = 'mf_recent_searches'

export function SearchModal({ open, onClose }) {
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [results, setResults] = useState([])
  const [recent, setRecent] = useState([])
  const inputRef = useRef(null)
  const debounced = useDebouncedValue(term, 250)
  const query = debounced.trim()
  const searching = query.length >= 2

  useEffect(() => {
    if (!open) return undefined
    setRecent(readJson(RECENT_KEY, []))
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => window.cancelAnimationFrame(frame)
  }, [open])

  useEffect(() => {
    if (open) return undefined
    setTerm('')
    setResults([])
    return undefined
  }, [open])

  useEffect(() => {
    let active = true
    if (!searching) {
      setResults([])
      return undefined
    }
    searchProducts(query).then((items) => {
      if (!active) return
      setResults(items)
      track('search', { term: query })
    })
    return () => {
      active = false
    }
  }, [query, searching])

  function remember(value) {
    const clean = value.trim()
    if (clean.length < 2) return
    const next = [clean, ...recent.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 6)
    setRecent(next)
    writeJson(RECENT_KEY, next)
  }

  function forget(value) {
    const next = recent.filter((item) => item !== value)
    setRecent(next)
    writeJson(RECENT_KEY, next)
  }

  function openResults(value) {
    const clean = value.trim()
    if (clean.length < 2) return
    remember(clean)
    onClose()
    navigate(`/shop?q=${encodeURIComponent(clean)}`)
  }

  return (
    <Modal open={open} onClose={onClose} label="Search" className="w-[min(860px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-white p-0">
      <div className="flex max-h-[min(720px,calc(100svh-4rem))] flex-col">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3 md:px-6">
          <Search size={18} className="shrink-0 text-muted" />
          <input
            id="site-search"
            ref={inputRef}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') openResults(term)
            }}
            placeholder="Search bags, wallets, belts"
            className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-muted"
            aria-label="Search"
          />
          {term ? (
            <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-muted" onClick={() => setTerm('')}>
              Clear
            </button>
          ) : null}
          <button type="button" className="grid h-11 w-11 place-items-center" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-5 md:px-6">
          {searching ? (
            results.length === 0 ? (
              <p className="text-sm text-muted">No pieces match “{query}”.</p>
            ) : (
              <ul>
                {results.map((product) => (
                  <li key={product.id} className="border-b border-line last:border-b-0">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => {
                        remember(term)
                        onClose()
                      }}
                      className="flex items-center gap-4 py-3"
                    >
                      <img
                        src={product.colors[0]?.images[0]}
                        alt=""
                        className="h-20 w-16 rounded-lg bg-paper-2 object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{product.name}</span>
                        <span className="mt-1 block truncate text-xs uppercase tracking-[0.12em] text-muted">{product.materialName}</span>
                      </span>
                      <span className="text-sm">{formatMoney(product.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="grid gap-8">
              {recent.length ? (
                <ChipGroup title="Recent" items={recent} onPick={setTerm} onRemove={forget} />
              ) : null}
              <ChipGroup title="Popular" items={popularSearches} onPick={setTerm} />
            </div>
          )}
        </div>

        {searching && results.length > 0 ? (
          <div className="border-t border-line px-4 py-3 md:px-6">
            <button type="button" className="text-[11px] uppercase tracking-[0.16em] text-leaf" onClick={() => openResults(query)}>
              See all results
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

function ChipGroup({ title, items, onPick, onRemove }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{title}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item}>
            <span className="inline-flex items-center rounded-full border border-line bg-paper">
              <button type="button" className="px-3 py-1.5 text-sm" onClick={() => onPick(item)}>
                {item}
              </button>
              {onRemove ? (
                <button type="button" className="grid h-8 w-8 place-items-center text-muted" aria-label={`Remove ${item}`} onClick={() => onRemove(item)}>
                  <X size={14} />
                </button>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
