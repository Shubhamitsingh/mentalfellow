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
      <ul className="mt-10 grid gap-4">
        {listOffers().map((offer) => {
          const tone = offerTones[offer.code] || offerTones.WELCOME10
          const amount = offer.type === 'percent' ? `${offer.value}%` : formatMoney(offer.value)
          return (
            <li key={offer.code} className="overflow-hidden rounded-2xl border border-line bg-white sm:grid sm:grid-cols-[8.5rem_1fr]">
              <div className={`flex items-end justify-between gap-3 px-5 py-5 sm:flex-col sm:items-start sm:justify-center ${tone.panel}`}>
                <p className="font-serif text-4xl leading-none">{amount}</p>
                <p className="text-[11px] uppercase tracking-[0.16em]">off</p>
              </div>
              <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={`font-serif text-2xl tracking-[0.04em] ${tone.code}`}>{offer.code}</p>
                  <p className="mt-2 text-sm">{offer.description}</p>
                  <p className="mt-1 text-xs text-muted">Minimum bag {formatMoney(offer.minOrder)}</p>
                </div>
                <button
                  type="button"
                  className={`h-11 shrink-0 rounded-md px-4 text-[11px] uppercase tracking-[0.16em] ${copied === offer.code ? 'bg-ink text-paper' : tone.button}`}
                  onClick={() => copy(offer.code)}
                >
                  {copied === offer.code ? 'Copied' : 'Copy code'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <Link to="/cart" className="mt-8 inline-block text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
        Go to bag
      </Link>
    </Container>
  )
}

const offerTones = {
  WELCOME10: {
    panel: 'bg-leaf text-paper',
    code: 'text-leaf',
    button: 'bg-leaf text-paper',
  },
  FIRSTORDER: {
    panel: 'bg-straw text-ink',
    code: 'text-ink',
    button: 'bg-ink text-paper',
  },
  FESTIVE20: {
    panel: 'bg-sale text-paper',
    code: 'text-sale',
    button: 'bg-sale text-paper',
  },
}
