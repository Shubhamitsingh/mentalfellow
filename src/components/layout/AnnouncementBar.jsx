import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, MapPin, X } from 'lucide-react'
import { site } from '@/lib/site'
import { checkPincode, readDeliveryPin, saveDeliveryPin } from '@/services/shipping'

export function AnnouncementBar() {
  const saved = readDeliveryPin()
  const [open, setOpen] = useState(false)
  const [pin, setPin] = useState(saved?.pincode || '')
  const [place, setPlace] = useState(saved)
  const [error, setError] = useState('')
  const rootRef = useRef(null)
  const fieldId = useId()
  const panelId = useId()

  useEffect(() => {
    function sync() {
      const next = readDeliveryPin()
      setPlace(next)
      if (next?.pincode) setPin(next.pincode)
    }
    window.addEventListener('mf-delivery', sync)
    return () => window.removeEventListener('mf-delivery', sync)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  if (!site.announcement.enabled) return null

  function submit(event) {
    event.preventDefault()
    const result = checkPincode(pin)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setError('')
    setPlace(result)
    saveDeliveryPin(result)
    setOpen(false)
  }

  const placeLabel = place?.city ? `${place.pincode}, ${place.city}` : place?.pincode || 'Add pincode'

  return (
    <div className="relative z-50 bg-ink text-paper" ref={rootRef}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-3 px-4 py-2 md:gap-4 md:px-8">
        <p className="min-w-0 text-[12px] leading-snug sm:text-[13px]">
          {place?.city ? (
            <>
              In {place.city}, you can get delivery in <span className="font-medium text-[#ffd500]">24 hours</span>.
            </>
          ) : (
            <>
              In your city, delivery in <span className="font-medium text-[#ffd500]">24 hours</span>.
            </>
          )}
        </p>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ffd500] px-2.5 py-1 text-[12px] text-ink"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <MapPin size={13} aria-hidden="true" />
          <span className="max-w-[9.5rem] truncate">{placeLabel}</span>
          <ChevronDown size={14} aria-hidden="true" className={open ? 'rotate-180' : ''} />
        </button>
        <Link
          to="/shop"
          className="hidden shrink-0 text-[11px] uppercase tracking-[0.14em] text-paper/80 hover:text-paper sm:block"
        >
          Free shipping above ₹{site.freeShippingThreshold}
        </Link>
      </div>
      {open ? (
        <form
          id={panelId}
          className="absolute top-full left-1/2 z-50 mt-3 w-[min(22rem,calc(100%-2rem))] -translate-x-1/2 rounded-3xl bg-white p-5 text-ink shadow-[0_18px_40px_rgba(22,24,21,0.16)]"
          onSubmit={submit}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-medium">Where should we send it?</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Add your pincode for delivery in 24 hours. Orders of ₹{site.freeShippingThreshold} and above ship free.
              </p>
            </div>
            <button
              type="button"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              id={fieldId}
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={6}
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, '').slice(0, 6))
                setError('')
              }}
              placeholder="Pincode"
              aria-label="Pincode"
              aria-invalid={error ? 'true' : undefined}
              className={`h-12 min-w-0 flex-1 rounded-full border bg-white px-4 text-sm outline-none ${error ? 'border-sale' : 'border-line focus:border-ink'}`}
            />
            <button type="submit" className="h-12 shrink-0 rounded-full bg-[#ffd500] px-5 text-sm font-medium text-ink">
              Check
            </button>
          </div>
          {error ? <p className="mt-2 px-1 text-xs text-sale">{error}</p> : null}
          {place?.ok ? (
            <p className="mt-3 rounded-2xl bg-[#ffd500]/25 px-3 py-2 text-sm">
              {place.city ? `${place.city}. ` : ''}Delivery in 24 hours. Free shipping above ₹{site.freeShippingThreshold}.
            </p>
          ) : null}
          <Link to="/shop" className="mt-4 inline-block text-sm font-medium" onClick={() => setOpen(false)}>
            Shop the collection
          </Link>
        </form>
      ) : null}
    </div>
  )
}
