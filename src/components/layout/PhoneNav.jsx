import { Heart, Home, LayoutGrid, ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'

const items = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: LayoutGrid },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Bag', href: '/cart', icon: ShoppingBag },
]

export function PhoneNav() {
  const { pathname } = useLocation()
  const cart = useCart()
  const wishlist = useWishlist()
  const counts = { Wishlist: wishlist.count, Bag: cart.count }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper md:hidden" aria-label="Phone">
      <ul className="grid h-14 grid-cols-4">
        {items.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          const count = counts[item.label] || 0
          return (
            <li key={item.href}>
              <Link to={item.href} className={`flex h-full flex-col items-center justify-center gap-0.5 text-[10px] uppercase tracking-[0.08em] ${active ? 'text-leaf' : 'text-ink'}`}>
                <span className="relative">
                  <Icon size={18} />
                  {count > 0 ? <span className="absolute -top-1.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full bg-leaf px-1 text-[9px] text-paper">{count}</span> : null}
                </span>
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
