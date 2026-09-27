import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

export function Drawer({ open, onClose, title, side = 'right', children, label }) {
  const reduce = useReducedMotion()
  const closeRef = useRef(null)
  const hidden = side === 'right' ? '100%' : '-100%'

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close panel"
            className="fixed inset-0 z-50 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={label || title}
            className={cn(
              'fixed top-0 z-50 flex h-dvh w-full flex-col bg-paper md:w-[min(100%,440px)]',
              side === 'right' ? 'right-0' : 'left-0',
            )}
            initial={reduce ? false : { x: hidden }}
            animate={{ x: 0 }}
            exit={reduce ? undefined : { x: hidden }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-[11px] uppercase tracking-[0.18em]">{title}</h2>
              <button ref={closeRef} type="button" className="grid h-11 w-11 place-items-center" onClick={onClose} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )
}
