import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { ColorSelector } from '@/components/product/ColorSelector'
import { SizeSelector } from '@/components/product/SizeSelector'
import { WishlistButton } from '@/components/product/WishlistButton'
import { useCart } from '@/contexts/CartContext'
import { useUi } from '@/contexts/UiContext'
import { collectionBySlug, materialBySlug, productTypeById } from '@/content/taxonomy'
import { site } from '@/lib/site'
import { offerCodes } from '@/content/offers'
import { listOffers } from '@/services/coupons'
import { checkPincode, readDeliveryPin, saveDeliveryPin } from '@/services/shipping'
import { sizeCharts } from '@/content/sizeCharts'
import { findVariant, sizesForColor } from '@/utils/variants'
import { discountPercent, formatMoney } from '@/utils/format'

export function ProductPurchase({ product, mode = 'full', color: colorProp, onColorChange }) {
  const [colorState, setColorState] = useState(product.colors[0]?.name || '')
  const color = colorProp ?? colorState
  const setColor = onColorChange ?? setColorState
  const [size, setSize] = useState(() => onlyInStockSize(product, product.colors[0]?.name || ''))
  const [qty, setQty] = useState(1)
  const [error, setError] = useState('')
  const [chartOpen, setChartOpen] = useState(false)
  const [pin, setPin] = useState(() => readDeliveryPin()?.pincode || '')
  const [pinResult, setPinResult] = useState(() => readDeliveryPin())
  const [copied, setCopied] = useState('')
  const cart = useCart()
  const ui = useUi()
  const navigate = useNavigate()
  const material = materialBySlug(product.material)
  const highlights = highlightRows(product)
  const variant = findVariant(product, color, size)
  const price = variant?.price ?? product.price
  const mrp = variant?.mrp ?? product.mrp
  const discount = discountPercent(price, mrp)
  const freeShipping = price >= site.freeShippingThreshold
  const lowest = lowestOffer(price)
  const sizeOptions = sizesForColor(product, color)
  const chart = sizeCharts[product.chart]

  function changeColor(next) {
    setColor(next)
    setQty(1)
    setSize((current) => {
      const single = onlyInStockSize(product, next)
      if (single) return single
      if (current && findVariant(product, next, current)?.stock) return current
      return ''
    })
  }

  function requireVariant() {
    if (!variant || variant.stock < 1) {
      setError('Select an available size.')
      return null
    }
    setError('')
    return variant
  }

  function addToBag() {
    const selected = requireVariant()
    if (!selected) return
    const result = cart.addVariant(product, selected, qty)
    if (result.ok) ui.openCart()
  }

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const field = document.createElement('textarea')
      field.value = code
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(code)
  }

  function buyNow() {
    const selected = requireVariant()
    if (!selected) return
    const existing = cart.lines.find((line) => line.variantId === selected.id)
    if (!existing) {
      const result = cart.addVariant(product, selected, qty)
      if (!result.ok) return
    }
    ui.close()
    navigate('/cart')
  }

  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{site.name}</p>
      <h1 className="mt-2 font-serif text-4xl leading-none md:text-5xl">{product.name}</h1>
      <p className="mt-3 text-sm text-muted">{product.descriptor}</p>
      <div className="mt-4 flex items-start justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-medium">{formatMoney(price)}</span>
            {discount > 0 ? (
              <>
                <span className="text-sm text-muted line-through">{formatMoney(mrp)}</span>
                <span className="text-sm font-medium text-sale">{discount}% off</span>
              </>
            ) : null}
          </p>
          <p className="mt-1 text-xs text-muted">{product.taxNote}</p>
        </div>
        {product.rating != null ? (
          <p className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-xs">
            <Star size={13} className="fill-straw text-straw" aria-hidden />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            {product.reviewCount ? <span className="text-muted">{product.reviewCount}</span> : null}
          </p>
        ) : null}
      </div>
      <div className="mt-4 space-y-2">
        {lowest ? (
          <p className="rounded-lg bg-[#f7f1dc] px-3 py-2 text-sm">
            Get it for as low as <span className="font-medium">{formatMoney(lowest.pay)}</span> with {lowest.code}. The code is checked again before payment.
          </p>
        ) : null}
        {product.reviewCount ? (
          <p className="rounded-lg bg-[#e7f0ea] px-3 py-2 text-sm text-leaf">
            {product.flags?.bestseller ? 'People keep coming back for this. ' : ''}
            Rated {product.rating.toFixed(1)} from {product.reviewCount} reviews.
            {freeShipping ? ' This piece ships free.' : ''}
          </p>
        ) : freeShipping ? (
          <p className="rounded-lg bg-[#e7f0ea] px-3 py-2 text-sm text-leaf">This piece ships free. Tax is already in the price.</p>
        ) : null}
        {material ? (
          <p className="text-sm">
            <Link to={`/materials/${material.slug}`} className="inline-flex rounded-md border border-line bg-white px-3 py-1.5 text-ink">{material.name}</Link>
            {material.summary ? <span className="mt-2 block text-muted">{material.summary}</span> : null}
          </p>
        ) : null}
      </div>
      <div className="mt-5">
        <ColorSelector colors={product.colors} value={color} onChange={changeColor} />
      </div>
      <div className="mt-5">
        <SizeSelector
          variants={sizeOptions}
          value={size}
          onChange={setSize}
          action={chart ? (
            <button type="button" className="text-[11px] uppercase tracking-[0.14em] text-leaf underline underline-offset-4" onClick={() => setChartOpen(true)}>
              Size chart
            </button>
          ) : null}
        />
        {product.fitNote ? <p className="mt-2 text-xs text-muted">{product.fitNote}</p> : null}
        {variant && variant.stock > 0 && variant.stock <= 3 ? (
          <p className="mt-1 text-xs text-sale">Only {variant.stock} left in this size.</p>
        ) : null}
      </div>
      {error ? <p className="mt-3 text-sm text-sale">{error}</p> : null}
      <div className="mt-5 flex items-center gap-2">
        <QuantitySelector value={qty} max={variant?.stock || 1} onChange={setQty} />
        <WishlistButton product={product} className="h-12 w-12 shrink-0 rounded-lg border border-line bg-white" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" className="rounded-lg" onClick={addToBag}>Add to bag</Button>
        <Button type="button" className="rounded-lg" onClick={buyNow}>Buy now</Button>
      </div>
      {product.collections?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {product.collections.map((slug) => {
            const collection = collectionBySlug(slug)
            if (!collection) return null
            return (
              <li key={slug}>
                <Link to={`/collections/${slug}`} className="inline-flex h-7 items-center bg-straw px-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                  {collection.name}
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
      {mode === 'full' ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Offers</p>
            <Link to="/offers" className="text-xs text-leaf underline underline-offset-4">All offers</Link>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {listOffers().slice(0, 2).map((offer) => (
              <li key={offer.code} className="rounded-xl border border-line bg-white p-3">
                <p className="text-sm leading-snug">{offer.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-medium tracking-[0.08em]">{offer.code}</span>
                  <button type="button" className="text-xs font-medium text-leaf" onClick={() => copyCode(offer.code)}>
                    {copied === offer.code ? 'Copied' : 'Copy code'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {mode === 'full' ? (
        <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-line bg-paper p-3 md:hidden">
          <Button type="button" variant="secondary" className="rounded-lg" onClick={addToBag}>
            Add to bag
          </Button>
          <Button type="button" className="rounded-lg" onClick={buyNow}>
            Buy now
          </Button>
        </div>
      ) : null}
      {mode === 'full' ? (
        <>
          <form
            className="mt-6"
            onSubmit={(event) => {
              event.preventDefault()
              const result = checkPincode(pin)
              setPinResult(result)
              if (result.ok) saveDeliveryPin(result)
            }}
          >
            <label htmlFor="pincode" className="text-sm font-medium">Check delivery</label>
            <div className="mt-2 flex gap-2">
              <input
                id="pincode"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                placeholder="Enter pincode"
                className="h-12 flex-1 border border-line bg-white px-3 text-sm outline-none focus:border-leaf"
              />
              <Button type="submit" variant="secondary">Check</Button>
            </div>
            <p className={`mt-2 rounded-lg px-3 py-2 text-sm ${pinResult && !pinResult.ok ? 'bg-sale/10 text-sale' : 'bg-leaf/10 text-leaf'}`}>
              {pinResult
                ? pinResult.ok
                  ? `${pinResult.message} ${freeShipping ? 'This product qualifies for free shipping.' : `Free shipping above ₹${site.freeShippingThreshold}.`}`
                  : pinResult.message
                : freeShipping
                  ? 'This product qualifies for free shipping.'
                  : `Free shipping above ₹${site.freeShippingThreshold}.`}
            </p>
          </form>
          {highlights.length ? (
            <div className="mt-6">
              <p className="text-sm font-medium">Key details</p>
              <dl className="mt-2 grid grid-cols-2">
                {highlights.map((row) => (
                  <div key={row.label} className="border-b border-line py-2.5 pr-3">
                    <dt className="text-xs text-muted">{row.label}</dt>
                    <dd className="text-sm font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          <div className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            <Detail open title="Description" note="How it is made and used">
              <p>{product.description}</p>
            </Detail>
            <Detail title="Material and make" note={material?.name || 'Source material'}>
              <p>{material ? `${material.name}. ${material.summary}` : product.description}</p>
            </Detail>
            <Detail title="Care" note="How to look after it">
              <p>{product.care}</p>
            </Detail>
            <Detail title={`${site.exchangeWindowDays}-day exchange`} note="Unused products, confirmed at checkout">
              <p>
                Orders of ₹{site.freeShippingThreshold} and above ship free. Exchanges within {site.exchangeWindowDays} days if the product is unused. Cash on delivery applies when an order qualifies.{' '}
                <Link to="/shipping" className="underline">Shipping</Link>
                {' · '}
                <Link to="/returns" className="underline">Returns</Link>
              </p>
            </Detail>
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-line bg-white p-3 text-center text-[11px] leading-snug text-muted">
            <li>{site.exchangeWindowDays}-day exchange</li>
            <li>{freeShipping ? 'Free shipping' : `Free above ₹${site.freeShippingThreshold}`}</li>
            <li>Cash on delivery when qualifying</li>
          </ul>
        </>
      ) : (
        <Link to={`/product/${product.slug}`} className="mt-6 inline-block text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
          View full details
        </Link>
      )}
      <Modal open={chartOpen} onClose={() => setChartOpen(false)} label="Size chart">
        {chart ? <SizeChart chart={chart} onClose={() => setChartOpen(false)} /> : null}
      </Modal>
    </div>
  )
}

function SizeChart({ chart, onClose }) {
  return (
    <div className="p-5 md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-3xl">{chart.title}</h2>
        <button type="button" onClick={onClose} className="text-[11px] uppercase tracking-[0.14em]">
          Close
        </button>
      </div>
      <p className="mt-2 text-sm text-muted">Measurements in {chart.unit}.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              {chart.columns.map((column) => (
                <th key={column} className="py-2 pr-4 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row[0]} className="border-b border-line">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className="py-2 pr-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">{chart.note}</p>
    </div>
  )
}

function Detail({ title, note, children, open = false }) {
  return (
    <details open={open} className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-sm font-medium">{title}</span>
          <span className="text-xs text-muted">{note}</span>
        </span>
        <ChevronDown size={16} className="shrink-0 transition group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 text-sm leading-relaxed">{children}</div>
    </details>
  )
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

function highlightRows(product) {
  const labels = new Map(productTypeById(product.productType)?.attributes || [])
  return Object.entries(product.attributes || {})
    .filter(([, value]) => value && !Array.isArray(value))
    .slice(0, 6)
    .map(([key, value]) => ({ label: labels.get(key) || key, value: String(value) }))
}

function onlyInStockSize(product, color) {
  const options = sizesForColor(product, color).filter((item) => item.stock > 0)
  return options.length === 1 ? options[0].size : ''
}
