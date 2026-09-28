import { useState } from 'react'
import { site } from '@/lib/site'
import { subscribeNewsletter } from '@/services/newsletter'
import { cn } from '@/utils/cn'

export function NewsletterForm({ tone = 'light', layout = 'stack' }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const dark = tone === 'dark'
  const split = layout === 'split'

  async function onSubmit(event) {
    event.preventDefault()
    const result = await subscribeNewsletter(email)
    setError(!result.ok)
    if (result.ok) {
      setMessage("You're on the list.")
      setEmail('')
      return
    }
    if (result.code === 'offline') {
      setMessage(`We are not saving emails yet. Write to ${site.contactEmail} and we will add you.`)
      return
    }
    setMessage(result.message)
  }

  return (
    <form onSubmit={onSubmit} className={cn(split && 'md:grid md:grid-cols-[1fr_minmax(0,26rem)] md:items-end md:gap-10')}>
      <div>
        <p className={cn('text-[11px] uppercase tracking-[0.18em]', dark ? 'text-fog' : 'text-muted')}>The list</p>
        <p className={cn('mt-2 font-serif text-3xl md:text-4xl', dark ? 'text-paper' : 'text-ink')}>First look at the next drop.</p>
      </div>
      <div>
        <div className={cn('mt-4 flex gap-2', split && 'md:mt-0')}>
        <label className="sr-only" htmlFor={`newsletter-${tone}`}>
          Email
        </label>
        <input
          id={`newsletter-${tone}`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className={cn(
            'h-12 flex-1 border px-3 text-sm outline-none',
            dark ? 'border-white/20 bg-transparent text-paper placeholder:text-fog' : 'border-line bg-white',
          )}
        />
        <button type="submit" className={cn('h-12 px-4 text-[11px] uppercase tracking-[0.16em]', dark ? 'bg-straw text-ink' : 'bg-leaf text-paper')}>
          Join
        </button>
        </div>
        {message ? <p className={cn('mt-3 text-sm', error ? 'text-sale' : dark ? 'text-fog' : 'text-muted')}>{message}</p> : null}
      </div>
    </form>
  )
}
