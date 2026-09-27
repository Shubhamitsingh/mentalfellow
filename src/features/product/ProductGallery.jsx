import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

export function ProductGallery({ images, alt }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const safeIndex = Math.min(active, Math.max(images.length - 1, 0))
  const current = images[safeIndex]

  if (!current) return null

  return (
    <div className="min-w-0">
      <div className="hidden w-[560px] max-w-full items-start gap-3 md:grid md:grid-cols-[64px_minmax(0,1fr)]">
        <div className="scrollbar-thin flex max-h-[min(78vh,760px)] flex-col gap-2 overflow-y-auto">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg border-2 bg-paper-2 ${index === safeIndex ? 'border-leaf' : 'border-transparent'}`}
              onClick={() => setActive(index)}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="relative min-w-0">
          <button type="button" className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-paper-2" onClick={() => setZoom(true)} aria-label="Zoom image">
            <img src={current} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
          </button>
          {images.length > 1 ? (
            <button
              type="button"
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-sm"
              onClick={() => setActive((index) => (index + 1) % images.length)}
            >
              <ChevronRight size={18} />
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex snap-x snap-mandatory overflow-x-auto md:hidden">
        {images.map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={index === 0 ? alt : ''} className="aspect-[4/5] w-full shrink-0 snap-center rounded-xl bg-paper-2 object-cover" />
        ))}
      </div>
      <Modal open={zoom} onClose={() => setZoom(false)} label="Zoomed product image" className="w-fit max-w-[min(920px,calc(100%-2rem))] bg-transparent p-0">
        <button type="button" className="block" onClick={() => setZoom(false)}>
          <img src={current} alt={alt} className="block max-h-[85vh] max-w-[min(920px,calc(100vw-2rem))] rounded-xl" />
        </button>
      </Modal>
    </div>
  )
}
