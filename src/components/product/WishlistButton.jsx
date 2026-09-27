import { Heart } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { cn } from '@/utils/cn'

export function WishlistButton({ product, className }) {
  const { has, toggle } = useWishlist()
  const saved = has(product.slug)
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn('grid place-items-center text-ink', className)}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(product)
      }}
    >
      <Heart size={18} className={saved ? 'fill-ink' : ''} />
    </button>
  )
}
