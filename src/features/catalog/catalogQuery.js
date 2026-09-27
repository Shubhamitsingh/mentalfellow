export const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'newest', label: 'Newest' },
  { id: 'bestselling', label: 'Best selling' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Rating' },
  { id: 'discount', label: 'Discount' },
]

export function readCatalogQuery(params) {
  const numberOrNull = (key) => {
    const value = params.get(key)
    if (value == null || value === '') return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return {
    sort: params.get('sort') || 'recommended',
    multi: {
      gender: params.getAll('gender'),
      type: params.getAll('type'),
      material: params.getAll('material'),
      color: params.getAll('color'),
      size: params.getAll('size'),
      capacity: params.getAll('capacity'),
      feature: params.getAll('feature'),
      collection: params.getAll('collection'),
    },
    minPrice: numberOrNull('min'),
    maxPrice: numberOrNull('max'),
    minDiscount: numberOrNull('discount'),
    minRating: numberOrNull('rating'),
    inStock: params.get('stock') === '1',
    page: Number(params.get('page') || 1),
  }
}
