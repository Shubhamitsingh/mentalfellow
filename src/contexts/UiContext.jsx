import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'

const UiContext = createContext(null)

export function UiProvider({ children }) {
  const [overlay, setOverlay] = useState(null)
  useLockBodyScroll(Boolean(overlay))

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') setOverlay(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openSearch = useCallback(() => setOverlay('search'), [])
  const openCart = useCallback(() => setOverlay('cart'), [])
  const openMenu = useCallback(() => setOverlay('menu'), [])
  const openLogin = useCallback(() => setOverlay('login'), [])
  const close = useCallback(() => setOverlay(null), [])

  const value = useMemo(
    () => ({
      overlay,
      openSearch,
      openCart,
      openMenu,
      openLogin,
      close,
      searchOpen: overlay === 'search',
      cartOpen: overlay === 'cart',
      menuOpen: overlay === 'menu',
      loginOpen: overlay === 'login',
    }),
    [overlay, openSearch, openCart, openMenu, openLogin, close],
  )

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}

export function useUi() {
  const value = useContext(UiContext)
  if (!value) throw new Error('useUi must be used within UiProvider')
  return value
}
