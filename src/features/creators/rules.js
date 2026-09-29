/**
 * Manual creator cashback. An admin checks the Instagram link.
 * Nothing here calls Instagram, charges a card, or sends a payout.
 */

export const CATEGORIES = ['bags', 'wallets', 'accessories', 'belts', 'footwear', 'travel']

export const defaultSettings = {
  mode: 'percent',
  percent: 10,
  fixedAmount: 200,
  categoryPercents: { bags: 10, wallets: 5, accessories: 5, belts: 8, footwear: 8, travel: 10 },
  maxPerOrder: 500,
  minOrderValue: 0,
  eligibleCategories: [],
  contentRequirement: 'Post the purchased product on Instagram and tag @mentalfellow.',
  submitWithinDays: 14,
}

export function screenCreator(input) {
  const reasons = []
  const followers = Number(input.followers)
  if (!String(input.name || '').trim()) reasons.push('Name is required.')
  if (!String(input.email || '').includes('@')) reasons.push('A real email is required.')
  if (!/^[6-9]\d{9}$/.test(String(input.mobile || '').replace(/\s/g, ''))) reasons.push('Use a 10-digit Indian mobile number.')
  if (!String(input.instagram || '').trim()) reasons.push('Instagram username is required.')
  if (!/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/i.test(String(input.profileUrl || '').trim())) {
    reasons.push('Profile URL must be an Instagram profile link.')
  }
  if (!Number.isFinite(followers) || followers < 0) reasons.push('Enter your Instagram follower count.')
  if (!String(input.niche || '').trim()) reasons.push('Category is required.')
  if (!String(input.city || '').trim()) reasons.push('City is required.')
  if (String(input.about || '').trim().length < 12) reasons.push('Add a short note about your content.')
  return { eligible: reasons.length === 0, reasons, status: reasons.length ? 'ineligible' : 'pending' }
}

export function isInstagramPost(url) {
  return /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(String(url || '').trim())
}

export function orderAmount(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function cashbackFor(items, settings) {
  const rules = { ...defaultSettings, ...settings, categoryPercents: { ...defaultSettings.categoryPercents, ...settings?.categoryPercents } }
  const blocked = items.find((item) => rules.eligibleCategories.length && !rules.eligibleCategories.includes(item.department))
  const amount = orderAmount(items)
  if (blocked) return { eligible: false, amount: 0, reason: 'A product in this order is not in an eligible category.' }
  if (amount < rules.minOrderValue) return { eligible: false, amount: 0, reason: 'This order is below the minimum value for cashback.' }
  let raw = 0
  if (rules.mode === 'fixed') raw = Number(rules.fixedAmount) || 0
  else if (rules.mode === 'category') {
    raw = items.reduce((sum, item) => {
      const rate = rules.categoryPercents[item.department] ?? rules.percent
      return sum + Math.round(item.price * item.qty * rate / 100)
    }, 0)
  } else {
    raw = Math.round(amount * (Number(rules.percent) || 0) / 100)
  }
  const cap = Number(rules.maxPerOrder) || raw
  return { eligible: raw > 0, amount: Math.min(raw, cap), reason: raw > 0 ? '' : 'The current rule produces no cashback.' }
}

export function canRequest(order, requests, now = Date.now()) {
  if (!order) return { ok: false, message: 'That order was not found.' }
  if (order.paymentStatus !== 'paid') return { ok: false, message: 'Cashback opens after the order is marked paid.' }
  if (order.shippingStatus === 'cancelled') return { ok: false, message: 'This order was cancelled.' }
  if (order.shippingStatus === 'returned') return { ok: false, message: 'This order was returned.' }
  if (order.shippingStatus !== 'delivered') return { ok: false, message: 'Apply after the order is delivered.' }
  const open = requests.filter((item) => item.orderId === order.id)
  if (open.some((item) => ['pending_review', 'approved', 'paid'].includes(item.status) && !item.flagged)) {
    return { ok: false, message: 'This order already has a cashback request.' }
  }
  const deadline = order.deliveredAt + order.submitWithinDays * 24 * 60 * 60 * 1000
  if (now > deadline) return { ok: false, message: 'The submission window for this order has closed.' }
  return { ok: true, deadline }
}

export function walletFrom(requests) {
  const sum = (status, flagged = false) => requests
    .filter((item) => item.status === status && Boolean(item.flagged) === flagged)
    .reduce((total, item) => total + item.amount, 0)
  const pending = sum('pending_review')
  const available = sum('approved')
  const withdrawn = sum('paid')
  const rejected = sum('rejected')
  return { pending, available, withdrawn, rejected, earned: available + withdrawn }
}

export function nextId(list, prefix, start) {
  const max = list.reduce((highest, item) => {
    const value = Number(String(item.id).replace(/\D/g, ''))
    return Number.isFinite(value) ? Math.max(highest, value) : highest
  }, start)
  return `${prefix}-${max + 1}`
}
