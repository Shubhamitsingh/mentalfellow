import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'

const variants = {
  primary: 'bg-leaf text-paper hover:bg-[#184a33]',
  secondary: 'border border-leaf bg-transparent text-leaf hover:bg-leaf hover:text-paper',
  ghost: 'bg-transparent text-ink hover:bg-paper-2',
  inverse: 'bg-paper text-ink hover:bg-white',
  green: 'bg-[#0e9b00] text-white hover:bg-[#0c8500]',
  yellow: 'border-0 bg-[#ffd500] text-ink hover:bg-[#f0c800]',
}

const sizes = {
  sm: 'h-10 px-4 text-[11px]',
  md: 'h-12 px-5 text-[11px]',
  lg: 'h-14 px-7 text-xs',
}

export function buttonClass(variant = 'primary', size = 'md', className) {
  return cn(
    'inline-flex items-center justify-center gap-2 font-medium uppercase tracking-[0.16em] transition-colors duration-200 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
    variants[variant],
    sizes[size],
    className,
  )
}

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...props }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />
}

export function ButtonLink({ variant = 'primary', size = 'md', className, ...props }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />
}
