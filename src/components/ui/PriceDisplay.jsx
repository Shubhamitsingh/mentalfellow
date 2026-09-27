import { discountPercent, formatMoney } from '@/utils/format'

export function PriceDisplay({ price, mrp, size = 'md' }) {
  const discount = discountPercent(price, mrp)
  const currentClass = size === 'lg' ? 'text-2xl' : 'text-sm'
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="sr-only">Current price</span>
      <span className={`font-medium ${currentClass}`}>{formatMoney(price)}</span>
      {discount > 0 ? (
        <>
          <span className="sr-only">Original price</span>
          <span className="text-sm text-muted line-through">{formatMoney(mrp)}</span>
          <span className="text-sm text-sale">{discount}% off</span>
        </>
      ) : null}
    </p>
  )
}
