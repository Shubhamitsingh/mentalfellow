import { Container } from '@/components/ui/Container'
import { EmptyState } from '@/components/ui/EmptyState'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function NotFoundPage() {
  usePageMeta({ title: 'Page not found', description: 'This Mental Fellow page does not exist.', path: '/404' })
  return (
    <Container>
      <EmptyState title="This page walked off." message="The link is old, or the piece is no longer here." action="Back home" href="/" />
    </Container>
  )
}
