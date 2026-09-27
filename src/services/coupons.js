import { offerCodes } from '@/content/offers'
import { formatMoney } from '@/utils/format'

export function listOffers() {
  return offerCodes
}

export function quoteCoupon(rawCode, subtotal) {
  const code = String(rawCode || '').trim().toUpperCase()
  if (!code) return { ok: false, message: 'Enter a code.' }

  const offer = offerCodes.find((item) => item.code === code)
  if (!offer) return { ok: false, message: 'That code is not active.' }
  if (subtotal < offer.minOrder) {
    const short = offer.minOrder - subtotal
    return { ok: false, message: `Add ${formatMoney(short)} more to use ${offer.code}.` }
  }

  const raw = offer.type === 'percent' ? Math.round((subtotal * offer.value) / 100) : offer.value
  const discount = Math.min(raw, offer.maxDiscount, subtotal)
  return {
    ok: true,
    code: offer.code,
    discount,
    description: offer.description,
  }
}
