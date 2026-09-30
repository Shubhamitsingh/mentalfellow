import { useState } from 'react'
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { Drawer } from '@/components/ui/Drawer'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { ProductGridSkeleton } from '@/components/ui/LoadingState'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterPanel } from '@/features/catalog/FilterPanel'
import { SortDropdown } from '@/features/catalog/SortDropdown'
import { readCatalogQuery, sortOptions } from '@/features/catalog/catalogQuery'
import { useAsync } from '@/hooks/useAsync'
import { usePageMeta } from '@/hooks/usePageMeta'
import { collectionBySlug, departmentPage, materialBySlug, subcategoryBySlug } from '@/content/taxonomy'
import { fetchProducts } from '@/services/catalog'
import { titleFromSlug } from '@/utils/format'

const copy = {
  shop: {
    title: 'Shop',
    description: 'Bags, wallets, belts, footwear, and travel goods. The catalogue is built to grow past the first edit.',
  },
  men: {
    title: 'Men',
    description: 'Bags, wallets, belts, and shoes for men, plus unisex goods that belong in the same day.',
  },
  women: {
    title: 'Women',
    description: 'Bags, wallets, belts, and shoes for women, plus unisex goods from the same materials.',
  },
  new: { title: 'New arrivals', description: 'The latest products, before the next material run.' },
  bestsellers: { title: 'Bestsellers', description: 'The products people keep coming back for.' },
  sale: { title: 'Sale', description: 'Same products. A lower number, while the markdown lasts.' },
}

