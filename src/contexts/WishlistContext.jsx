import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import { track } from '@/services/analytics'
import { fetchProduct } from '@/services/catalog'
import { readJson, writeJson } from '@/utils/storage'

const KEY = 'mf_wishlist_v1'
const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    const stored = readJson(KEY, [])
    Promise.all(
      stored.map(async (item) => {
        const product = await fetchProduct(item.slug)
        if (!product) return null
        return { ...item, product }
      }),
    ).then((rows) => {
      if (!active) return
      setItems(rows.filter(Boolean))
      setReady(true)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    writeJson(
      KEY,
      items.map(({ slug, priceAtAdd, addedAt }) => ({ slug, priceAtAdd, addedAt })),
    )
  }, [items, ready])

  const toggle = useCallback(
    async (product) => {
      const exists = items.some((item) => item.slug === product.slug)
      if (exists) {
        setItems((current) => current.filter((item) => item.slug !== product.slug))
        toast({ title: 'Removed from wishlist', message: product.name })
        return
      }
      const fresh = (await fetchProduct(product.slug)) || product
      setItems((current) => [
        { slug: fresh.slug, priceAtAdd: fresh.price, addedAt: new Date().toISOString(), product: fresh },
        ...current,
      ])
      toast({ title: 'Saved to wishlist', message: product.name })
      track('wishlist_add', { slug: product.slug })
    },
    [items, toast],
  )

  const has = useCallback((slug) => items.some((item) => item.slug === slug), [items])

  const value = useMemo(() => ({ items, ready, toggle, has, count: items.length }), [items, ready, toggle, has])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const value = useContext(WishlistContext)
  if (!value) throw new Error('useWishlist must be used within WishlistProvider')
  return value
}
