import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { menus } from '@/content/taxonomy'
import { collections, footerColumns, primaryNav, site } from '@/lib/site'

export function MobileMenu({ open, onClose }) {
  return (
    <Drawer open={open} onClose={onClose} side="left" title={site.name} label="Menu">
      <nav className="px-5 py-4">
        <ul>
          {primaryNav.map((item) => (
            <li key={item.id} className="border-b border-line">
              {item.menu === 'collections' ? (
                <Accordion
                  label={item.label}
                  href={item.href}
                  onNavigate={onClose}
                  links={collections.map((collection) => ({
                    label: collection.name,
                    href: `/collections/${collection.slug}`,
                  }))}
                />
              ) : item.menu && menus[item.menu] ? (
                <Accordion label={item.label} href={item.href} onNavigate={onClose} columns={menus[item.menu].columns} />
              ) : (
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={`flex h-14 items-center text-sm uppercase tracking-[0.16em] ${item.tone === 'sale' ? 'text-sale' : ''}`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-8 grid grid-cols-2 gap-6">
          {footerColumns.slice(1, 3).map((column) => (
            <div key={column.title}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} onClick={onClose} className="text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </Drawer>
  )
}

function Accordion({ label, href, columns, links, onNavigate, tone }) {
  const [open, setOpen] = useState(false)
  const rows = links || columns.flatMap((column) => column.links)
  return (
    <div>
      <div className="flex items-center">
        <Link to={href} onClick={onNavigate} className={`flex h-14 flex-1 items-center text-sm uppercase tracking-[0.16em] ${tone === 'sale' ? 'text-sale' : ''}`}>
          {label}
        </Link>
        <button type="button" className="grid h-11 w-11 place-items-center" aria-expanded={open} aria-label={`${open ? 'Hide' : 'Show'} ${label} categories`} onClick={() => setOpen((value) => !value)}>
          <ChevronDown size={16} className={open ? 'rotate-180' : ''} />
        </button>
      </div>
      {open ? (
        <ul className="pb-4">
          {rows.map((link) => (
            <li key={link.href}>
              <Link to={link.href} onClick={onNavigate} className="flex h-10 items-center text-sm text-muted">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
