import { Container } from '@/components/ui/Container'
import { ErrorState } from '@/components/ui/ErrorState'
import { ProductGridSkeleton } from '@/components/ui/LoadingState'
import {
  BrandStory,
  CategoryGrid,
  EditorialBanner,
  Hero,
  HomeProducts,
  MaterialInnovation,
  NewsletterBand,
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
          <HomeProducts products={state.data.products} />
          <CategoryGrid />
          <EditorialBanner />
          <MaterialInnovation />
        </>
      ) : null}
      <BrandStory />
      <NewsletterBand />
    </>
  )
}
