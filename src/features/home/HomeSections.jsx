import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, Sprout, Star, Tag, Wheat } from 'lucide-react'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ProductCard } from '@/components/product/ProductCard'
import { previewProducts, previewReviews } from '@/content/previewCatalog'
import { toView } from '@/services/catalog'
import { formatMoney } from '@/utils/format'
import { collectionBySlug } from '@/content/taxonomy'
import { homeContent } from '@/content/home'

export function Hero() {
  const { hero } = homeContent
  const slides = hero.slides
  const pairList = []
  for (let i = 0; i < slides.length; ) {
    if (slides[i].wide || !slides[i + 1] || slides[i + 1].wide) {
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
      <h1 className="sr-only">{hero.title} {hero.emphasis}</h1>
      <button
        type="button"
        className="absolute top-1/2 left-3 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center text-ink drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]"
        aria-label="Previous slide"
        onClick={() => go(-1)}
      >
        <ChevronLeft size={26} strokeWidth={2.25} />
      </button>
      <button
        type="button"
        className="absolute top-1/2 right-3 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center text-ink drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]"
        aria-label="Next slide"
        onClick={() => go(1)}
      >
        <ChevronRight size={26} strokeWidth={2.25} />
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

function useCountdown(endsAt) {
  const end = Date.parse(endsAt)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const remaining = Number.isNaN(end) ? 0 : Math.max(0, end - now)
  const total = Math.floor(remaining / 1000)
  return {
    hours: Math.floor(total / 3600),
    mins: Math.floor((total % 3600) / 60),
    secs: total % 60,
    done: remaining <= 0,
  }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

export function SaleClock() {
  const { sale } = homeContent
  const left = useCountdown(sale.endsAt)
  const label = left.done
    ? 'Shop the sale'
    : `Sale ends in ${left.hours} hours, ${left.mins} minutes, ${left.secs} seconds. Shop the sale.`

  return (
    <Link
      to={sale.href}
      aria-label={label}
      className="block bg-white px-4 py-5 text-center text-ink"
    >
      <p className="text-[13px] font-semibold tracking-[0.22em]">SALE ENDS IN</p>
      {left.done ? (
        <p className="mt-3 text-sm">This window has closed. The sale page is still open.</p>
      ) : (
        <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
          <TimeBox value={pad(left.hours)} unit="Hours" />
          <span aria-hidden="true" className="text-xl leading-none text-ink">’</span>
          <TimeBox value={pad(left.mins)} unit="Mins" />
          <span aria-hidden="true" className="text-xl leading-none text-ink">’</span>
          <TimeBox value={pad(left.secs)} unit="Secs" />
        </div>
      )}
    </Link>
  )
}

function TimeBox({ value, unit }) {
  return (
    <span className="flex h-[4.75rem] w-[5.25rem] flex-col items-center justify-center rounded-[1.15rem] bg-[#ffd500] leading-none sm:h-[5.25rem] sm:w-[5.75rem]">
      <span className="text-[1.65rem] font-semibold tabular-nums tracking-tight sm:text-3xl">{value}</span>
      <span className="mt-1 text-[11px] text-ink/80">{unit}</span>
    </span>
  )
}

export function ShopDoors() {
  return (
    <section className="py-4 md:py-6">
      <Container className="max-w-[1680px] px-4 md:px-6">
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-1 [contain:paint] [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 md:[contain:none] [&::-webkit-scrollbar]:hidden">
          {homeContent.doors.map((item, index) => (
            <CategoryTile
              key={item.href}
              item={item}
              large
              className={`aspect-[2/3] w-[82%] shrink-0 bg-white md:w-full ${index === homeContent.doors.length - 1 ? 'snap-end' : 'snap-start'}`}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}

export function HomeProducts({ products, eyebrow, title, href, mark = true }) {
  if (!products?.length) return null
  return (
    <section className="py-6 md:py-8">
      <Container className="max-w-[1680px] px-4 md:px-6">
        <SectionHeading compact center mark={mark} eyebrow={eyebrow} title={title} href={href} />
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  )
}

export function ShopByMaterial() {
  return (
    <section className="py-8 md:py-12" aria-labelledby="shop-by-material">
      <Container>
        <h2 id="shop-by-material" className="text-center text-xl font-medium uppercase tracking-[0.18em] text-ink md:text-2xl">
          Shop by collection
        </h2>
        <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [contain:paint] [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible md:[contain:none] [&::-webkit-scrollbar]:hidden">
          {homeContent.shopByMaterial.map((item, index) => (
            <Link
              key={item.href}
              to={item.href}
              className={`w-[78%] shrink-0 sm:w-[46%] md:w-auto ${index === homeContent.shopByMaterial.length - 1 ? 'snap-end' : 'snap-start'}`}
            >
              <span className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-paper-2">
                <img src={item.image} alt={item.alt} className="h-full w-full object-cover object-[center_18%]" />
                <span className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/50 to-transparent" />
                <span className="absolute inset-x-3 top-5 text-center text-[1.85rem] font-semibold uppercase leading-none tracking-[0.04em] text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:text-4xl lg:text-5xl">
                  {item.label}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function CustomerNotes() {
  const notes = Object.entries(previewReviews).flatMap(([slug, reviews]) => {
    const product = previewProducts.find((item) => item.slug === slug)
    if (!product) return []
    const view = toView(product)
    return reviews.map((review) => ({
      ...review,
      product: view,
      image: review.image,
      imageAlt: review.imageAlt || view.name,
    }))
  })

  if (!notes.length) return null

  return (
    <section className="py-8 md:py-12" aria-labelledby="customer-notes">
      <Container>
        <h2 id="customer-notes" className="text-center text-xl font-medium uppercase tracking-[0.18em] text-ink md:text-2xl">
          What customers say
        </h2>
      </Container>
      <div className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-ps-5 scroll-pe-5 px-5 [contain:paint] [scrollbar-width:none] md:scroll-ps-8 md:scroll-pe-8 md:px-8 lg:scroll-ps-10 lg:scroll-pe-10 lg:px-10 [&::-webkit-scrollbar]:hidden">
        {notes.map((note, index) => (
          <article key={note.id} className={`w-[calc(100%-1.5rem)] shrink-0 overflow-hidden rounded-2xl border border-line bg-white sm:w-[300px] ${index === notes.length - 1 ? 'snap-end' : 'snap-start'}`}>
              <Link to={`/product/${note.product.slug}`} className="block">
                <img src={note.image} alt={note.imageAlt} className="h-96 w-full object-cover object-[center_20%] sm:h-[26rem]" />
              </Link>
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{note.author}</p>
                  <p className="inline-flex items-center gap-1 text-sm">
                    <Star size={14} className="fill-straw text-straw" aria-hidden />
                    <span>{note.rating.toFixed(1)}</span>
                    <span className="sr-only">out of 5</span>
                  </p>
                </div>
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">{note.body}</p>
                <Link to={`/product/${note.product.slug}`} className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 text-sm">
                  <span className="font-medium">{note.product.name}</span>
                  <span>{formatMoney(note.product.price)}</span>
                </Link>
              </div>
            </article>
          ))}
      </div>
    </section>
  )
}

function CategoryTile({ item, className, large = false }) {
  return (
    <Link to={item.href} className={`group relative block overflow-hidden bg-paper-2 ${className}`}>
      <img
        src={item.image}
        alt={item.alt}
        className={`absolute inset-0 h-full w-full object-cover ${large ? 'object-center' : `transition duration-700 group-hover:scale-105 ${item.fit || 'object-center'}`}`}
      />
      <span
        className={
          large
            ? 'pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/80 to-transparent'
            : 'pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 to-transparent'
        }
      />
      <span className={`absolute inset-x-0 bottom-0 text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${large ? 'p-6 md:p-10' : 'p-4 md:p-5'}`}>
        <span className={`block ${large ? 'font-serif text-5xl leading-none md:text-7xl' : 'font-serif text-2xl leading-none md:text-3xl'}`}>{item.label}</span>
        {large ? (
          <span className="mt-4 inline-block w-fit rounded-md bg-paper px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
            Explore
          </span>
        ) : null}
      </span>
    </Link>
  )
}

export function DiscoverBanner() {
  const { discover } = homeContent
  return (
    <section className="w-full pb-6 md:pb-8" aria-label={discover.title}>
      <div className="relative min-h-[560px] overflow-hidden bg-ink md:min-h-[720px]">
        <img src={discover.image} alt={discover.alt} className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-ink/20" />
        <div className="relative flex min-h-[560px] flex-col items-center justify-end px-6 pb-10 text-center text-paper md:min-h-[720px] md:pb-14">
          <h2 className="font-sans text-4xl font-medium uppercase tracking-[0.18em] md:text-6xl">{discover.title}</h2>
          <ButtonLink to={discover.href} variant="inverse" className="mt-6 rounded-full px-8">
            {discover.action}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export function EditorialBanner() {
  const { materialStory: editorial } = homeContent
  return (
    <section className="relative mb-6 min-h-[280px] bg-ink md:mb-8 md:min-h-[340px]">
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

export function BrandStory() {
  const { story } = homeContent
  return (
    <section className="grid bg-ink lg:grid-cols-2">
      <img
        src={story.image}
        alt={story.alt}
        className="h-[420px] w-full object-cover object-[center_18%] lg:h-auto lg:min-h-[640px]"
      />
      <div className="flex flex-col justify-center px-6 py-12 text-paper md:px-14 md:py-16 lg:px-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-paper/70">{story.eyebrow}</p>
        <h2 className="mt-4 max-w-lg font-serif text-4xl leading-[1.05] md:text-6xl">{story.title}</h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-paper/90">{story.body}</p>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-paper/15 pt-8">
          {homeContent.materialNotes.map((item) => {
            const Icon = materialNoteIcons[item.icon]
            return (
              <div key={item.label} className="flex flex-col items-start">
                <Icon size={22} strokeWidth={1.25} aria-hidden="true" />
                <p className="mt-3 max-w-[12rem] text-[11px] uppercase tracking-[0.16em]">{item.label}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const materialNoteIcons = {
  sprout: Sprout,
  wheat: Wheat,
  tag: Tag,
  bag: ShoppingBag,
}
