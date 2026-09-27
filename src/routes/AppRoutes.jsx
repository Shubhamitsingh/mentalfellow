import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { StorefrontLayout } from '@/components/layout/StorefrontLayout'
import { LoadingState } from '@/components/ui/LoadingState'

const HomePage = lazy(() => import('@/features/home/HomePage'))
const CatalogPage = lazy(() => import('@/features/catalog/CatalogPage'))
const ProductPage = lazy(() => import('@/features/product/ProductPage'))
const CartPage = lazy(() => import('@/features/cart/CartPage'))
const WishlistPage = lazy(() => import('@/features/wishlist/WishlistPage'))
const AccountPage = lazy(() => import('@/features/account/AccountPage'))
const CheckoutPage = lazy(() => import('@/features/checkout/CheckoutPage'))
const ContentPage = lazy(() => import('@/features/content/ContentPage'))
const ContactPage = lazy(() => import('@/features/content/ContactPage'))
const FaqPage = lazy(() => import('@/features/content/FaqPage'))
const SizeGuidePage = lazy(() => import('@/features/content/SizeGuidePage'))
const TrackOrderPage = lazy(() => import('@/features/orders/TrackOrderPage'))
const OffersPage = lazy(() => import('@/features/offers/OffersPage'))
const CollectionsPage = lazy(() => import('@/features/catalog/CollectionsPage'))
const MaterialsPage = lazy(() => import('@/features/materials/MaterialsPage'))
const SustainabilityPage = lazy(() => import('@/features/content/SustainabilityPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<CatalogPage mode="shop" />} />
          <Route path="men" element={<CatalogPage mode="gender" gender="men" />} />
          <Route path="women" element={<CatalogPage mode="gender" gender="women" />} />
          <Route path="bags" element={<CatalogPage mode="department" department="bags" />} />
          <Route path="wallets" element={<CatalogPage mode="department" department="wallets" />} />
          <Route path="belts" element={<CatalogPage mode="department" department="belts" />} />
          <Route path="footwear" element={<CatalogPage mode="department" department="footwear" />} />
          <Route path="travel" element={<CatalogPage mode="department" department="travel" />} />
          <Route path="new-arrivals" element={<CatalogPage mode="new" />} />
          <Route path="bestsellers" element={<CatalogPage mode="bestsellers" />} />
          <Route path="sale" element={<CatalogPage mode="sale" />} />
          <Route path="category/:slug" element={<CatalogPage mode="category" />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="collections/:slug" element={<CatalogPage mode="collection" />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="materials/:slug" element={<CatalogPage mode="material" />} />
          <Route path="sustainability" element={<SustainabilityPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<AccountPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="account/update-password" element={<AccountPage mode="password" />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="size-guide" element={<SizeGuidePage />} />
          <Route path="track-order" element={<TrackOrderPage />} />
          <Route path="offers" element={<OffersPage />} />
          <Route path="about" element={<ContentPage slug="about" />} />
          <Route path="our-story" element={<ContentPage slug="our-story" />} />
          <Route path="careers" element={<ContentPage slug="careers" />} />
          <Route path="shipping" element={<ContentPage slug="shipping" />} />
          <Route path="returns" element={<ContentPage slug="returns" />} />
          <Route path="exchange" element={<ContentPage slug="exchange" />} />
          <Route path="cancellation" element={<ContentPage slug="cancellation" />} />
          <Route path="privacy" element={<ContentPage slug="privacy" />} />
          <Route path="terms" element={<ContentPage slug="terms" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
