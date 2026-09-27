import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Footer } from '@/components/layout/Footer'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { Navbar } from '@/components/layout/Navbar'
import { SearchModal } from '@/components/layout/SearchModal'
import { WelcomePopup } from '@/components/layout/WelcomePopup'
import { LoginModal } from '@/features/account/AccountPage'
import { useUi } from '@/contexts/UiContext'

export function StorefrontLayout() {
  const { pathname } = useLocation()
  const ui = useUi()
  const { close } = ui

  useEffect(() => {
    window.scrollTo(0, 0)
    close()
  }, [pathname, close])

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[90] focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="sticky top-0 z-40">
        <AnnouncementBar />
        <Navbar />
      </div>
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SearchModal open={ui.searchOpen} onClose={ui.close} />
      <CartDrawer open={ui.cartOpen} onClose={ui.close} />
      <MobileMenu open={ui.menuOpen} onClose={ui.close} />
      <LoginModal />
      <WelcomePopup />
    </div>
  )
}
