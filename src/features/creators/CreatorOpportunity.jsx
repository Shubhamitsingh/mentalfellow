import { Link } from 'react-router-dom'
import { useCreator } from '@/contexts/CreatorContext'
import { cashbackFor } from '@/features/creators/rules'
import { formatMoney } from '@/utils/format'

export function CreatorOpportunity({ product }) {
  const creator = useCreator()
  const quote = cashbackFor([{ price: product.price, qty: 1, department: product.department }], creator.settings)
  return (
    <section className="mt-8 border border-line bg-white p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-leaf">Creator cashback</p>
      <p className="mt-2 text-sm leading-relaxed">
        Buy this product as usual. After delivery, post it on Instagram. An admin checks the link, then cashback can be added.
      </p>
      {quote.eligible ? <p className="mt-3 text-sm">Possible cashback {formatMoney(quote.amount)}</p> : null}
      <p className="mt-2 text-xs leading-relaxed text-muted">{creator.settings.contentRequirement} Cashback is conditional and depends on an admin review.</p>
      <Link to={creator.profile?.status === 'approved' ? '/creators/desk' : '/creators/join'} className="mt-4 inline-block text-sm uppercase tracking-[0.12em] underline">
        {creator.profile?.status === 'approved' ? 'My cashback orders' : 'Become a creator'}
      </Link>
    </section>
  )
}
