import {
  collectionBySlug,
  departmentPage,
  filtersForProducts,
  genderLabels,
  materialBySlug,
  subcategoryBySlug,
  subcategories,
} from '@/content/taxonomy'
import { previewProducts, previewReviews } from '@/content/previewCatalog'
import { discountPercent } from '@/utils/format'

const BADGE_ORDER = ['BESTSELLER', 'SALE', 'NEW']
const SIZE_ORDER = [
  'One Size',
  '80',
  '85',
  '90',
  '95',
  '100',
  '105',
  'UK 3',
  'UK 4',
  'UK 5',
  'UK 6',
  'UK 7',
  'UK 8',
  'UK 9',
  'UK 10',
  'UK 11',
]

export function toView(product) {
  const price = Math.min(...product.variants.map((variant) => variant.price))
  const mrp = Math.max(...product.variants.map((variant) => variant.mrp))
  const discount = discountPercent(price, mrp)
  const badges = []
  if (product.flags.bestseller) badges.push('BESTSELLER')
  if (discount > 0) badges.push('SALE')
  if (product.flags.new) badges.push('NEW')
  const material = materialBySlug(product.material)
  const subcategory = subcategoryBySlug(product.category)

  return {
    ...product,
    price,
    mrp,
    discount,
    materialName: material?.name || product.material,
    categoryName: subcategory?.name || product.category,
    badges: BADGE_ORDER.filter((badge) => badges.includes(badge)).slice(0, 2),
    inStock: product.variants.some((variant) => variant.stock > 0),
  }
}

function matchesSearch(product, search) {
  const material = materialBySlug(product.material)
  const subcategory = subcategoryBySlug(product.category)
  const attributeText = Object.values(product.attributes || {}).flat().join(' ')
  const haystack = [
    product.name,
    product.descriptor,
    product.description,
    product.category,
    subcategory?.name,
    product.department,
    product.productType,
    material?.name,
    material?.source,
    attributeText,
    ...(product.tags || []),
    ...product.collections,
    ...product.variants.map((variant) => variant.sku),
  ]
    .join(' ')
    .toLowerCase()

  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((token) => haystack.includes(token))
}

function matchesGender(product, genders) {
  if (!genders?.length) return true
  if (genders.includes(product.gender)) return true
  if (product.gender === 'unisex' && genders.some((gender) => gender === 'men' || gender === 'women')) return true
  return false
}

function matchesScope(product, query) {
  if (!matchesGender(product, query.genders)) return false
  if (query.travel) {
    const inTravel = product.department === 'travel' || product.collections.includes('travel')
    if (!inTravel) return false
  } else if (query.departments?.length && !query.departments.includes(product.department)) return false
  if (query.category && product.category !== query.category) return false
  if (query.materialSlug && product.material !== query.materialSlug) return false
  if (query.collection && !product.collections.includes(query.collection)) return false
  if (query.listing === 'new' && !product.flags.new) return false
  if (query.listing === 'bestsellers' && !product.flags.bestseller) return false
  if (query.listing === 'sale' && product.discount <= 0) return false
  if (query.search && !matchesSearch(product, query.search)) return false
  return true
}

function matchesAttributes(product, query) {
  const selected = query.multi || {}
  if (query.inStock && !product.inStock) return false
  if (selected.size?.length) {
    const hit = product.variants.some(
      (variant) => selected.size.includes(variant.size) && (!query.inStock || variant.stock > 0),
    )
    if (!hit) return false
  }
  if (selected.color?.length && !product.colors.some((color) => selected.color.includes(color.name))) return false
  if (selected.type?.length && !selected.type.includes(product.category)) return false
  if (selected.material?.length && !selected.material.includes(product.material)) return false
  if (selected.capacity?.length && !selected.capacity.includes(product.attributes?.capacity)) return false
  if (selected.feature?.length) {
    const features = product.attributes?.features || []
    if (!selected.feature.some((feature) => features.includes(feature))) return false
  }
  if (selected.collection?.length && !selected.collection.some((slug) => product.collections.includes(slug))) return false
  if (query.minPrice != null && product.price < query.minPrice) return false
  if (query.maxPrice != null && product.price > query.maxPrice) return false
  if (query.minDiscount && product.discount < query.minDiscount) return false
  if (query.minRating && (product.rating ?? 0) < query.minRating) return false
  return true
}

function sortProducts(items, sort) {
  const list = [...items]
  switch (sort) {
    case 'newest':
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'bestselling':
      return list.sort((a, b) => Number(b.flags.bestseller) - Number(a.flags.bestseller) || b.reviewCount - a.reviewCount)
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1))
    case 'discount':
      return list.sort((a, b) => b.discount - a.discount)
    default:
      return list.sort(
        (a, b) =>
          Number(b.flags.trending) - Number(a.flags.trending) ||
          Number(b.flags.bestseller) - Number(a.flags.bestseller) ||
          b.createdAt.localeCompare(a.createdAt),
      )
  }
}

