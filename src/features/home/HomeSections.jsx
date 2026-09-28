import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ShoppingBag, Sprout, Tag, Wheat } from 'lucide-react'
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
              <span className="block whitespace-nowrap font-sans text-[clamp(1.55rem,9vw,3rem)] font-light uppercase tracking-[0.08em] sm:tracking-[0.16em] md:text-7xl md:tracking-[0.28em]">
                {hero.title}
              </span>
              <span className="mt-[10px] block whitespace-nowrap font-script text-[7rem] leading-none md:mt-[18px] md:text-[12rem]">{hero.emphasis}</span>
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
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {homeContent.doors.map((item) => (
            <CategoryTile key={item.href} item={item} large className="aspect-[2/3] w-[82%] shrink-0 snap-start bg-white md:w-full" />
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
        <SectionHeading compact center eyebrow={eyebrow} title={title} href={href} />
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
  const row = useRef(null)

  function move(direction) {
    const scroller = row.current
    if (!scroller) return
    const card = scroller.querySelector('a')
    const distance = (card?.offsetWidth || 240) + 16
    scroller.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  return (
    <section className="py-8 md:py-12" aria-labelledby="shop-by-material">
      <Container>
        <h2 id="shop-by-material" className="text-center font-serif text-3xl text-ink md:text-4xl">
          Shop by material
        </h2>
        <div className="relative mt-6 md:mt-8">
          <button
            type="button"
            aria-label="Previous materials"
            onClick={() => move(-1)}
            className="absolute top-1/2 left-0 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-sm ring-1 ring-line"
          >
            <ChevronLeft size={18} />
          </button>
          <div
            ref={row}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {homeContent.shopByMaterial.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="w-[72%] shrink-0 snap-start sm:w-[46%] lg:w-[23%]"
              >
                <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-paper-2">
                  <img src={item.image} alt={item.alt} className="h-full w-full object-cover object-[center_20%]" />
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent" />
                  <span className="absolute inset-x-3 top-4 text-center font-serif text-2xl leading-none text-paper md:text-[1.7rem]">
                    {item.label}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next materials"
            onClick={() => move(1)}
            className="absolute top-1/2 right-0 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-sm ring-1 ring-line"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  )
}

export function CategoryGrid() {
  return (
    <section className="py-8 md:py-12">
      <Container>
        <SectionHeading eyebrow="Find" title="Shop the line" />
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {homeContent.departments.map((item) => (
            <CategoryTile key={item.href} item={item} className="aspect-[3/4] rounded-2xl" />
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
    <section className="border-t border-line py-12 md:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">The material</p>
            <h2 className="mt-3 max-w-md font-serif text-4xl leading-[1.05] md:text-6xl">From a field in Sonbhadra.</h2>
            <p className="mt-5 max-w-md text-base leading-relaxed">
              After the crop is cut, rice straw and wheat straw are what remain. Rice straw is finished into leather. Wheat straw is finished into suede. The straw is named on the product.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <ButtonLink to="/our-story" variant="secondary">Read the story</ButtonLink>
              <Link to="/materials" className="text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
                All materials
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((material) => (
              <Link key={material.slug} to={`/materials/${material.slug}`} className="group">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-paper-2">
                  <img
                    src={material.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/45 to-transparent p-4 pt-16 text-paper md:p-5">
                    <span className="block font-serif text-2xl leading-none">{material.name}</span>
                    <span className="mt-2 block text-sm leading-snug text-paper/90">{material.story}</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
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

export function NewsletterBand() {
  return (
    <section className="border-t border-line py-12">
      <Container className="max-w-xl">
        <NewsletterForm />
      </Container>
    </section>
  )
}
