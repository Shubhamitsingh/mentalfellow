import { site } from '@/lib/site'

export function estimateShipping(subtotal) {
  if (!subtotal || subtotal <= 0) return 0
  if (subtotal >= site.freeShippingThreshold) return 0
  return site.shippingFee
}

export function checkPincode(code) {
  const clean = code.trim()
  if (!/^[1-9][0-9]{5}$/.test(clean)) {
    return { ok: false, message: 'Enter a 6-digit pincode.' }
  }

  return {
    ok: true,
    message: 'Estimated delivery in 3–6 days. Shipping is confirmed at checkout.',
  }
}
