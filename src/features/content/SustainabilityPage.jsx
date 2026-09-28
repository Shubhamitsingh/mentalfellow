import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'
import { photo } from '@/content/media'

const sections = [
  {
    id: 'source',
    kicker: 'Where materials come from',
    title: 'A residue is not a product yet.',
    body: 'We work with two straws. Rice straw is finished as leather. Wheat straw is finished as suede. The product page tells you which one you are holding.',
    image: '/materials/rice-straw-leather.png',
    alt: 'Rice-straw leather beside a bundle of rice straw',
  },
  {
    id: 'waste',
    kicker: 'Agricultural waste',
    title: 'What is left after the harvest.',
    body: 'The straw is gathered after the crop is cut. Leather and suede are what leave the workshop. I describe that change. I do not dress it up as a number I have not checked.',
    image: '/materials/wheat-straw-suede.png',
    alt: 'Wheat-straw suede beside stalks of wheat',
  },
  {
    id: 'innovation',
    kicker: 'Material innovation',
    title: 'The middle of the process is the work.',
    body: 'Residue becomes a sheet, a cloth, or a fibre that can be cut and stitched. Hardware, linings, soles, and straps are often a different material. The product page lists them apart from the headline fibre.',
    image: photo('photo-1523381210434-271e8be1f52b', 1600, 1100),
    alt: 'Folded cloth stacked on a table',
  },
  {
    id: 'make',
    kicker: 'Design and manufacturing',
    title: 'It still has to be carried.',
    body: 'A bag needs a strap that adjusts. A shoe needs a size that matches a foot. A wallet needs a slot a card actually fits. Design is the part that makes the material usable.',
    image: photo('photo-1548036328-c9fa89d128fa', 1600, 1100),
    alt: 'A finished bag in studio light',
  },
  {
    id: 'life',
    kicker: 'Product lifecycle',
    title: 'Use, care, and what we will not pretend.',
    body: 'Care notes are on the product. We do not describe a product as zero impact, completely sustainable, or 100 percent eco-friendly. Verified figures are added when a batch has them, and left off when it does not.',
    image: photo('photo-1542601906990-b4d3fb778b09', 1600, 1100),
    alt: 'Hands holding a small green plant',
  },
  {
    id: 'future',
    kicker: 'Future materials',
    title: 'The list is not finished.',
    body: 'Corn residue and other feedstocks are already named so they can be attached to products later. A new material does not require a new website. It requires a record: source, process, and the products that use it.',
    image: photo('photo-1441974231531-c6227db76b6e', 1600, 1100),
    alt: 'Sunlight through a stand of trees',
  },
]

export default function SustainabilityPage() {
  usePageMeta({
    title: 'Sustainability',
    description: 'How Mental Fellow talks about materials, agricultural residue, and what a product page is allowed to claim.',
    path: '/sustainability',
  })

  return (
    <article>
      <Container className="py-12 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Approach</p>
        <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[0.95] md:text-7xl">The material is the brief. The product is the proof.</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Mental Fellow is a sustainable fashion and lifestyle brand. The claim we will stand behind is specific: what the material is made from, and what the product is for.
        </p>
      </Container>
      {sections.map((section, index) => (
        <section key={section.id} className={index % 2 ? 'bg-paper-2' : ''}>
          <Container className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-16">
            <div className={index % 2 ? 'md:order-2' : ''}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{section.kicker}</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{section.title}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed md:text-base">{section.body}</p>
            </div>
            <div className="aspect-[4/3] overflow-hidden bg-ink">
              <img src={section.image} alt={section.alt} className="h-full w-full object-cover" />
            </div>
          </Container>
        </section>
      ))}
      <Container className="py-12 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Future vision</p>
        <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-6xl">More materials. More products. The same standard of saying what is true.</h2>
        <Link to="/materials" className="mt-8 inline-block text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
          Explore materials
        </Link>
      </Container>
    </article>
  )
}
