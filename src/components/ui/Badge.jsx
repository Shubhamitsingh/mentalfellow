import { cn } from '@/utils/cn'

const tones = {
  default: 'bg-ink text-paper',
  new: 'bg-straw text-ink',
  sale: 'bg-sale text-white',
  paper: 'bg-paper text-ink',
}

export function Badge({ children, tone = 'default', className }) {
  return (
    <span className={cn('inline-flex h-6 items-center px-2 text-[10px] font-medium uppercase tracking-[0.14em]', tones[tone], className)}>
      {children}
    </span>
  )
}
