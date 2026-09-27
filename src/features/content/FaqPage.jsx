import { Container } from '@/components/ui/Container'
import { usePageMeta } from '@/hooks/usePageMeta'
import { faqs } from '@/content/pages'

export default function FaqPage() {
  usePageMeta({ title: 'FAQ', description: 'Shipping, sizing, exchanges, and reviews at Mental Fellow.', path: '/faq' })
  return (
    <Container className="max-w-3xl py-12 md:py-16">
      <h1 className="font-serif text-5xl">FAQ</h1>
      <div className="mt-8 divide-y divide-line border-y border-line">
        {faqs.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="cursor-pointer text-lg">{item.question}</summary>
            <p className="pt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </Container>
  )
}
