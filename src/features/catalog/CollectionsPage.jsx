import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'
import { collections } from '@/content/taxonomy'

export default function CollectionsPage() {
  usePageMeta({
    title: 'Collections',
    description: 'Edits that cut across bags, wallets, shoes, and travel. A product can sit in more than one.',
    path: '/collections',
  })

  return (
    <Container className="py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Edits</p>
      <h1 className="mt-3 font-serif text-5xl md:text-7xl">Collections</h1>
      <p className="mt-4 max-w-xl text-muted">
        A collection is not a category. Travel can hold a weekender, a passport wallet, and a luggage tag at the same time.
      </p>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <li key={collection.slug}>
            <Link to={`/collections/${collection.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
                <img src={collection.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute top-3 left-3 inline-flex h-7 items-center bg-straw px-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink">
                  {collection.name}
                </span>
              </div>
              <h2 className="mt-4 font-serif text-3xl">{collection.name}</h2>
              <p className="mt-2 text-sm text-muted">{collection.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
