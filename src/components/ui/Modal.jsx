import { useEffect, useRef } from 'react'
import { cn } from '@/utils/cn'

export function Modal({ open, onClose, label, children, className }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!open || !node) return undefined
    if (!node.open) node.showModal()
    return () => {
      if (node.open) node.close()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={cn(!/\bw-/.test(className || '') && 'w-[min(560px,calc(100%-2rem))]', 'text-ink', className)}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      {children}
    </dialog>
  )
}
