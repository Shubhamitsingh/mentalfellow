import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react'
import { CollectionMenu, MegaMenu } from '@/components/layout/MegaMenu'
import { IconButton } from '@/components/ui/IconButton'
import { useCart } from '@/contexts/CartContext'
import { useUi } from '@/contexts/UiContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { menus } from '@/content/taxonomy'
import { collections, primaryNav, site } from '@/lib/site'

export function Navbar() {
  const { pathname } = useLocation()
  const ui = useUi()
  const cart = useCart()
  const wishlist = useWishlist()
  const [openMenu, setOpenMenu] = useState(null)

  return (
    <header className="relative border-b border-line bg-paper" onMouseLeave={() => setOpenMenu(null)}>
      <div className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center gap-3 px-4 md:h-20 md:px-8 lg:px-10">
        <IconButton label="Open menu" className="xl:hidden" onClick={ui.openMenu}>
          <Menu size={20} />
        </IconButton>
        <Link to="/" className="flex shrink-0 items-center" aria-label={site.name}>
          <img src={site.logo} alt="" className="h-11 w-auto object-contain md:h-14" />
        </Link>
        <nav className="ml-6 hidden min-w-0 items-center gap-x-3 xl:flex min-[1440px]:ml-8 min-[1440px]:gap-x-5" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = isActive(item, pathname)
            const mega = Boolean(item.menu)
            return (
              <div key={item.id} className="static" onMouseEnter={() => setOpenMenu(mega ? item.menu : null)}>
                <Link
                  to={item.href}
                  aria-expanded={mega ? openMenu === item.menu : undefined}
                  className={`relative whitespace-nowrap py-7 text-sm uppercase tracking-[0.06em] text-ink/80 hover:text-ink ${active ? 'text-ink after:absolute after:bottom-5 after:left-0 after:h-px after:w-full after:bg-ink' : ''}`}
                >
                  {item.label}
                </Link>
              </div>
            )
          })}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <Link
            to="/creators"
            className={`mr-1 hidden text-[11px] uppercase tracking-[0.12em] sm:inline xl:hidden ${pathname.startsWith('/creators') ? 'text-ink' : 'text-ink/70'}`}
          >
            Creators
          </Link>
          <button
            type="button"
            onClick={ui.openSearch}
            className="mr-2 hidden h-10 w-32 items-center gap-2 rounded-full border border-line bg-white px-4 text-left text-sm text-muted min-[1440px]:flex"
          >
            <Search size={16} />
            Search
          </button>
          <IconButton label="Search" className="min-[1440px]:hidden" onClick={ui.openSearch}>
            <Search size={20} />
          </IconButton>
          <Link to="/wishlist" className="relative grid h-11 w-11 place-items-center" aria-label={`Wishlist, ${wishlist.count} saved`}>
            <Heart size={20} />
            {wishlist.count > 0 ? <Count value={wishlist.count} /> : null}
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center" aria-label="Account" onClick={ui.openLogin}>
            <User size={20} />
          </button>
          {cart.count > 0 ? (
            <IconButton label={`Bag, ${cart.count} ${cart.count === 1 ? 'item' : 'items'}`} onClick={ui.openCart}>
              <ShoppingBag size={20} />
              <Count value={cart.count} />
            </IconButton>
          ) : (
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center" aria-label="Bag, 0 items">
              <ShoppingBag size={20} />
            </Link>
          )}
        </div>
      </div>
      {openMenu === 'collections' ? <CollectionMenu collections={collections} onNavigate={() => setOpenMenu(null)} /> : null}
      {openMenu && openMenu !== 'collections' && menus[openMenu] ? (
        <MegaMenu menu={menus[openMenu]} onNavigate={() => setOpenMenu(null)} />
      ) : null}
    </header>
  )
}

function Count({ value }) {
  return (
    <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center bg-ink px-1 text-[10px] text-paper">
      {value}
    </span>
  )
}

function isActive(item, pathname) {
  if (item.id === 'collections') return pathname.startsWith('/collections')
  if (item.id === 'blog') return pathname === '/blog' || pathname.startsWith('/blog/')
  if (item.id === 'creators') return pathname === '/creators' || pathname.startsWith('/creators/')
  return pathname === item.href
}
