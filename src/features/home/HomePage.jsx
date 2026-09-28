import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { ProductGridSkeleton } from '@/components/ui/LoadingState'
import {
  BrandStory,
  EditorialBanner,
  Hero,
  HomeProducts,
  CustomerNotes,
  ShopByMaterial,
  ShopDoors,
  TrustStrip,
} from '@/features/home/HomeSections'
import { useAsync } from '@/hooks/useAsync'
import { usePageMeta } from '@/hooks/usePageMeta'
import { site } from '@/lib/site'
import { fetchHomeMerch } from '@/services/catalog'

export default function HomePage() {
  usePageMeta({ title: '', description: site.description, path: '/' })
  const state = useAsync(() => fetchHomeMerch(), [])

  return (
    <>
      <Hero />
      <TrustStrip />
      <ShopDoors />
      <ShopByMaterial />
      {state.status === 'loading' ? (
        <Container className="py-16">
          <ProductGridSkeleton />
        </Container>
      ) : null}
      {state.status === 'error' ? (
        <Container>
          <ErrorState title="The edit did not load" message="Refresh the page. Your bag is still saved on this device." />
        </Container>
      ) : null}
      {state.status === 'success' ? (
        <>
          <HomeProducts
            title="New Arrivals"
            href="/new-arrivals"
            products={state.data.products.filter((product) => product.flags.new).slice(0, 5)}
          />
          <HomeProducts
            title="Bestsellers"
            href="/bestsellers"
            products={state.data.products.filter((product) => product.flags.bestseller).slice(0, 5)}
          />
          <HomeProducts
            title="Women"
            href="/women"
            products={state.data.products.filter((product) => product.gender === 'women').slice(0, 5)}
          />
          <HomeProducts
            title="Men"
            href="/men"
            products={state.data.products.filter((product) => product.gender === 'men').slice(0, 5)}
          />
          <CustomerNotes />
          <EditorialBanner />
        </>
      ) : null}
      <BrandStory />
    </>
  )
}
