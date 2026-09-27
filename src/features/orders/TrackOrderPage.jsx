import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function TrackOrderPage() {
  const [message, setMessage] = useState('')
  usePageMeta({ title: 'Track order', description: 'Track a Mental Fellow order.', path: '/track-order' })

  function onSubmit(event) {
    event.preventDefault()
    setMessage('Tracking opens when orders are connected. If you already have a confirmation, use the link in that email.')
  }

  return (
    <Container className="max-w-md py-16">
      <h1 className="font-serif text-5xl">Track an order</h1>
      <p className="mt-3 text-sm text-muted">Use the order number and the email from checkout. Courier data will come from the shipping provider, not a hardcoded carrier.</p>
      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        <Input label="Order number" name="order" required />
        <Input label="Email" name="email" type="email" required />
        <Button type="submit">Track</Button>
      </form>
      {message ? <p className="mt-4 text-sm">{message}</p> : null}
    </Container>
  )
}
