import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { usePageMeta } from '@/hooks/usePageMeta'
import { site } from '@/lib/site'

export default function ContactPage() {
  usePageMeta({ title: 'Contact', description: 'Write to Mental Fellow.', path: '/contact' })

  function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = data.get('name')
    const email = data.get('email')
    const message = data.get('message')
    const href = `mailto:${site.contactEmail}?subject=${encodeURIComponent(`Note from ${name}`)}&body=${encodeURIComponent(`${message}\n\n${name}\n${email}`)}`
    window.location.href = href
  }

  return (
    <Container className="max-w-xl py-12 md:py-16">
      <h1 className="font-serif text-5xl">Contact</h1>
      <p className="mt-3 text-muted">Orders, fit, and press. We read everything sent to {site.contactEmail}.</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <Input label="Name" name="name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
        <Textarea label="Message" name="message" required />
        <Button type="submit">Send</Button>
      </form>
    </Container>
  )
}
