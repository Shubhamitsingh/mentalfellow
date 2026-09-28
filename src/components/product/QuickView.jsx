import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Percent, RotateCcw, Truck, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ColorSelector } from '@/components/product/ColorSelector'
import { SizeSelector } from '@/components/product/SizeSelector'
import { useCart } from '@/contexts/CartContext'
import { useUi } from '@/contexts/UiContext'
import { offerCodes } from '@/content/offers'
import { materialBySlug } from '@/content/taxonomy'
import { site } from '@/lib/site'
import { discountPercent, formatMoney } from '@/utils/format'
import { findVariant, sizesForColor } from '@/utils/variants'
import { cn } from '@/utils/cn'

export function QuickView({ product, open, onClose }) {
  const [color, setColor] = useState(product.colors[0]?.name || '')
  const [size, setSize] = useState(() => onlyInStockSize(product, product.colors[0]?.name || ''))
  const [active, setActive] = useState(0)
  const [error, setError] = useState('')
  const cart = useCart()
  const ui = useUi()
  const selected = product.colors.find((item) => item.name === color) || product.colors[0]
  const images = selected?.images || []
  const photo = images[Math.min(active, Math.max(images.length - 1, 0))]
  const variant = findVariant(product, color, size)
  const price = variant?.price ?? product.price
  const mrp = variant?.mrp ?? product.mrp
  const discount = discountPercent(price, mrp)
  const material = materialBySlug(product.material)
  const offer = lowestOffer(price)
  const freeShipping = price >= site.freeShippingThreshold

  function changeColor(next) {
    setColor(next)
    setActive(0)
    setError('')
    setSize((current) => {
      const single = onlyInStockSize(product, next)
      if (single) return single
      if (current && findVariant(product, next, current)?.stock) return current
      return ''
    })
  }

  function addToBag() {
    if (!variant || variant.stock < 1) {
      setError('Select an available size.')
      return
    }
    const result = cart.addVariant(product, variant, 1)
    if (!result.ok) return
    onClose()
    ui.openCart()
  }

  return (
    <Modal open={open} onClose={onClose} label={`Quick view ${product.name}`} className="w-[min(1080px,calc(100%-1.5rem))] overflow-hidden rounded-2xl bg-white">
      <div className="grid max-h-[90vh] md:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
        <div className="flex min-h-0 gap-3 p-3 md:p-4">
          <div className="flex max-h-[42vh] w-14 shrink-0 flex-col gap-2 overflow-y-auto md:max-h-[min(78vh,720px)]">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                aria-label={`Photo ${index + 1}`}
                className={cn('aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg border bg-paper-2', index === active ? 'border-ink' : 'border-line')}
                onClick={() => setActive(index)}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-2xl bg-paper-2">
            <img
              src={photo}
              alt={selected?.alt || product.name}
              className="max-h-[42vh] w-full rounded-2xl object-contain md:max-h-[min(78vh,720px)]"
            />
          </div>
        </div>
        <div className="min-h-0 overflow-y-auto border-t border-line px-5 py-5 md:border-t-0 md:border-l md:px-7 md:py-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-serif text-2xl leading-tight md:text-3xl">{product.name}</h2>
            <button type="button" aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <p className="mt-5 flex flex-wrap items-baseline gap-x-2">
            <span className="text-xl">{formatMoney(price)}</span>
            {discount > 0 ? (
              <>
                <span className="text-sm text-muted line-through">{formatMoney(mrp)}</span>
                <span className="text-sm font-medium text-sale">{discount}% off</span>
              </>
            ) : null}
          </p>
          <p className="mt-2 text-sm text-muted">{product.taxNote}. Shipping is calculated at checkout.</p>
          {product.colors.length > 1 ? (
            <div className="mt-6">
              <ColorSelector colors={product.colors} value={color} rounded onChange={changeColor} />
            </div>
          ) : null}
          <div className="mt-6">
            <SizeSelector variants={sizesForColor(product, color)} value={size} optionClassName="rounded-lg" onChange={(next) => { setSize(next); setError('') }} />
            {variant && variant.stock > 0 && variant.stock <= 3 ? (
              <p className="mt-2 text-xs text-sale">Only {variant.stock} left in this size.</p>
            ) : null}
          </div>
          {error ? <p className="mt-3 text-sm text-sale">{error}</p> : null}
          <Button type="button" className="mt-5 w-full rounded-lg" onClick={addToBag}>Add to bag</Button>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Truck size={18} className="shrink-0" aria-hidden />
              {freeShipping ? 'Free shipping on this piece.' : `Free shipping on orders of ₹${site.freeShippingThreshold} and above.`}
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw size={18} className="shrink-0" aria-hidden />
              {site.exchangeWindowDays}-day exchange if the piece is unused.
            </li>
          </ul>
          {offer ? (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-leaf/20 bg-[#e7f0ea] p-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-leaf">
                <Percent size={18} aria-hidden />
              </span>
              <div>
                <p className="inline-flex rounded-md bg-leaf px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-paper">{offer.code}</p>
                <p className="mt-1.5 text-sm text-leaf">As low as {formatMoney(offer.pay)}. The code is checked before payment.</p>
              </div>
            </div>
          ) : null}
          {material ? (
            <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-lg border border-line text-sm">
              <p className="border-r border-line px-3 py-3 text-leaf">Material</p>
              <Link to={`/materials/${material.slug}`} className="px-3 py-3">{material.name}</Link>
            </div>
          ) : null}
          <Link to={`/product/${product.slug}`} className="mt-5 inline-block text-[11px] uppercase tracking-[0.16em] underline underline-offset-4" onClick={onClose}>
            View full details
          </Link>
        </div>
      </div>
    </Modal>
  )
}

function onlyInStockSize(product, color) {
  const options = sizesForColor(product, color).filter((item) => item.stock > 0)
  return options.length === 1 ? options[0].size : ''
}

function lowestOffer(price) {
  let best = null
  for (const offer of offerCodes) {
    if (price < offer.minOrder) continue
    const raw = offer.type === 'percent' ? Math.round((price * offer.value) / 100) : offer.value
    const discount = Math.min(raw, offer.maxDiscount, price)
    const pay = price - discount
    if (!best || pay < best.pay) best = { code: offer.code, pay }
  }
  return best
}
