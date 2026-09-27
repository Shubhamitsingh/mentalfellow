import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const reduce = useReducedMotion()

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (input) => {
      const item = {
        id: crypto.randomUUID(),
        title: input.title,
        message: input.message || '',
        tone: input.tone || 'default',
      }
      setToasts((current) => [...current, item].slice(-3))
      window.setTimeout(() => dismiss(item.id), 3400)
    },
    [dismiss],
  )

  const value = useMemo(() => toast, [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-20 right-4 left-4 z-[80] flex flex-col gap-2 md:left-auto md:w-80"
      >
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              role="status"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 8 }}
              className="pointer-events-auto border border-line bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium ${item.tone === 'error' ? 'text-sale' : 'text-ink'}`}>{item.title}</p>
                  {item.message ? <p className="mt-1 text-sm text-muted">{item.message}</p> : null}
                </div>
                <button type="button" className="text-xs uppercase tracking-[0.14em] text-muted" onClick={() => dismiss(item.id)}>
                  Close
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast must be used within ToastProvider')
  return toast
}
