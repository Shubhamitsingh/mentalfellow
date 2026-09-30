import { Link } from 'react-router-dom'
import { Footprints, Heart, Luggage, Package, ShoppingBag, User, Wallet, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { useAuth } from '@/contexts/AuthContext'
import { useUi } from '@/contexts/UiContext'

const shopLinks = [
  { label: 'Men', href: '/men', src: '/icon/avatar.png' },
  { label: 'Women', href: '/women', src: '/icon/woman.png' },
  { label: 'Bags', href: '/bags', src: '/icon/bag.png' },
  { label: 'Wallets', href: '/wallets', icon: Wallet },
  { label: 'Belts', href: '/belts', icon: BeltIcon },
  { label: 'Footwear', href: '/footwear', icon: Footprints },
  { label: 'Travel', href: '/travel', icon: Luggage },
]

export function MobileMenu({ open, onClose }) {
  const ui = useUi()
  const auth = useAuth()
  const signedIn = Boolean(auth.user)
  const who = auth.user?.phone || auth.user?.email || 'Account'

  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu" bare widthClass="w-3/4 overflow-hidden rounded-r-2xl md:max-w-[440px]">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper-2 text-ink">
            <User size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-tight">Hello</p>
            {signedIn ? (
              <Link to="/account" onClick={onClose} className="mt-0.5 block truncate text-sm font-medium text-leaf">
                {who}
              </Link>
            ) : (
              <button type="button" className="mt-0.5 text-sm font-medium text-leaf" onClick={ui.openLogin}>
                Log in / Sign up
              </button>
            )}
          </div>
        </div>
        <button data-drawer-close type="button" className="grid h-11 w-11 shrink-0 place-items-center" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
      </div>

      <p className="border-t border-line px-5 pt-4 pb-1 text-[11px] uppercase tracking-[0.16em] text-muted">Shop</p>
      <ul>
        {shopLinks.map((item) => (
          <li key={item.href}>
            <Link to={item.href} onClick={onClose} className="flex items-center gap-4 px-5 py-3">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#ffd500] text-ink">
                {item.src ? (
                  <img src={item.src} alt="" className="h-[22px] w-[22px] object-contain mix-blend-multiply" />
                ) : (
                  <item.icon size={22} strokeWidth={1.75} />
                )}
              </span>
              <span className="text-base">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-2 border-t border-line px-5 pt-4 pb-3 text-[11px] uppercase tracking-[0.16em] text-muted">Your account</p>
      <div className="grid grid-cols-4 gap-2 px-4">
        <Tile icon={User} label="Account" onClick={signedIn ? undefined : ui.openLogin} href={signedIn ? '/account' : undefined} onNavigate={onClose} />
        <Tile icon={Package} label="Orders" href="/track-order" onNavigate={onClose} />
        <Tile icon={ShoppingBag} label="Bag" href="/cart" onNavigate={onClose} />
        <Tile icon={Heart} label="Wishlist" href="/wishlist" onNavigate={onClose} />
      </div>

      <p className="mt-5 border-t border-line px-5 pt-4 pb-1 text-[11px] uppercase tracking-[0.16em] text-muted">Help</p>
      <Link to="/contact" onClick={onClose} className="block px-5 py-2.5 text-base font-medium">
        Contact
      </Link>
      <Link to="/faq" onClick={onClose} className="block px-5 py-2.5 text-base font-medium">
        Questions
      </Link>

      <p className="mt-2 border-t border-line px-5 pt-4 pb-1 text-[11px] uppercase tracking-[0.16em] text-muted">About</p>
      <Link to="/our-story" onClick={onClose} className="block px-5 py-2.5 text-base font-medium">
        Our story
      </Link>
      <Link to="/blog" onClick={onClose} className="block px-5 py-2.5 pb-8 text-base font-medium">
        Blog
      </Link>
    </Drawer>
  )
}

function Tile({ icon: Icon, label, href, onClick, onNavigate }) {
  const body = (
    <>
      <span className="grid h-16 w-full place-items-center rounded-xl border border-line bg-white">
        <Icon size={26} className="text-[#e0ac00]" strokeWidth={1.75} />
      </span>
      <span className="text-center text-xs leading-tight">{label}</span>
    </>
  )
  const className = 'flex flex-col items-center gap-2'
  if (href) {
    return (
      <Link to={href} onClick={onNavigate} className={className}>
        {body}
      </Link>
    )
  }
  return (
    <button type="button" className={className} onClick={onClick}>
      {body}
    </button>
  )
}

function BeltIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2" y="9" width="20" height="6" rx="1" />
      <path d="M10 9v6M14 9v6" />
    </svg>
  )
}
