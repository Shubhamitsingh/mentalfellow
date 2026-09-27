export function findVariant(product, color, size) {
  if (!product || !color || !size) return null
  return product.variants.find((variant) => variant.color === color && variant.size === size) ?? null
}

export function sizesForColor(product, colorName) {
  const seen = []
  for (const variant of product.variants) {
    if (variant.color === colorName && !seen.includes(variant.size)) seen.push(variant.size)
  }
  return seen.map(
    (size) => product.variants.find((variant) => variant.color === colorName && variant.size === size),
  )
}

export function colorImages(product, colorName) {
  return product.colors.find((color) => color.name === colorName)?.images ?? product.colors[0]?.images ?? []
}
