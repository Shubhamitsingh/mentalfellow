import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { site } from '@/lib/site'
import { useAuth } from '@/contexts/AuthContext'
import { useUi } from '@/contexts/UiContext'
import { subscribeNewsletter } from '@/services/newsletter'
import { readJson, writeJson } from '@/utils/storage'

const KEY = 'mf_welcome_v1'

export function WelcomePopup() {
  const auth = useAuth()
  const ui = useUi()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [birthday, setBirthday] = useState('')
  const [gender, setGender] = useState('')
  const [accepted, setAccepted] = useState(false)
  const hide = pathname.startsWith('/login') || pathname.startsWith('/account')

  useEffect(() => {
    if (!auth.ready || auth.user || hide || readJson(KEY, null)) return undefined
    const timer = window.setTimeout(() => setOpen(true), 700)
    return () => window.clearTimeout(timer)
  }, [auth.ready, auth.user, hide])

  useEffect(() => {
    if (ui.loginOpen) setOpen(false)
  }, [ui.loginOpen])

  function dismiss() {
    writeJson(KEY, { seen: true })
    setOpen(false)
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    const mobile = phone.replace(/\D/g, '')
    if (mobile && mobile.length !== 10) {
      setError('Enter a 10-digit mobile number, or leave it blank.')
      return
    }
    if (!accepted) {
      setError('Accept the Terms and Privacy Policy to continue.')
      return
    }
    writeJson(KEY, {
      seen: true,
      email: email.trim().toLowerCase(),
      phone: mobile ? `+91${mobile}` : '',
      birthday,
      gender,
    })
    await subscribeNewsletter(email)
    setDone(true)
  }

  return (
    <Modal open={open && !hide} onClose={dismiss} label="Welcome" className="w-[min(880px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-paper p-0">
      <div className="grid md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative flex min-h-64 flex-col bg-leaf px-8 py-10 text-paper md:min-h-[520px]">
          <div>
            <p className="font-serif text-3xl leading-none">{site.name}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-paper/80">{site.tagline}</p>
          </div>
          <div className="flex flex-1 items-center justify-center pb-16 md:pb-24">
            <p className="max-w-[17rem] text-center text-pretty font-serif text-3xl leading-tight md:text-4xl">
              Welcome. Register once, and the offers stay easy to find.
            </p>
          </div>
        </div>
        <div className="relative px-6 py-8 md:px-8">
          <button type="button" className="absolute top-3 right-3 grid h-11 w-11 place-items-center" onClick={dismiss} aria-label="Close">
            <X size={18} />
          </button>
          {done ? (
            <div className="flex min-h-80 flex-col justify-center">
              <h2 className="font-serif text-3xl">You’re in.</h2>
              <p className="mt-3 text-sm text-muted">Use WELCOME10 on bags of ₹799 or more. The code is checked again before payment.</p>
              <button type="button" className="mt-8 h-12 rounded-md bg-leaf text-[11px] font-medium uppercase tracking-[0.16em] text-paper" onClick={dismiss}>
                Start shopping
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2 className="pr-10 text-2xl font-medium leading-tight">A few details for your first visit</h2>
              <p className="mt-2 text-sm text-muted">We’ll keep the welcome offer and the next drop for this email.</p>
              <label className="mt-5 flex h-12 overflow-hidden rounded-md border border-line bg-white focus-within:border-leaf">
                <span className="grid place-items-center border-r border-line px-3 text-sm text-muted">+91</span>
                <input
                  className="min-w-0 flex-1 px-3 text-sm outline-none"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Mobile number"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
              <input
                className="mt-3 h-12 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-leaf"
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className="mt-3 h-12 w-full rounded-md border border-line bg-white px-3 text-sm outline-none focus:border-leaf"
                type="text"
                inputMode="numeric"
                placeholder="Birthday (DD-MM-YYYY)"
                value={birthday}
                onChange={(event) => setBirthday(event.target.value)}
              />
              <select
                className="mt-3 h-12 w-full rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-leaf"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="">Select your gender</option>
                <option value="woman">Woman</option>
                <option value="man">Man</option>
                <option value="unspecified">Prefer not to say</option>
              </select>
              <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted">
                <input type="checkbox" className="mt-1" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
                <span>
                  I accept the <Link to="/terms" className="text-leaf underline" onClick={dismiss}>Terms</Link> and{' '}
                  <Link to="/privacy" className="text-leaf underline" onClick={dismiss}>Privacy Policy</Link>.
                </span>
              </label>
              {error ? <p className="mt-3 text-sm text-sale">{error}</p> : null}
              <button type="submit" className="mt-4 h-12 w-full rounded-md bg-leaf text-[11px] font-medium uppercase tracking-[0.16em] text-paper">
                Submit
              </button>
              <p className="mt-4 text-center text-sm">
                <button
                  type="button"
                  className="text-muted underline"
                  onClick={() => {
                    dismiss()
                    ui.openLogin()
                  }}
                >
                  Already have an account? Log in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </Modal>
  )
}
