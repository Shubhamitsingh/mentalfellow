import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { footerColumns, site } from '@/lib/site'
import { NewsletterForm } from '@/features/home/NewsletterForm'

function SocialIcon({ label }) {
  if (label === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (label === 'YouTube') {
    return (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="currentColor">
        <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.3 5.4 12 5.4 12 5.4s-6.3 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.2V9.2l5.2 3-5.2 3z" />
      </svg>
    )
  }
  return (
    <svg viewBox="8.2 2.6 10 18.2" width="28" height="28" aria-hidden="true" fill="currentColor">
      <path d="M14.2 8.4V6.9c0-.7.4-.9 1.1-.9H17V3.5h-2.2C12.1 3.5 11 4.8 11 6.8v1.6H9.2v2.6H11V20h3.2v-9h2.2l.3-2.6h-2.5z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper text-ink">
      <Container className="border-b border-line py-10 md:py-14">
        <NewsletterForm layout="split" />
      </Container>
      <Container className="grid gap-12 py-12 md:grid-cols-[minmax(0,16rem)_1fr] md:py-16 lg:gap-20">
        <div>
          <Link to="/" className="inline-block" aria-label={site.name}>
            <img src={site.logo} alt="" className="h-14 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Innovative materials, made into products you actually carry, wear, and use.
          </p>
          <ul className="mt-6 flex gap-3">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-paper"
                >
                  <SocialIcon label={social.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-ink hover:text-leaf">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container className="border-t border-line py-6 text-xs text-muted">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </Container>
    </footer>
  )
}
