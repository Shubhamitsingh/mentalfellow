import { Link } from 'react-router-dom'
import { site } from '@/lib/site'

export function AnnouncementBar() {
  if (!site.announcement.enabled) return null
  return (
    <div className="bg-ink text-paper">
      <Link
        to={site.announcement.href}
        className="block px-4 py-2 text-center text-[11px] uppercase tracking-[0.18em]"
      >
        {site.announcement.message}
      </Link>
    </div>
  )
}
