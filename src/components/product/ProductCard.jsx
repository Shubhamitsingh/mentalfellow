import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { WishlistButton } from '@/components/product/WishlistButton'
import { QuickView } from '@/components/product/QuickView'
import { useCart } from '@/contexts/CartContext'
import { useUi } from '@/contexts/UiContext'

export function ProductCard({ product }) {
  const [colorName, setColorName] = useState(product.colors[0]?.name)
  const [hover, setHover] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const cart = useCart()
  const ui = useUi()
  const color = product.colors.find((item) => item.name === colorName) || product.colors[0]
  const images = color?.images || []
  const src = hover && images[1] ? images[1] : images[0]
  const sizes = product.variants.filter((variant) => variant.color === color?.name)
  const fewLeft = product.variants.some((variant) => variant.stock > 0 && variant.stock <= 3)

  function quickAdd(variant) {
    const result = cart.addVariant(product, variant, 1)
    if (result.ok) ui.openCart()
  }

  return (
    <article className="group" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-paper-2">
        <Link to={`/product/${product.slug}`} className="block h-full">
          <img
            src={src}
            alt={color?.alt || product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        {images[1] && images[1] !== images[0] ? (
          <img
            src={images[1]}
            alt=""
            className="pointer-events-none absolute right-3 bottom-14 z-10 h-14 w-14 rounded-lg border-2 border-white object-cover shadow-sm md:group-hover:opacity-0"
          />
        ) : null}
        <WishlistButton product={product} className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white text-leaf shadow-sm" />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
          {product.badges.map((badge) => (
            <Badge key={badge} tone={badge === 'SALE' ? 'sale' : badge === 'NEW' ? 'new' : badge === 'BESTSELLER' ? 'leaf' : 'default'}>
              {badge === 'BESTSELLER' ? 'Bestseller' : badge === 'SALE' ? 'Sale' : 'New'}
            </Badge>
          ))}
          {!product.inStock ? <Badge tone="paper">Sold out</Badge> : null}
          {product.inStock && fewLeft ? <Badge tone="paper">Few left</Badge> : null}
        </div>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 md:group-hover:opacity-0">
          {product.rating != null ? (
            <p className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs shadow-sm">
              <Star size={12} className="fill-straw text-straw" aria-hidden />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="sr-only">out of 5</span>
            </p>
          ) : <span />}
          {product.colors.length > 1 ? (
            <div className="pointer-events-auto flex items-center gap-1" aria-label="Colours">
              {product.colors.slice(0, 3).map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  aria-label={swatch.name}
                  aria-pressed={swatch.name === color?.name}
                  className={`h-4 w-4 rounded-full border-2 ${swatch.name === color?.name ? 'border-white' : 'border-white/70'}`}
                  style={{ backgroundColor: swatch.hex }}
                  onClick={() => setColorName(swatch.name)}
                />
              ))}
              {product.colors.length > 3 ? (
                <span className="rounded-full bg-white/95 px-1.5 py-0.5 text-[10px]">+{product.colors.length - 3}</span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 hidden flex-col gap-1.5 rounded-2xl bg-white/95 p-2 shadow-[0_10px_28px_rgba(22,24,21,0.14)] md:group-focus-within:flex md:group-hover:flex">
          <button
            type="button"
            className="h-9 w-full rounded-xl text-[11px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:bg-paper"
            onClick={() => setQuickOpen(true)}
          >
            Quick view
          </button>
          {sizes.length > 1 ? (
            <div className="flex flex-wrap gap-1">
              {sizes.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stock < 1}
                  className="h-9 min-w-9 rounded-lg border border-line bg-white px-2 text-xs transition-colors hover:border-ink disabled:line-through disabled:opacity-40"
                  onClick={() => quickAdd(variant)}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          ) : (
            <button
              type="button"
              disabled={!sizes[0] || sizes[0].stock < 1}
              className="h-10 w-full rounded-xl bg-leaf text-[11px] font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-[#184a33] disabled:opacity-40"
              onClick={() => sizes[0] && quickAdd(sizes[0])}
            >
              {sizes[0]?.stock < 1 ? 'Sold out' : 'Add to bag'}
            </button>
          )}
        </div>
      </div>
      <div className="pt-3">
        <h3 className="text-sm font-medium">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{product.descriptor}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-leaf">{product.materialName}</p>
        <div className="mt-2">
          <PriceDisplay price={product.price} mrp={product.mrp} />
        </div>
      </div>
      <QuickView product={product} open={quickOpen} onClose={() => setQuickOpen(false)} />
    </article>
  )
}
