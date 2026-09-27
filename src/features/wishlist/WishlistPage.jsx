import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { useCart } from '@/contexts/CartContext'
import { useUi } from '@/contexts/UiContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function WishlistPage() {
  const wishlist = useWishlist()
  const cart = useCart()
  const ui = useUi()
  usePageMeta({ title: 'Wishlist', description: 'Pieces you saved at Mental Fellow.', path: '/wishlist' })

  function moveToBag(product) {
    const available = product.variants.filter((variant) => variant.stock > 0)
    if (available.length !== 1) return
    const result = cart.addVariant(product, available[0], 1)
    if (result.ok) ui.openCart()
  }

  return (
    <Container className="py-8 md:py-12">
      <h1 className="font-serif text-5xl">Wishlist</h1>
      {wishlist.items.length === 0 ? (
        <EmptyState title="Nothing saved." message="Save a product and it will wait here." action="Shop the collection" href="/shop" />
      ) : (
        <ul className="mt-8 divide-y divide-line">
          {wishlist.items.map((item) => {
            const product = item.product
            const available = product.variants.filter((variant) => variant.stock > 0)
            const changed = product.price !== item.priceAtAdd
            return (
              <li key={item.slug} className="grid grid-cols-[96px_1fr] gap-4 py-5 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                <Link to={`/product/${product.slug}`} className="aspect-[3/4] overflow-hidden rounded-xl bg-paper-2">
                  <img src={product.colors[0]?.images[0]} alt="" className="h-full w-full object-cover" />
                </Link>
                <div>
                  <Link to={`/product/${product.slug}`} className="font-medium">
                    {product.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{product.descriptor}</p>
                  <div className="mt-2">
                    <PriceDisplay price={product.price} mrp={product.mrp} />
                  </div>
                  {!product.inStock ? <p className="mt-2 text-sm text-sale">Currently unavailable</p> : null}
                  {changed ? (
                    <p className="mt-2 text-xs text-muted">
                      {product.price < item.priceAtAdd ? 'Lower than when you saved it.' : 'The price has changed since you saved it.'}
                    </p>
                  ) : null}
                </div>
                <div className="col-span-2 flex gap-4 sm:col-span-1 sm:flex-col sm:items-end">
                  {available.length === 1 ? (
                    <button type="button" className="text-[11px] uppercase tracking-[0.14em] underline" onClick={() => moveToBag(product)}>
                      Move to bag
                    </button>
                  ) : (
                    <Link to={`/product/${product.slug}`} className="text-[11px] uppercase tracking-[0.14em] underline">
                      Choose a size
                    </Link>
                  )}
                  <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-muted" onClick={() => wishlist.toggle(product)}>
                    Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Container>
  )
}
