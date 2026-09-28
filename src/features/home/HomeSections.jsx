import { useEffect, useRef, useState } from 'react'
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
  for (let i = 0; i < slides.length; ) {
    if (slides[i].wide) {
      pairList.push([slides[i]])
      i += 1
    } else {
      pairList.push(slides.slice(i, i + 2))
      i += 2
    }
  }
  const count = pairList.length
  const track = count > 1 ? [...pairList, pairList[0]] : pairList
  const [index, setIndex] = useState(0)
  const [motionOn, setMotionOn] = useState(true)
  const indexRef = useRef(0)
  indexRef.current = index
  const active = index === count ? 0 : index

  useEffect(() => {
    if (count < 2) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      const visual = indexRef.current >= count ? 0 : indexRef.current
      setMotionOn(true)
      setIndex(visual + 1)
    }, 4000)
    return () => window.clearInterval(timer)
  }, [count])

  useEffect(() => {
    if (motionOn) return undefined
    const frame = window.requestAnimationFrame(() => setMotionOn(true))
    return () => window.cancelAnimationFrame(frame)
  }, [motionOn])

  function finishLoop(event) {
    if (event.propertyName !== 'transform' || event.target !== event.currentTarget) return
    if (indexRef.current !== count) return
    setMotionOn(false)
    setIndex(0)
  }

  function go(step) {
    const visual = indexRef.current >= count ? 0 : indexRef.current
    const next = visual + step
    if (next >= 0) {
      setMotionOn(true)
      setIndex(next > count ? count : next)
      return
    }
    setMotionOn(false)
    setIndex(count)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setMotionOn(true)
        setIndex(count - 1)
      })
    })
  }

  return (
    <section
      className="relative h-[560px] overflow-hidden bg-ink md:h-[720px]"
      aria-roledescription="carousel"
      aria-label="Collection"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`flex h-full ${motionOn ? 'transition-transform duration-700 ease-out' : ''}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTransitionEnd={finishLoop}
        >
          {track.map((pair, pairIndex) => (
            <div key={`${pair[0].src}-${pairIndex}`} className="grid h-full min-w-full grid-cols-1 md:grid-cols-2">
              {pair.map((slide) => (
                <img
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  className={`h-full w-full object-cover ${slide.wide ? 'object-center' : 'object-[center_18%]'} ${pair.length === 1 ? 'md:col-span-2' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(22,24,21,0.55),transparent_68%)]" />
      <div className="relative z-10 flex h-full items-center">
        <Container className="w-full">
          <div className="mx-auto max-w-4xl px-14 text-center md:px-20">
            <p className="text-[11px] uppercase tracking-[0.28em] text-paper/80">{hero.eyebrow}</p>
            <h1 className="mt-2 text-paper">
              <span className="block font-sans text-5xl font-light uppercase tracking-[0.22em] md:text-7xl md:tracking-[0.28em]">
                {hero.title}
              </span>
              <span className="mt-4 block whitespace-nowrap font-script text-[7rem] leading-none md:mt-6 md:text-[12rem]">{hero.emphasis}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm text-paper/90 md:text-base">{hero.subtitle}</p>
            <div className="mt-8 flex justify-center">
              <ButtonLink to={hero.href} className="rounded-lg px-8">{hero.action}</ButtonLink>
            </div>
          </div>
        </Container>
      </div>
      <button
        type="button"
        className="absolute top-1/2 left-3 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink"
        aria-label="Previous slide"
        onClick={() => go(-1)}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-3 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper/90 text-ink"
        aria-label="Next slide"
        onClick={() => go(1)}
      >
        <ChevronRight size={18} />
      </button>
      <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2">
        {pairList.map((pair, slideIndex) => (
          <button
            key={pair[0].src}
            type="button"
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={slideIndex === active ? 'true' : undefined}
            className={`h-2 rounded-full ${slideIndex === active ? 'w-6 bg-paper' : 'w-2 bg-paper/50'}`}
            onClick={() => {
              setMotionOn(true)
              setIndex(slideIndex)
            }}
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

export function ShopDoors() {
  return (
    <section className="py-4 md:py-6">
      <Container className="max-w-[1680px] px-4 md:px-6">
        <div className="grid gap-3 md:grid-cols-2">
          {homeContent.doors.map((item) => (
            <CategoryTile key={item.href} item={item} large className="aspect-[2/3] w-full bg-white" />
          ))}
        </div>
      </Container>
    </section>
  )
}

export function HomeProducts({ products, eyebrow, title, href }) {
  if (!products?.length) return null
  return (
    <section className="py-6 md:py-8">
      <Container className="max-w-[1680px] px-4 md:px-6">
        <SectionHeading compact eyebrow={eyebrow} title={title} href={href} />
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

function CategoryTile({ item, className, large = false }) {
  return (
    <Link to={item.href} className={`group relative block overflow-hidden bg-paper-2 ${className}`}>
      <img
        src={item.image}
        alt={item.alt}
        className={large
          ? 'absolute inset-0 h-full w-full object-cover object-center'
          : `h-full w-full transition duration-700 group-hover:scale-105 ${item.fit || 'object-cover'}`}
      />
      <span
        className={
          large
            ? 'pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/80 to-transparent'
            : 'pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent'
        }
      />
      <span className={`absolute inset-x-0 bottom-0 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${large ? 'p-6 md:p-10' : 'p-4'}`}>
        <span className={`block ${large ? 'font-serif text-5xl leading-none md:text-7xl' : 'text-sm uppercase tracking-[0.16em]'}`}>{item.label}</span>
        {large ? <span className="mt-3 block text-sm font-medium uppercase tracking-[0.22em]">Explore</span> : null}
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
