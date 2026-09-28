import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'
import { pages } from '@/content/pages'

export default function ContentPage({ slug }) {
  const page = pages[slug]
  usePageMeta({ title: page?.title || 'Mental Fellow', description: page?.description, path: `/${slug}` })
  if (!page) return null
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Mental Fellow</p>
      <h1 className={`mt-3 font-serif text-5xl md:text-6xl ${slug === 'about' || slug === 'our-story' ? 'text-leaf' : ''}`}>{page.title}</h1>
      {page.lead ? <p className="mt-6 font-serif text-2xl leading-snug md:text-3xl">{page.lead}</p> : null}
      {page.sections?.length ? (
        <div className="mt-10 divide-y divide-line border-y border-line">
          {page.sections.map((section) => (
            <section key={section.title} className="grid gap-3 py-6 md:grid-cols-[13rem_1fr] md:gap-10 md:py-8">
              <h2 className="font-serif text-2xl leading-tight">{section.title}</h2>
              <div className="space-y-3 text-base leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-5 text-base leading-relaxed">
          {page.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
      {page.links?.length ? (
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
          {page.links.map((link) => (
            <li key={link.href}>
              <Link to={link.href} className="text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {page.more ? (
        <Link to={page.more.href} className="mt-8 inline-block text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
          {page.more.label}
        </Link>
      ) : null}
    </Container>
  )
}
