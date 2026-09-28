import { Link } from 'react-router-dom'

export function SectionHeading({ eyebrow, title, href, action = 'View all', compact = false, center = false, mark = false }) {
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
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {mark ? <BrandSide /> : <span className="h-px w-6 bg-ink/30 md:w-12" aria-hidden="true" />}
          <h2 className="font-serif text-[34px] leading-none">{title}</h2>
          {mark ? <BrandSide flip /> : <span className="h-px w-6 bg-ink/30 md:w-12" aria-hidden="true" />}
        </div>
        {href ? (
          <Link to={href} className="justify-self-end whitespace-nowrap text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
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

function BrandSide({ flip = false }) {
  return (
    <span className={`flex items-center gap-1.5 text-ink ${flip ? 'flex-row-reverse' : ''}`} aria-hidden="true">
      <span className="h-[3px] w-3.5 rounded-full bg-current md:w-8" />
      <svg viewBox="0 0 24 28" className="h-4 w-3.5 shrink-0 md:h-5 md:w-4" fill="currentColor">
        <path d="M12 .4 14.2 11.1 23.6 14 14.2 16.9 12 27.6 9.8 16.9.4 14 9.8 11.1Z" />
      </svg>
    </span>
  )
}
