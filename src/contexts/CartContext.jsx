import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { fetchProduct } from '@/services/catalog'
import { quoteCoupon } from '@/services/coupons'
import { track } from '@/services/analytics'
import { useToast } from '@/contexts/ToastContext'
import { readJson, writeJson } from '@/utils/storage'
import { colorImages } from '@/utils/variants'

const CART_KEY = 'mf_cart_v1'
const COUPON_KEY = 'mf_coupon_v1'
const CartContext = createContext(null)

function lineFrom(product, variant, qty) {
  return {
    lineId: variant.id,
    productId: product.id,
    variantId: variant.id,
    slug: product.slug,
    name: product.name,
    image: colorImages(product, variant.color)[0],
    price: variant.price,
    mrp: variant.mrp,
    size: variant.size,
    color: variant.color,
    qty,
    stock: variant.stock,
  }
}

async function hydrate(lines) {
  const next = []
  for (const line of lines) {
    const product = await fetchProduct(line.slug)
    const variant = product?.variants.find((item) => item.id === line.variantId)
    if (!product || !variant) continue
    const qty = Math.min(line.qty, variant.stock)
    next.push({
      ...lineFrom(product, variant, Math.max(qty, 0)),
      unavailable: variant.stock < 1 || qty < 1,
      qty: variant.stock < 1 ? line.qty : qty,
    })
  }
  return next
}

export function CartProvider({ children }) {
  const toast = useToast()
  const [lines, setLines] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [ready, setReady] = useState(false)
  const linesRef = useRef(lines)
  useEffect(() => {
    linesRef.current = lines
  }, [lines])

  useEffect(() => {
    let active = true
    hydrate(readJson(CART_KEY, [])).then((stored) => {
      if (!active) return
      setLines((current) => (current.length ? mergeLines(stored, current) : stored))
      setCouponCode(readJson(COUPON_KEY, '') || '')
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    writeJson(CART_KEY, lines)
    writeJson(COUPON_KEY, couponCode)
  }, [lines, couponCode, ready])

  const addVariant = useCallback(
    (product, variant, qty = 1) => {
      if (!variant || variant.stock < 1) {
        toast({ tone: 'error', title: 'Out of stock', message: 'That size is not available.' })
        return { ok: false }
      }
      const existing = linesRef.current.find((line) => line.variantId === variant.id)
      const desired = (existing?.qty || 0) + qty
      if (desired > variant.stock) {
        toast({
          tone: 'error',
          title: 'Not enough stock',
          message: `Only ${variant.stock} left in this size.`,
        })
        return { ok: false }
      }
      const line = lineFrom(product, variant, desired)
      setLines((current) => {
        const has = current.some((item) => item.variantId === variant.id)
        if (!has) return [...current, line]
        return current.map((item) => (item.variantId === variant.id ? line : item))
      })
      toast({ title: 'Added to bag', message: `${product.name} · ${variant.color} / ${variant.size}` })
      track('add_to_cart', { slug: product.slug, variant: variant.id, qty })
      return { ok: true }
    },
    [toast],
  )

  const updateQty = useCallback(
    (variantId, qty) => {
      const current = linesRef.current.find((line) => line.variantId === variantId)
      if (!current) return
      if (qty < 1) {
        setLines((linesNow) => linesNow.filter((line) => line.variantId !== variantId))
        track('remove_from_cart', { variant: variantId })
        return
      }
      if (qty > current.stock) {
        toast({ tone: 'error', title: 'Not enough stock', message: `Only ${current.stock} left in this size.` })
        return
      }
      setLines((linesNow) => linesNow.map((line) => (line.variantId === variantId ? { ...line, qty } : line)))
    },
    [toast],
  )

  const applyCoupon = useCallback(
    (raw) => {
      const subtotal = merchandise(linesRef.current)
      const quote = quoteCoupon(raw, subtotal)
      if (!quote.ok) {
        toast({ tone: 'error', title: 'Code not applied', message: quote.message })
        return quote
      }
      setCouponCode(quote.code)
      toast({ title: 'Code applied', message: quote.description })
      track('coupon_apply', { code: quote.code })
      return quote
    },
    [toast],
  )

  const clearCoupon = useCallback(() => setCouponCode(''), [])

  const removeLine = useCallback((variantId) => {
    const line = linesRef.current.find((item) => item.variantId === variantId)
    setLines((current) => current.filter((item) => item.variantId !== variantId))
    if (line) toast({ title: 'Removed from bag', message: line.name })
    track('remove_from_cart', { variant: variantId })
  }, [toast])

  const value = useMemo(() => {
    const available = lines.filter((line) => !line.unavailable && line.stock > 0)
    const count = available.reduce((sum, line) => sum + line.qty, 0)
    const subtotal = available.reduce((sum, line) => sum + line.price * line.qty, 0)
    const mrpTotal = available.reduce((sum, line) => sum + line.mrp * line.qty, 0)
    const quote = couponCode ? quoteCoupon(couponCode, subtotal) : null
    return {
      lines,
      ready,
      count,
      subtotal,
      discount: Math.max(0, mrpTotal - subtotal),
      coupon: quote?.ok ? quote : null,
      couponNote: couponCode && quote && !quote.ok ? quote.message : '',
      couponCode,
      applyCoupon,
      clearCoupon,
      addVariant,
      updateQty,
      removeLine,
    }
  }, [lines, ready, couponCode, addVariant, updateQty, removeLine, applyCoupon, clearCoupon])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

function merchandise(lines) {
  return lines
    .filter((line) => !line.unavailable && line.stock > 0)
    .reduce((sum, line) => sum + line.price * line.qty, 0)
}

function mergeLines(stored, current) {
  const map = new Map(stored.map((line) => [line.variantId, line]))
  for (const line of current) {
    const previous = map.get(line.variantId)
    if (!previous) map.set(line.variantId, line)
    else map.set(line.variantId, { ...line, qty: Math.min(line.stock, previous.qty + line.qty) })
  }
  return [...map.values()]
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