function filterSample(query) {
  if (query.category) {
    const sub = subcategoryBySlug(query.category)
    return sub ? [{ productType: sub.productType }] : []
  }
  if (query.departments?.length) {
    const types = [...new Set(subcategories.filter((item) => query.departments.includes(item.department)).map((item) => item.productType))]
    return types.map((productType) => ({ productType }))
  }
  if (query.travel) return [{ productType: 'travel' }, { productType: 'bag' }, { productType: 'wallet' }, { productType: 'accessory' }]
  return []
}

function addCount(map, key, extra) {
  if (!key) return
  const current = map.get(key) || { count: 0, ...extra }
  map.set(key, { ...current, count: current.count + 1 })
}

function buildFacets(products) {
  const sizes = new Map()
  const colors = new Map()
  const genders = new Map()
  const categories = new Map()
  const materials = new Map()
  const capacities = new Map()
  const features = new Map()
  const collections = new Map()

  for (const product of products) {
    const seenSizes = new Set()
    for (const variant of product.variants) {
      if (seenSizes.has(variant.size)) continue
      seenSizes.add(variant.size)
      addCount(sizes, variant.size)
    }
    for (const color of product.colors) addCount(colors, color.name, { hex: color.hex })
    addCount(genders, product.gender)
    addCount(categories, product.category)
    addCount(materials, product.material)
    addCount(capacities, product.attributes?.capacity)
    for (const feature of product.attributes?.features || []) addCount(features, feature)
    for (const slug of product.collections) addCount(collections, slug)
  }

  const prices = products.map((product) => product.price)
  const bySize = (a, b) => {
    const left = SIZE_ORDER.indexOf(a.value)
    const right = SIZE_ORDER.indexOf(b.value)
    if (left === -1 && right === -1) return a.name.localeCompare(b.name)
    if (left === -1) return 1
    if (right === -1) return -1
    return left - right
  }
  const toOptions = (map, labelFor) =>
    [...map.entries()].map(([value, meta]) => ({
      value,
      name: labelFor ? labelFor(value) : value,
      count: meta.count,
      hex: meta.hex,
    }))

  return {
    sizes: toOptions(sizes).sort(bySize),
    colors: toOptions(colors),
    genders: toOptions(genders, (value) => genderLabels[value] || value),
    categories: toOptions(categories, (value) => subcategoryBySlug(value)?.name || value),
    materials: toOptions(materials, (value) => materialBySlug(value)?.name || value),
    capacities: toOptions(capacities),
    features: toOptions(features),
    collections: toOptions(collections, (value) => collectionBySlug(value)?.name || value),
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  }
}

export function queryCatalog(query = {}) {
  const views = previewProducts.map(toView)
  const base = views.filter((product) => matchesScope(product, query))
  const facets = buildFacets(base)
  const filtered = sortProducts(
    base.filter((product) => matchesAttributes(product, query)),
    query.sort,
  )
  const pageSize = query.pageSize || 8
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const page = Math.min(Math.max(1, query.page || 1), pageCount)
  const start = (page - 1) * pageSize
  const department = query.departmentId ? departmentPage(query.departmentId) : null
  const hide = query.hideFilters || []
  const sample = base.length ? base : filterSample(query)

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    pageCount,
    facets,
    filters: filtersForProducts(sample, hide),
    department,
  }
}

export async function fetchProducts(query) {
  return queryCatalog(query)
}

export async function fetchProduct(slug) {
  const product = previewProducts.find((item) => item.slug === slug)
  return product ? toView(product) : null
}

export async function fetchHomeMerch() {
  const { items } = queryCatalog({ pageSize: 48 })
  return { products: items }
}

export async function fetchRelated(product, limit = 4) {
  const sameMaterial = previewProducts
    .map(toView)
    .filter((item) => item.id !== product.id && item.material === product.material)
  const sameType = previewProducts
    .map(toView)
    .filter((item) => item.id !== product.id && item.productType === product.productType && !sameMaterial.some((row) => row.id === item.id))
  return [...sameMaterial, ...sameType].slice(0, limit)
}

export function getReviews(slug) {
  return previewReviews[slug] ?? []
}

export async function searchProducts(term) {
  const search = term.trim()
  if (search.length < 2) return []
  return queryCatalog({ search, pageSize: 6 }).items
}

export function productsForMaterial(slug) {
  return previewProducts.filter((product) => product.material === slug).map(toView)
}
