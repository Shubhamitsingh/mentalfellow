import { Link } from 'react-router-dom'

export function SectionHeading({ eyebrow, title, href, action = 'View all', compact = false }) {
  return (
    <div className={`flex items-end justify-between gap-4 ${compact ? 'mb-4' : 'mb-6 md:mb-8'}`}>
      <div>
        {eyebrow ? <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{eyebrow}</p> : null}
        <h2 className={`mt-1 font-serif leading-none ${compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>{title}</h2>
      </div>
      {href ? (
        <Link to={href} className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
          {action}
        </Link>
      ) : null}
    </div>
  )
}
