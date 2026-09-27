import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCard } from '@/components/product/ProductCard'
import { NewsletterForm } from '@/features/home/NewsletterForm'
import { materials } from '@/content/taxonomy'
import { collectionBySlug } from '@/content/taxonomy'
import { homeContent } from '@/content/home'

export function Hero() {
  const { hero } = homeContent
  const slides = hero.slides
  const pairList = []
  for (let i = 0; i < slides.length; i += 2) pairList.push(slides.slice(i, i + 2))
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (pairList.length < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % pairList.length)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [pairList.length])

  function go(next) {
    setIndex((next + pairList.length) % pairList.length)
  }

  return (
    <section
      className="relative h-[560px] overflow-hidden bg-ink md:h-[720px]"
      aria-roledescription="carousel"
      aria-label="Collection"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {pairList.map((pair) => (
            <div key={pair[0].src} className="grid h-full min-w-full grid-cols-1 md:grid-cols-2">
              {pair.map((slide) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`h-full w-full object-cover object-[center_18%] ${pair.length === 1 ? 'md:col-span-2' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
      <div className="relative z-10 flex h-full items-end">
        <Container className="pb-16">
          <div className="pl-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-paper/80">{hero.eyebrow}</p>
            <h1 className="mt-2 max-w-xl font-serif text-5xl leading-[0.9] text-paper md:text-7xl">
              {hero.title} <span className="italic">{hero.emphasis}</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-paper/90 md:text-base">{hero.subtitle}</p>
            <div className="mt-8">
              <ButtonLink to={hero.href}>{hero.action}</ButtonLink>
            </div>
          </div>
        </Container>
      </div>
      <button
        type="button"
        className="absolute top-1/2 left-3 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-3 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
      >
        <ChevronRight size={18} />
      </button>
      <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2">
        {pairList.map((pair, slideIndex) => (
          <button
            key={pair[0].src}
            type="button"
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={slideIndex === index ? 'true' : undefined}
            className={`h-2 rounded-full ${slideIndex === index ? 'w-6 bg-paper' : 'w-2 bg-paper/50'}`}
            onClick={() => setIndex(slideIndex)}
          />
        ))}
      </div>
    </section>
  )
}

export function TrustStrip() {
  const items = ['Material named on every product', 'Free shipping above ₹999', '7-day exchange']
  return (
    <Container className="grid gap-2 border-b border-line py-3 text-[11px] uppercase tracking-[0.16em] text-muted sm:grid-cols-3">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </Container>
  )
}

export function HomeProducts({ products }) {
  if (!products?.length) return null
  return (
    <section className="py-6 md:py-8">
      <Container className="max-w-[1680px] px-4 md:px-6">
        <SectionHeading compact eyebrow="The line" title="All products" href="/shop" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export function CategoryGrid() {
  return (
    <section className="py-4 md:py-8">
      <Container>
        <SectionHeading eyebrow="Find" title="Shop the line" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {homeContent.departments.map((item) => (
            <CategoryTile key={item.href} item={item} className="h-36 md:h-44" />
          ))}
        </div>
      </Container>
    </section>
  )
}

function CategoryTile({ item, className }) {
  return (
    <Link to={item.href} className={`group relative block overflow-hidden bg-paper-2 ${className}`}>
      <img src={item.image} alt={item.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent p-4 text-sm uppercase tracking-[0.16em] text-paper">
        {item.label}
      </span>
    </Link>
  )
}

export function EditorialBanner() {
  const { materialStory: editorial } = homeContent
  return (
    <section className="relative min-h-[280px] bg-ink md:min-h-[340px]">
      <img src={editorial.image} alt={editorial.alt} className="absolute inset-0 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 bg-ink/35" />
      <Container className="relative flex min-h-[280px] flex-col justify-end py-8 text-paper md:min-h-[340px]">
        <p className="text-[11px] uppercase tracking-[0.2em]">{editorial.eyebrow}</p>
        <h2 className="mt-2 max-w-3xl font-serif text-4xl leading-none md:text-5xl">{editorial.title}</h2>
        <p className="mt-4 max-w-md text-sm md:text-base">{editorial.body}</p>
        <ButtonLink to={editorial.href} variant="inverse" className="mt-8 w-fit">
          {editorial.action}
        </ButtonLink>
      </Container>
    </section>
  )
}

export function FeaturedCollection({ products }) {
  const collection = collectionBySlug('travel')
  if (!collection) return null
  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading eyebrow="Featured collection" title={collection.name} href={`/collections/${collection.slug}`} action="View the edit" />
        <p className="mb-8 max-w-lg text-sm text-muted">{collection.description}</p>
        <div className="grid gap-5 md:grid-cols-4">
          {(products || []).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}

const innovationSlugs = ['paddy-rice-waste', 'wheat-waste']

export function MaterialInnovation() {
  const items = innovationSlugs.map((slug) => materials.find((item) => item.slug === slug)).filter(Boolean)
  return (
    <section className="pb-12 md:pb-16">
      <Container>
        <SectionHeading eyebrow="Material innovation" title="Rice straw and wheat straw" href="/materials" action="All materials" />
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((material) => (
            <Link key={material.slug} to={`/materials/${material.slug}`} className="group">
              <div className="aspect-[3/4] overflow-hidden bg-paper-2">
                <img src={material.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <h3 className="mt-3 font-serif text-2xl">{material.name}</h3>
              <p className="text-sm text-leaf">{material.source}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function BrandStory() {
  const { story } = homeContent
  return (
    <section className="border-t border-line py-12 md:py-16">
      <Container className="grid gap-8 md:grid-cols-2 md:items-end">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{story.eyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{story.title}</h2>
        </div>
        <p className="max-w-md text-base leading-relaxed md:justify-self-end">{story.body}</p>
      </Container>
    </section>
  )
}

export function NewsletterBand() {
  return (
    <section className="border-t border-line py-12">
      <Container className="max-w-xl">
        <NewsletterForm />
      </Container>
    </section>
  )
}
