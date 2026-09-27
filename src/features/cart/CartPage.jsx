import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { Button, ButtonLink } from '@/components/ui/Button'
import { ProductGrid } from '@/components/product/ProductGrid'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useAsync } from '@/hooks/useAsync'
import { fetchProducts } from '@/services/catalog'
import { EmptyBag } from '@/components/cart/EmptyBag'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { site } from '@/lib/site'
import { estimateShipping } from '@/services/shipping'
import { formatMoney } from '@/utils/format'

export default function CartPage() {
  const cart = useCart()
  const wishlist = useWishlist()
  const [code, setCode] = useState('')
  const related = useAsync(() => fetchProducts({ listing: 'bestsellers', pageSize: 4 }), [])
  usePageMeta({ title: 'Bag', description: 'Review your Mental Fellow bag before checkout.', path: '/cart' })
  const shipping = estimateShipping(cart.subtotal)
  const couponOff = cart.coupon?.discount || 0
  const total = Math.max(0, cart.subtotal - couponOff) + shipping
  const blocked = cart.lines.some((line) => line.unavailable || line.qty > line.stock)

  return (
    <Container className="py-8 md:py-12">
      {cart.lines.length === 0 ? (
        <EmptyBag heading="h1" className="py-16 md:py-24" />
      ) : (
        <>
      <h1 className="font-serif text-5xl">Your bag</h1>
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ul>
            {cart.lines.map((line) => (
              <li key={line.lineId} className="grid grid-cols-[96px_1fr] gap-4 border-t border-line py-5">
                <Link to={`/product/${line.slug}`} className="aspect-[3/4] overflow-hidden rounded-xl bg-paper-2">
                  <img src={line.image} alt="" className="h-full w-full object-cover" />
                </Link>
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/product/${line.slug}`} className="font-medium">
                        {line.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted">{line.size && line.size !== 'One Size' ? `${line.color} / ${line.size}` : line.color}</p>
                    </div>
                    <p className="text-sm">{formatMoney(line.price * line.qty)}</p>
                  </div>
                  {line.unavailable ? <p className="mt-2 text-sm text-sale">This size is no longer available.</p> : null}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <QuantitySelector value={line.qty} max={Math.max(line.stock, 1)} disabled={line.unavailable} onChange={(qty) => cart.updateQty(line.variantId, qty)} />
                    <button
                      type="button"
                      className="text-[11px] uppercase tracking-[0.14em]"
                      onClick={() => {
                        if (!wishlist.has(line.slug)) wishlist.toggle({ slug: line.slug, name: line.name, price: line.price })
                        cart.removeLine(line.variantId)
                      }}
                    >
                      Move to wishlist
                    </button>
                    <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-muted" onClick={() => cart.removeLine(line.variantId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit border border-line p-5">
            <h2 className="text-[11px] uppercase tracking-[0.16em]">Summary</h2>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                cart.applyCoupon(code)
              }}
            >
              <label className="sr-only" htmlFor="coupon">
                Offer code
              </label>
              <input
                id="coupon"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="Offer code"
                className="h-12 flex-1 border border-line bg-white px-3 text-sm uppercase outline-none focus:border-ink"
              />
              <Button type="submit" variant="secondary">
                Apply
              </Button>
            </form>
            {cart.coupon ? (
              <p className="mt-3 flex items-center justify-between text-sm">
                <span>{cart.coupon.code} applied</span>
                <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-muted" onClick={cart.clearCoupon}>
                  Remove
                </button>
              </p>
            ) : null}
            {cart.couponNote ? <p className="mt-2 text-sm text-sale">{cart.couponNote}</p> : null}
            <p className="mt-2 text-xs text-muted">
              <Link to="/offers" className="underline">
                See current offers
              </Link>
            </p>
            <Row label="Subtotal" value={formatMoney(cart.subtotal)} />
            {cart.discount > 0 ? <Row label="Markdown" value={`−${formatMoney(cart.discount)}`} /> : null}
            {couponOff > 0 ? <Row label="Offer" value={`−${formatMoney(couponOff)}`} /> : null}
            <Row label="Shipping estimate" value={shipping === 0 ? 'Free' : formatMoney(shipping)} />
            <Row label="Tax" value="Included" />
            <div className="mt-4 flex justify-between border-t border-line pt-4 font-medium">
              <span>Estimated total</span>
              <span>{formatMoney(total)}</span>
            </div>
            <p className="mt-3 text-xs text-muted">
              Free above {formatMoney(site.freeShippingThreshold)}. The code is checked again before payment.
            </p>
            {blocked ? <p className="mt-3 text-sm text-sale">Remove unavailable pieces before checkout.</p> : null}
            <ButtonLink to="/checkout" className={`mt-5 w-full ${blocked ? 'pointer-events-none opacity-40' : ''}`} aria-disabled={blocked}>
              Checkout
            </ButtonLink>
          </aside>
        </div>
        </>
      )}
      {cart.lines.length > 0 && related.status === 'success' && related.data.items.length > 0 ? (
        <div className="mt-16">
          <SectionHeading title="Goes with the bag" />
          <ProductGrid products={related.data.items.filter((product) => !cart.lines.some((line) => line.slug === product.slug)).slice(0, 4)} />
        </div>
      ) : null}
    </Container>
  )
}

function Row({ label, value }) {
  return (
    <div className="mt-3 flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  )
}
