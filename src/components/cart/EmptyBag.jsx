import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function EmptyBag({ onShop, heading = 'p', className }) {
  const Title = heading

  return (
    <div className={cn('flex flex-col items-center px-6 text-center', className)}>
      <BagMark />
      <Title className="mt-8 font-serif text-3xl md:text-4xl">Your bag is empty.</Title>
      <p className="mt-2 text-sm text-muted">Add a piece when you find one.</p>
      <ButtonLink to="/shop" className="mt-8 w-full max-w-lg" onClick={onShop}>
        Start shopping
      </ButtonLink>
    </div>
  )
}

function BagMark() {
  return (
    <svg width="112" height="128" viewBox="0 0 112 128" fill="none" aria-hidden="true">
      <path d="M24 46h64l-7 70H31L24 46z" fill="#e4c56a" />
      <path d="M40 46V34c0-12 7-20 16-20s16 8 16 20v12" stroke="#161815" strokeWidth="3" />
      <path d="M46 78h20" stroke="#161815" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
