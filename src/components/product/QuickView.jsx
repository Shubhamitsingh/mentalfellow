import { ProductPurchase } from '@/features/product/ProductPurchase'
import { Modal } from '@/components/ui/Modal'

export function QuickView({ product, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} label={`Quick view ${product.name}`} className="w-[min(880px,calc(100%-1.5rem))]">
      <div className="grid max-h-[85vh] overflow-y-auto md:grid-cols-2">
        <img src={product.colors[0]?.images[0]} alt={product.colors[0]?.alt || product.name} className="h-full max-h-[420px] w-full object-cover md:max-h-none" />
        <div className="p-5 md:p-6">
          <div className="mb-4 flex justify-end">
            <button type="button" className="text-[11px] uppercase tracking-[0.16em]" onClick={onClose}>
              Close
            </button>
          </div>
          <ProductPurchase product={product} mode="quick" onDone={onClose} />
        </div>
      </div>
    </Modal>
  )
}
