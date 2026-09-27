export function photo(id, width = 1400, height) {
  const frame = height ? `&w=${width}&h=${height}` : `&w=${width}`
  return `https://images.unsplash.com/${id}?auto=format&fit=crop${frame}&q=75`
}
