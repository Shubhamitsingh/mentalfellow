import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { UiProvider } from '@/contexts/UiContext'
import { CreatorProvider } from '@/contexts/CreatorContext'
import { WishlistProvider } from '@/contexts/WishlistContext'

export function AppProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CreatorProvider>
              <UiProvider>{children}</UiProvider>
            </CreatorProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  )
}
