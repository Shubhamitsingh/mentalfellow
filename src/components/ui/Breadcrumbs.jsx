import { Link } from 'react-router-dom'

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {last || !item.href ? (
                <span className="text-ink" aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link to={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
