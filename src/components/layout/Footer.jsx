import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { footerColumns, site } from '@/lib/site'
import { NewsletterForm } from '@/features/home/NewsletterForm'

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.2fr_2fr] md:py-16">
        <div>
          <p className="font-serif text-4xl">{site.name}</p>
          <p className="mt-3 max-w-xs text-sm text-fog">Innovative materials, made into products you actually carry, wear, and use.</p>
          <div className="mt-8 max-w-sm">
            <NewsletterForm tone="dark" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-fog">{column.title}</p>
              <ul className="mt-4 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm hover:text-straw">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <ul className="flex gap-4">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer" className="uppercase tracking-[0.14em] hover:text-paper">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  )
}
