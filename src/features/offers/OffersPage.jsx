import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { useToast } from '@/contexts/ToastContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { listOffers } from '@/services/coupons'
import { formatMoney } from '@/utils/format'

export default function OffersPage() {
  const toast = useToast()
  const [copied, setCopied] = useState('')
  usePageMeta({
    title: 'Offers',
    description: 'Current Mental Fellow offer codes.',
    path: '/offers',
  })

  async function copy(code) {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(code)
      toast({ title: 'Code copied', message: `${code} is ready to paste in your bag.` })
    } catch {
      setCopied(code)
      toast({ title: code, message: 'Copy it into the bag if your browser blocked the clipboard.' })
    }
  }

  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">This week</p>
      <h1 className="mt-3 font-serif text-5xl md:text-6xl">Offers</h1>
      <p className="mt-4 max-w-xl text-muted">
        Codes apply in the bag. The discount is calculated from the bag total, and checked again before payment.
      </p>
      <ul className="mt-10 divide-y divide-line border-y border-line">
        {listOffers().map((offer) => (
          <li key={offer.code} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-3xl">{offer.code}</p>
              <p className="mt-2 text-sm">{offer.description}</p>
              <p className="mt-1 text-xs text-muted">Minimum bag {formatMoney(offer.minOrder)}</p>
            </div>
            <button type="button" className="h-11 border border-ink px-4 text-[11px] uppercase tracking-[0.16em]" onClick={() => copy(offer.code)}>
              {copied === offer.code ? 'Copied' : 'Copy code'}
            </button>
          </li>
        ))}
      </ul>
      <Link to="/cart" className="mt-8 inline-block text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
        Go to bag
      </Link>
    </Container>
  )
}
