import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useUi } from '@/contexts/UiContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { sendPasswordReset, signIn, signOut, signUp, updatePassword } from '@/services/auth'

const fieldClass = 'h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none placeholder:text-muted focus:border-[#0e9b00]'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CampaignPanel() {
  return (
    <div className="relative h-32 md:h-full md:min-h-80">
      <img
        src="/uploads/model1.png"
        alt="A woman in red holding a woven black shoulder bag"
        className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-5 pt-8 pb-3 md:px-8 md:pt-20 md:pb-8">
        <p className="max-w-sm font-serif text-xl text-paper md:text-4xl">Rice straw, made into leather.</p>
      </div>
    </div>
  )
}

export function LoginModal() {
  const ui = useUi()
  return (
    <Modal open={ui.loginOpen} onClose={ui.close} label="Log in" className="max-h-[calc(100dvh-1.5rem)] w-[min(20.5rem,calc(100%-3.5rem))] overflow-hidden rounded-3xl bg-white p-0 md:w-[min(680px,calc(100%-4rem))]">
      <LoginCard onClose={ui.close} />
    </Modal>
  )
}

export default function AccountPage({ mode = 'account' }) {
  usePageMeta({
    title: mode === 'password' ? 'New password' : 'Log in',
    description: 'Log in or create a Mental Fellow account with your email.',
    path: mode === 'password' ? '/account/update-password' : '/login',
  })

  return (
    <section className="flex min-h-[calc(100svh-7.5rem)] items-center justify-center bg-paper px-6 py-10">
      <LoginCard mode={mode} />
    </section>
  )
}

function LoginCard({ mode = 'account', onClose }) {
  const auth = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [view, setView] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function resetNotice() {
    setError('')
    setMessage('')
  }

  function show(next) {
    resetNotice()
    setPassword('')
    setConfirm('')
    setView(next)
  }

  async function submit(event) {
    event.preventDefault()
    resetNotice()
    const cleanEmail = email.trim().toLowerCase()

    if (mode === 'password') {
      if (password.length < 8) {
        setError('Use at least 8 characters.')
        return
      }
      setBusy(true)
      const result = await updatePassword(password)
      setBusy(false)
      if (result.error) {
        setError(accountError(result.error))
        return
      }
      setMessage('Password updated.')
      toast({ title: 'Password updated' })
      return
    }

    if (!emailPattern.test(cleanEmail)) {
      setError('Enter a valid email address.')
      return
    }

    if (view === 'reset') {
      setBusy(true)
      const result = await sendPasswordReset(cleanEmail)
      setBusy(false)
      if (result.error) setError(accountError(result.error))
      else setMessage('Check your email for a link to choose a new password.')
      return
    }

    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    if (view === 'signup' && password !== confirm) {
      setError('Those passwords do not match.')
      return
    }

    setBusy(true)
    const result = view === 'signup'
      ? await signUp(cleanEmail, password)
      : await signIn(cleanEmail, password)
    setBusy(false)
    if (result.error) {
      setError(accountError(result.error))
      return
    }
    if (result.needsConfirmation) {
      setMessage('Account created. Confirm it from the email we sent, then log in.')
      setView('login')
      setPassword('')
      setConfirm('')
      return
    }
    toast({ title: view === 'signup' ? 'Account created' : 'Signed in' })
    onClose?.()
  }

  function closeCard() {
    if (onClose) {
      onClose()
      return
    }
    const index = window.history.state?.idx
    if (typeof index === 'number' ? index > 0 : window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate('/')
  }

  const title = mode === 'password'
    ? 'New password'
    : view === 'signup'
      ? 'Create an account'
      : view === 'reset'
        ? 'Reset password'
        : 'Log in'
  const intro = mode === 'password'
    ? 'Choose a new password for this account.'
    : view === 'signup'
      ? 'Use your email and a password of at least 8 characters.'
      : view === 'reset'
        ? 'We’ll email you a link to choose a new password.'
        : 'Log in with the email and password for your account.'

  return (
    <div className="relative mx-auto grid w-full max-w-[20.5rem] overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(22,24,21,0.12)] md:max-w-[680px] md:grid-cols-2">
      <button
        type="button"
        className="absolute top-3 right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink text-white shadow-[0_2px_10px_rgba(22,24,21,0.28)]"
        onClick={closeCard}
        aria-label="Close"
      >
        <X size={18} />
      </button>
      <CampaignPanel />
      <div className="flex items-center px-5 py-4 md:px-8 md:py-10">
        <div className="w-full max-w-[420px]">
          {auth.user && mode !== 'password' ? (
            <SignedIn label={auth.user.email} error={error} onLogout={async () => {
              const result = await signOut()
              if (result.error) setError(result.error)
              else toast({ title: 'Signed out' })
            }} />
          ) : mode === 'password' && auth.ready && !auth.user ? (
            <>
              <h1 className="text-xl font-medium">Reset link required</h1>
              <p className="mt-1 text-sm text-muted">Open the link in your email, then choose a new password on this page.</p>
              <Link to="/login" className="mt-4 inline-block text-sm text-[#0e9b00]">Back to log in</Link>
            </>
          ) : (
            <>
              <h1 className="text-xl font-medium">{title}</h1>
              <p className="mt-1 text-sm text-muted">{intro}</p>
              <form className="mt-4 grid gap-3 md:mt-6" onSubmit={submit}>
                {mode !== 'password' ? (
                  <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                ) : null}
                {view !== 'reset' ? (
                  <input
                    className={fieldClass}
                    type="password"
                    name="password"
                    autoComplete={mode === 'password' || view === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={8}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                ) : null}
                {mode !== 'password' && view === 'signup' ? (
                  <input
                    className={fieldClass}
                    type="password"
                    name="confirm"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                  />
                ) : null}
                {error ? <p className="text-sm text-sale">{error}</p> : null}
                {message ? <p className="text-sm text-success">{message}</p> : null}
                <Button type="submit" variant="green" className="w-full rounded-xl" disabled={busy}>
                  {mode === 'password' ? 'Update password' : view === 'signup' ? 'Create account' : view === 'reset' ? 'Send reset link' : 'Log in'}
                </Button>
              </form>
              {mode !== 'password' ? (
                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  {view === 'login' ? (
                    <button type="button" className="text-[#0e9b00]" onClick={() => show('signup')}>
                      Create an account
                    </button>
                  ) : (
                    <button type="button" className="text-[#0e9b00]" onClick={() => show('login')}>
                      Log in
                    </button>
                  )}
                  {view === 'reset' ? null : (
                    <button type="button" className="text-ink" onClick={() => show('reset')}>
                      Forgot password
                    </button>
                  )}
                </div>
              ) : null}
              <p className="mt-4 text-xs leading-5 text-muted md:mt-8">
                By continuing, you agree to the{' '}
                <Link to="/terms" className="whitespace-nowrap text-[#0e9b00] underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="whitespace-nowrap text-[#0e9b00] underline">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function accountError(error) {
  if (String(error).includes('Supabase URL')) return 'Accounts open once the store database is connected.'
  return error
}

function SignedIn({ label, error, onLogout }) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Account</p>
      <h1 className="mt-3 font-serif text-4xl">Hello</h1>
      <p className="mt-4 break-all text-sm">{label}</p>
      <p className="mt-3 text-sm text-muted">Orders and saved details will live here once checkout is connected.</p>
      <Button variant="green" className="mt-8 w-full rounded-xl" onClick={onLogout}>Log out</Button>
      {error ? <p className="mt-4 text-sm text-sale">{error}</p> : null}
    </>
  )
}
