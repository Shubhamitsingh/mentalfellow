import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { ButtonLink } from '@/components/ui/Button'
import { useCart } from '@/contexts/CartContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { formatMoney } from '@/utils/format'
import { estimateShipping } from '@/services/shipping'

const steps = ['Account', 'Address', 'Delivery', 'Payment', 'Confirmation']

export default function CheckoutPage() {
  const cart = useCart()
  usePageMeta({ title: 'Checkout', description: 'Secure checkout at Mental Fellow.', path: '/checkout' })
  const shipping = estimateShipping(cart.subtotal)
  const total = Math.max(0, cart.subtotal - (cart.coupon?.discount || 0)) + shipping

  return (
    <Container className="py-12 md:py-16">
      <h1 className="font-serif text-5xl">Checkout</h1>
      <ol className="mt-6 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.14em] text-muted">
        {steps.map((step, index) => (
          <li key={step} className={index === 0 ? 'text-ink' : ''}>
            0{index + 1} {step}
          </li>
        ))}
      </ol>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="max-w-xl">
          <p className="text-base leading-relaxed">
            Payment is confirmed on the server before an order exists. That verification step is not switched on yet, so this page will not charge you or create an order.
          </p>
          <p className="mt-3 text-sm text-muted">Your bag stays saved on this device. When Razorpay is connected, checkout will recheck price, stock, shipping, and any coupon before payment.</p>
          <ButtonLink to="/cart" variant="secondary" className="mt-8">
            Back to bag
          </ButtonLink>
        </div>
        <aside className="border border-line p-5">
          <h2 className="text-[11px] uppercase tracking-[0.16em]">Bag</h2>
          {cart.lines.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Your bag is empty. <Link to="/new-arrivals" className="underline">Shop new arrivals</Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {cart.lines.map((line) => (
                <li key={line.lineId} className="flex justify-between gap-3 text-sm">
                  <span>
                    {line.name}
                    <span className="block text-xs text-muted">
                      {line.color} / {line.size} · {line.qty}
                    </span>
                  </span>
                  <span>{formatMoney(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 border-t border-line pt-4 text-sm">Estimated total {formatMoney(total)}</p>
        </aside>
      </div>
    </Container>
  )
}
