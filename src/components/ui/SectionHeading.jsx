import { Link } from 'react-router-dom'

export function SectionHeading({ eyebrow, title, href, action = 'View all', compact = false, center = false }) {
  const heading = (
    <div className={center ? 'text-center' : ''}>
      {eyebrow ? <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{eyebrow}</p> : null}
      <h2 className={`mt-1 font-serif leading-none ${compact ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'}`}>{title}</h2>
    </div>
  )

  if (center) {
    return (
      <div className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 ${compact ? 'mb-6' : 'mb-8 md:mb-10'}`}>
        <span />
        <div className="flex items-center justify-center gap-3 md:gap-5">
          <span className="h-px w-6 bg-ink/30 md:w-12" aria-hidden="true" />
          <h2 className="font-serif text-4xl leading-none md:text-5xl">{title}</h2>
          <span className="h-px w-6 bg-ink/30 md:w-12" aria-hidden="true" />
        </div>
        {href ? (
          <Link to={href} className="justify-self-end text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
            {action}
          </Link>
        ) : (
          <span />
        )}
      </div>
    )
  }

  return (
    <div className={`flex items-end justify-between gap-4 ${compact ? 'mb-4' : 'mb-6 md:mb-8'}`}>
      {heading}
      {href ? (
        <Link to={href} className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
          {action}
        </Link>
      ) : null}
    </div>
  )
}
