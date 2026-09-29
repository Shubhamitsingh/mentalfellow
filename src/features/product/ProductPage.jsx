import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { RatingStars } from '@/components/ui/RatingStars'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductGallery } from '@/features/product/ProductGallery'
import { CreatorOpportunity } from '@/features/creators/CreatorOpportunity'
import { ProductPurchase } from '@/features/product/ProductPurchase'
import { useAsync } from '@/hooks/useAsync'
import { usePageMeta } from '@/hooks/usePageMeta'
import { MaterialStory } from '@/features/product/MaterialStory'
import { departmentPage, subcategoryBySlug } from '@/content/taxonomy'
import { track } from '@/services/analytics'
import { fetchProduct, fetchRelated, getReviews } from '@/services/catalog'
import { readJson, writeJson } from '@/utils/storage'
import { colorImages } from '@/utils/variants'

const RECENT_KEY = 'mf_recent_products'

export default function ProductPage() {
  const { slug } = useParams()
  const state = useAsync(() => fetchProduct(slug), [slug])
  const product = state.data
  const related = useAsync(() => (product ? fetchRelated(product) : []), [product?.id])
  const recent = useAsync(() => loadRecent(slug), [slug, product?.id])

  usePageMeta({
    title: product?.name,
    description: product?.description,
    path: product ? `/product/${product.slug}` : undefined,
  })

  useEffect(() => {
    if (!product) return undefined
    track('view_product', { slug: product.slug })
    const existing = readJson(RECENT_KEY, [])
    writeJson(RECENT_KEY, [product.slug, ...existing.filter((item) => item !== product.slug)].slice(0, 8))
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.dataset.product = product.slug
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.colors[0]?.images,
      sku: product.variants[0]?.sku,
      brand: { '@type': 'Brand', name: 'Mental Fellow' },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: product.price,
        availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
    })
    document.head.appendChild(script)
    return () => script.remove()
  }, [product])

  if (state.status === 'loading') return <LoadingState label="Loading product" />
  if (state.status === 'error') return <Container><ErrorState message="We could not load this product." /></Container>
  if (!product) {
    return (
      <Container>
        <EmptyState title="This product is unavailable." message="It may have sold through, or the link is out of date." action="Continue shopping" href="/shop" />
      </Container>
    )
  }

  const reviews = getReviews(product.slug)

  return (
    <article className="pb-24 md:pb-0">
      <Container className="py-6">
        <Breadcrumbs items={crumbTrail(product)} />
        <ProductStage key={product.slug} product={product} />
      </Container>
      <MaterialStory product={product} />
      <Container className="py-12">
        <h2 className="font-serif text-4xl">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="mt-4 max-w-lg text-sm text-muted">No reviews yet. Verified buyers will be able to write one after delivery.</p>
        ) : (
          <ul className="mt-6 grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id} className="border-t border-line pt-4">
                <RatingStars rating={review.rating} />
                <p className="mt-2 font-medium">{review.title}</p>
                <p className="mt-2 text-sm leading-relaxed">{review.body}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-muted">
                  {review.author} {review.verified ? '· Verified' : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
      {related.status === 'success' && related.data?.length ? (
        <Container className="pb-16">
          <SectionHeading title="You may also like" />
          <ProductGrid products={related.data} />
        </Container>
      ) : null}
      {recent.status === 'success' && recent.data?.length ? (
        <Container className="pb-20">
          <SectionHeading title="Recently viewed" />
          <ProductGrid products={recent.data} />
        </Container>
      ) : null}
      </article>
  )
}

function ProductStage({ product }) {
  const [color, setColor] = useState(product.colors[0]?.name || '')
  const selected = product.colors.find((item) => item.name === color) || product.colors[0]
  return (
    <div className="mt-4 grid items-start gap-6 lg:grid-cols-[auto_minmax(320px,1fr)] lg:gap-10">
      <div className="min-w-0 lg:sticky lg:top-24">
        <ProductGallery key={color} images={colorImages(product, color)} alt={selected?.alt || product.name} />
      </div>
      <div>
        <ProductPurchase product={product} color={color} onColorChange={setColor} />
        <CreatorOpportunity product={product} />
      </div>
    </div>
  )
}

function crumbTrail(product) {
  const crumbs = [{ label: 'Home', href: '/' }]
  if (product.gender === 'men' || product.gender === 'women') {
    crumbs.push({ label: product.gender === 'women' ? 'Women' : 'Men', href: `/${product.gender}` })
  }
  const aisle = departmentPage(product.department) || departmentPage(product.department === 'accessories' ? 'wallets' : '')
  if (aisle) crumbs.push({ label: aisle.title, href: aisle.path })
  const subcategory = subcategoryBySlug(product.category)
  if (subcategory) {
    const gender = product.gender !== 'unisex' ? `?gender=${product.gender}` : ''
    crumbs.push({ label: subcategory.name, href: `/category/${subcategory.slug}${gender}` })
  }
  crumbs.push({ label: product.name })
  return crumbs
}

async function loadRecent(currentSlug) {
  const slugs = readJson(RECENT_KEY, []).filter((item) => item !== currentSlug).slice(0, 4)
  const products = await Promise.all(slugs.map((item) => fetchProduct(item)))
  return products.filter(Boolean)
}
