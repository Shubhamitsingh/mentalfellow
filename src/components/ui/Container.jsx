import { cn } from '@/utils/cn'

export function Container({ className, as: Tag = 'div', children, ...props }) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-10', className)} {...props}>
      {children}
    </Tag>
  )
}
