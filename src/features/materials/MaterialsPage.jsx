import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'
import { materialProcess, materials } from '@/content/taxonomy'
import { productsForMaterial } from '@/services/catalog'

const lineSlugs = ['paddy-rice-waste', 'wheat-waste']

export default function MaterialsPage() {
  usePageMeta({
    title: 'Materials',
    description: 'Plant-based leather from rice straw and suede from wheat straw.',
    path: '/materials',
  })

  const line = lineSlugs.map((slug) => materials.find((item) => item.slug === slug)).filter(Boolean)

  return (
    <Container className="py-10 md:py-14">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Materials</p>
      <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-none text-leaf md:text-6xl">Rice straw and wheat straw.</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        I make only these two. Rice straw becomes the leather. Wheat straw becomes the suede. Both belong to Sonbhadra, Uttar Pradesh, which is home.
      </p>
      <ul className="mt-8 grid gap-6 lg:grid-cols-2">
        {line.map((material) => {
          const count = productsForMaterial(material.slug).length
          return (
            <li key={material.slug}>
              <Link to={`/materials/${material.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
                  <img src={material.image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-leaf">{material.source}</p>
                <h2 className="mt-1 font-serif text-4xl text-leaf">{material.name}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{material.story}</p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.14em]">
                  {count === 0 ? 'No products yet' : `Shop ${count} ${count === 1 ? 'product' : 'products'}`}
                </p>
              </Link>
            </li>
          )
        })}
      </ul>
      <ol className="mt-12 grid gap-4 border-t border-line pt-8 sm:grid-cols-4">
        {materialProcess.map((step, index) => (
          <li key={step}>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{index + 1}</p>
            <p className="mt-2 text-sm">{step}</p>
          </li>
        ))}
      </ol>
    </Container>
  )
}