export default function CatalogPage({ mode = 'shop', gender: genderProp, department }) {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const query = readCatalogQuery(params)
  const page = departmentPage(department)
  const heading = query.search
    ? { title: 'Search', description: `Pieces matching “${query.search}”.` }
    : headingFor(mode, slug, genderProp, page)
  const paramKey = params.toString()
  const hideFilters = [
    mode === 'gender' ? 'gender' : null,
    mode === 'category' ? 'category' : null,
    mode === 'material' ? 'material' : null,
    mode === 'collection' ? 'collection' : null,
  ].filter(Boolean)

  const state = useAsync(
    () =>
      fetchProducts({
        ...query,
        genders: mode === 'gender' ? [genderProp] : query.multi.gender,
        departments: page && !page.travel ? page.members : undefined,
        departmentId: page?.id,
        travel: Boolean(page?.travel),
        category: mode === 'category' ? slug : undefined,
        collection: mode === 'collection' ? slug : undefined,
        materialSlug: mode === 'material' ? slug : undefined,
        listing: mode === 'new' || mode === 'bestsellers' || mode === 'sale' ? mode : undefined,
        search: query.search || undefined,
        hideFilters,
        pageSize: 8,
      }),
    [mode, slug, genderProp, department, paramKey],
  )

  usePageMeta({ title: heading.title, description: heading.description, path: window.location.pathname })

  function update(mutate, resetPage = true) {
    const next = new URLSearchParams(params)
    mutate(next)
    if (resetPage) next.delete('page')
    setParams(next, { replace: true })
  }

  function toggle(param, value) {
    update((next) => {
      const all = next.getAll(param)
      next.delete(param)
      const values = all.includes(value) ? all.filter((item) => item !== value) : [...all, value]
      values.forEach((item) => next.append(param, item))
    })
  }

  function setField(key, value) {
    update((next) => {
      if (value === '' || value == null) next.delete(key)
      else next.set(key, String(value))
    })
  }

  function setPrice(min, max) {
    update((next) => {
      if (min === '' || min == null) next.delete('min')
      else next.set('min', String(min))
      if (max === '' || max == null) next.delete('max')
      else next.set('max', String(max))
    })
  }

  const { pathname } = useLocation()
  const crumbs = [{ label: 'Home', href: '/' }, { label: heading.title }]
  const filters = state.status === 'success' ? state.data.filters : []

  return (
    <Container className="py-6 pb-20 md:pb-12">
      <Breadcrumbs items={crumbs} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl md:text-6xl">{heading.title}</h1>
          <p className="mt-3 max-w-xl text-sm text-muted md:text-base">{heading.description}</p>
        </div>
        <div className="hidden items-center gap-6 md:flex">
          {state.status === 'success' ? <p className="text-sm text-muted">{state.data.total} products</p> : null}
          <SortDropdown value={query.sort} onChange={(value) => setField('sort', value === 'recommended' ? '' : value)} />
        </div>
      </div>

      {mode === 'shop' || mode === 'department' ? <DepartmentTiles pathname={pathname} /> : null}

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {collectionChips.map((chip) => {
          const active = pathname === chip.href
          return (
            <Link
              key={chip.href}
              to={chip.href}
              aria-current={active ? 'page' : undefined}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${active ? 'border-ink bg-ink text-paper' : 'border-line bg-white text-ink'}`}
            >
              {chip.label}
            </Link>
          )
        })}
      </div>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="scrollbar-thin sticky top-28 max-h-[calc(100svh-8rem)] overflow-y-auto pr-2">
            {state.status === 'success' ? (
              <FilterPanel facets={state.data.facets} filters={filters} query={query} onToggle={toggle} onSet={setField} onPrice={setPrice} />
            ) : null}
            <button type="button" className="mt-4 text-[11px] uppercase tracking-[0.14em] underline" onClick={() => setParams({}, { replace: true })}>
              Clear filters
            </button>
          </div>
        </aside>
        <div>
          {state.status === 'loading' ? <ProductGridSkeleton /> : null}
          {state.status === 'error' ? <ErrorState message="The catalog did not load." /> : null}
          {state.status === 'success' && state.data.items.length === 0 ? (
            <EmptyState
              title="Nothing in this edit yet."
              message="This category is ready for more products. Browse the shop while the line grows."
              action="Shop all"
              href="/shop"
            />
          ) : null}
          {state.status === 'success' && state.data.items.length > 0 ? <ProductGrid products={state.data.items} /> : null}
          {state.status === 'success' && state.data.pageCount > 1 ? (
            <div className="mt-10 flex items-center gap-3">
              <button type="button" className="h-11 border border-line px-4 text-sm disabled:opacity-40" disabled={state.data.page <= 1} onClick={() => update((next) => next.set('page', String(state.data.page - 1)), false)}>
                Previous
              </button>
              <p className="text-sm text-muted">
                Page {state.data.page} of {state.data.pageCount}
              </p>
              <button type="button" className="h-11 border border-line px-4 text-sm disabled:opacity-40" disabled={state.data.page >= state.data.pageCount} onClick={() => update((next) => next.set('page', String(state.data.page + 1)), false)}>
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-line bg-paper md:hidden">
        <button type="button" className="h-14 text-[11px] uppercase tracking-[0.16em]" onClick={() => setFiltersOpen(true)}>
          Filter
        </button>
        <button type="button" className="h-14 border-l border-line text-[11px] uppercase tracking-[0.16em]" onClick={() => setSortOpen(true)}>
          Sort
        </button>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filter" side="left">
        <div className="px-5 py-5">
          {state.status === 'success' ? (
            <FilterPanel facets={state.data.facets} filters={filters} query={query} onToggle={toggle} onSet={setField} onPrice={setPrice} />
          ) : null}
          <button type="button" className="mt-6 text-[11px] uppercase tracking-[0.14em] underline" onClick={() => setParams({}, { replace: true })}>
            Clear filters
          </button>
        </div>
      </Drawer>
      <Drawer open={sortOpen} onClose={() => setSortOpen(false)} title="Sort" side="right">
        <ul className="px-2 py-2">
          {sortOptions.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className="flex h-12 w-full items-center px-3 text-left text-sm"
                onClick={() => {
                  setField('sort', option.id === 'recommended' ? '' : option.id)
                  setSortOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </Drawer>
    </Container>
  )
}

const departmentTiles = [
  { label: 'Bags', href: '/bags', image: '/uploads/model21.png', alt: 'A woman in a yellow top holding a blue chain-strap bag' },
  { label: 'Wallets', href: '/wallets', image: '/products/rice-leather-wallet-ink.png', alt: 'Black rice-straw leather card wallet' },
  { label: 'Belts', href: '/belts', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&h=1000&q=75', alt: 'Black belt strap in even light' },
  { label: 'Footwear', href: '/footwear', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&h=1000&q=75', alt: 'Black derby shoes' },
  { label: 'Travel', href: '/travel', image: '/products/wheat-suede-organizer.png', alt: 'Wheat-straw suede packing cubes' },
]

function DepartmentTiles({ pathname }) {
  return (
    <nav aria-label="Departments" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {departmentTiles.map((item) => {
        const active = pathname === item.href
        return (
          <Link key={item.href} to={item.href} aria-current={active ? 'page' : undefined} className="group">
            <span className={`block overflow-hidden rounded-xl bg-paper-2 ${active ? 'ring-2 ring-ink' : ''}`}>
              <img src={item.image} alt={item.alt} className="h-44 w-full object-cover object-[center_20%] transition duration-500 group-hover:scale-[1.03] sm:h-56 lg:h-72" />
            </span>
            <span className={`mt-2 block text-center text-[11px] uppercase tracking-[0.16em] ${active ? 'text-ink' : 'text-muted'}`}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const collectionChips = [
  { label: 'All', href: '/shop' },
  { label: 'New', href: '/new-arrivals' },
  { label: 'Bestsellers', href: '/bestsellers' },
  { label: 'Sale', href: '/sale' },
  { label: 'Bags', href: '/bags' },
  { label: 'Wallets', href: '/wallets' },
  { label: 'Belts', href: '/belts' },
  { label: 'Footwear', href: '/footwear' },
  { label: 'Travel', href: '/travel' },
]

function headingFor(mode, slug, gender, page) {
  if (mode === 'gender') return gender === 'women' ? copy.women : copy.men
  if (mode === 'department' && page) return { title: page.title, description: page.description }
  if (copy[mode]) return copy[mode]
  if (mode === 'collection') {
    const collection = collectionBySlug(slug)
    return {
      title: collection?.name || titleFromSlug(slug),
      description: collection?.description || 'A Mental Fellow collection.',
    }
  }
  if (mode === 'material') {
    const material = materialBySlug(slug)
    return {
      title: material?.name || titleFromSlug(slug),
      description: material?.story || material?.summary || 'Products that use this material.',
    }
  }
  const subcategory = subcategoryBySlug(slug)
  return {
    title: subcategory?.name || titleFromSlug(slug),
    description: subcategory
      ? `Shop ${subcategory.name.toLowerCase()} from Mental Fellow.`
      : 'Shop this category from Mental Fellow.',
  }
}
