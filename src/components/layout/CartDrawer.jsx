import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Drawer } from '@/components/ui/Drawer'
import { ButtonLink } from '@/components/ui/Button'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { useCart } from '@/contexts/CartContext'
import { formatMoney } from '@/utils/format'
import { estimateShipping } from '@/services/shipping'
import { site } from '@/lib/site'

export function CartDrawer({ open, onClose }) {
  const cart = useCart()
  const navigate = useNavigate()
  const shipping = estimateShipping(cart.subtotal)
  const couponOff = cart.coupon?.discount || 0
  const total = Math.max(0, cart.subtotal - couponOff) + shipping

  useEffect(() => {
    if (!open || cart.lines.length > 0) return
    onClose()
    navigate('/cart')
  }, [open, cart.lines.length, onClose, navigate])

  if (cart.lines.length === 0) return null

  return (
    <Drawer open={open} onClose={onClose} title="Your bag" side="right">
        <div className="flex h-full flex-col">
          <ul className="flex-1 px-5">
            {cart.lines.map((line) => (
              <li key={line.lineId} className="flex gap-3 border-b border-line py-4">
                <Link to={`/product/${line.slug}`} onClick={onClose} className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-paper-2">
                  <img src={line.image} alt="" className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${line.slug}`} onClick={onClose} className="text-sm font-medium">
                    {line.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{lineLabel(line)}</p>
                  <p className="mt-1 text-sm">{formatMoney(line.price)}</p>
                  {line.unavailable ? <p className="mt-2 text-xs text-sale">Unavailable</p> : null}
                  <div className="mt-3 flex items-center justify-between">
                    <QuantitySelector
                      value={line.qty}
                      max={line.stock || 1}
                      onChange={(qty) => cart.updateQty(line.variantId, qty)}
                      disabled={line.unavailable}
                    />
                    <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-muted" onClick={() => cart.removeLine(line.variantId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-line px-5 py-5">
            <Row label="Subtotal" value={formatMoney(cart.subtotal)} />
            {couponOff > 0 ? <Row label={cart.coupon.code} value={`−${formatMoney(couponOff)}`} /> : null}
            <Row label="Shipping estimate" value={shipping === 0 ? 'Free' : formatMoney(shipping)} />
            <p className="mt-2 text-xs text-muted">Free above {formatMoney(site.freeShippingThreshold)}. Tax is included. Final total is confirmed at checkout.</p>
            <div className="mt-4 flex items-center justify-between text-sm font-medium">
              <span>Estimated total</span>
              <span>{formatMoney(total)}</span>
            </div>
            <ButtonLink to="/cart" className="mt-4 w-full" onClick={onClose}>
              View bag
            </ButtonLink>
          </div>
        </div>
    </Drawer>
  )
}

function lineLabel(line) {
  if (!line.size || line.size === 'One Size') return line.color
  return `${line.color} / ${line.size}`
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span>{value}</span>
    </div>
  )
}
