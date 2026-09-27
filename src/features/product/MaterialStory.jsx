import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { materialBySlug, materialProcess, productTypeById } from '@/content/taxonomy'

export function MaterialStory({ product }) {
  const material = materialBySlug(product.material)
  const type = productTypeById(product.productType)
  const steps = product.story?.process || materialProcess
  const specs = (type?.attributes || [])
    .map(([key, label]) => ({ label, value: product.attributes?.[key] }))
    .filter((row) => row.value && !Array.isArray(row.value))

  return (
    <section className="border-y border-line bg-paper-2">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Material</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            {product.story?.summary || material?.summary || 'Material details are added with the product.'}
          </h2>
          <p className="mt-6 text-[11px] uppercase tracking-[0.16em] text-muted">Source</p>
          <p className="mt-2 text-lg">{material?.source || 'Not recorded'}</p>
          {material ? (
            <Link to={`/materials/${material.slug}`} className="mt-4 inline-block text-[11px] uppercase tracking-[0.14em] text-leaf underline underline-offset-4">
              View {material.name}
            </Link>
          ) : null}
          <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-muted">Process</p>
          <ol className="mt-3 space-y-2">
            {steps.map((step, index) => (
              <li key={step} className="text-sm">
                <span className="text-muted">{index + 1}</span> {step}
                {index < steps.length - 1 ? <span className="mt-2 block text-muted">↓</span> : null}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-muted">Impact</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed">
            {product.story?.impact ||
              'Verified sustainability figures appear here when the brand has them. This product does not carry an unmeasured environmental claim.'}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Details</p>
          {specs.length ? (
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {specs.map((row) => (
                <div key={row.label} className="flex justify-between gap-6 py-3 text-sm">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">Specifications are added when they apply to this product type.</p>
          )}
          {product.warranty ? <p className="mt-6 text-sm text-muted">{product.warranty}</p> : null}
        </div>
      </Container>
    </section>
  )
}
