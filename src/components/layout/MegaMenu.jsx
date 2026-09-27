import { Link } from 'react-router-dom'

export function MegaMenu({ menu, onNavigate }) {
  return (
    <div className="absolute inset-x-0 top-full z-40 max-h-[70vh] overflow-y-auto border-t border-line bg-paper shadow-sm">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-x-8 gap-y-8 px-8 py-8 md:grid-cols-4 xl:grid-cols-6">
        {menu.columns.map((column) => (
          <div key={column.key || column.title}>
            <p className="min-h-4 text-[11px] uppercase tracking-[0.18em] text-muted">{column.title}</p>
            <ul className="mt-4 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm hover:underline" onClick={onNavigate}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CollectionMenu({ collections, onNavigate }) {
  return (
    <div className="absolute inset-x-0 top-full z-40 max-h-[70vh] overflow-y-auto border-t border-line bg-paper">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-8 py-8 md:grid-cols-4 xl:grid-cols-5">
        {collections.map((collection) => (
          <Link key={collection.slug} to={`/collections/${collection.slug}`} onClick={onNavigate} className="group">
            <div className="aspect-[4/5] overflow-hidden bg-paper-2">
              <img src={collection.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <p className="mt-3 text-sm">{collection.name}</p>
            <p className="text-sm text-muted">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
