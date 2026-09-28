import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useUi } from '@/contexts/UiContext'
import { usePageMeta } from '@/hooks/usePageMeta'
import { site } from '@/lib/site'
import { sendPhoneOtp, signOut, updatePassword, verifyPhoneOtp } from '@/services/auth'

const fieldClass = 'h-12 w-full rounded-md border border-line bg-white px-4 text-sm outline-none placeholder:text-muted focus:border-leaf'

function CampaignPanel() {
  return (
    <div className="relative h-full min-h-80">
      <img
        src="/uploads/model6.png"
        alt="Two women in red, one in a black cap and one in sunglasses"
        className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/75 to-transparent px-8 pt-20 pb-8">
        <p className="max-w-sm font-serif text-3xl text-paper md:text-4xl">Rice straw, made into leather.</p>
      </div>
    </div>
  )
}

export function LoginModal() {
  const ui = useUi()
  return (
    <Modal open={ui.loginOpen} onClose={ui.close} label="Log in" className="w-[min(920px,calc(100%-2rem))] overflow-hidden rounded-2xl bg-white p-0">
      <LoginCard onClose={ui.close} />
    </Modal>
  )
}

export default function AccountPage({ mode = 'account' }) {
  usePageMeta({
    title: mode === 'password' ? 'New password' : 'Log in',
    description: 'Log in or create a Mental Fellow account.',
    path: mode === 'password' ? '/account/update-password' : '/login',
  })

  return (
    <section className="flex min-h-[calc(100svh-7.5rem)] items-center justify-center bg-paper-2 px-4 py-10">
      <LoginCard mode={mode} />
    </section>
  )
}

function LoginCard({ mode = 'account', onClose }) {
  const auth = useAuth()
  const toast = useToast()
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const phoneDigits = phone.replace(/\D/g, '').slice(0, 10)
  const phoneOk = phoneDigits.length === 10

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (mode === 'password') {
      const result = await updatePassword(password)
      if (result.error) {
        setError(result.error)
        return
      }
      setMessage('Password updated.')
      toast({ title: 'Password updated' })
      return
    }
    const result = await verifyPhoneOtp(`+91${phoneDigits}`, otp.trim())
    if (result.error) {
      setError(result.error)
      return
    }
    toast({ title: 'Signed in' })
    onClose?.()
  }

  async function continuePhone() {
    setError('')
    const result = await sendPhoneOtp(`+91${phoneDigits}`)
    if (result.error) {
      setError(result.error)
      return
    }
    setStep('otp')
  }

  return (
    <div className="grid w-full max-w-[920px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(22,24,21,0.14)] md:grid-cols-2">
      <CampaignPanel />
      <div className="relative flex items-center px-6 py-10 md:px-8">
        {onClose ? (
          <button type="button" className="absolute top-3 right-3 grid h-11 w-11 place-items-center" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        ) : null}
        <div className="w-full max-w-[420px]">
          {auth.user && mode !== 'password' ? (
            <SignedIn label={auth.user.phone || auth.user.email} error={error} onLogout={async () => {
              const result = await signOut()
              if (result.error) setError(result.error)
              else toast({ title: 'Signed out' })
            }} />
          ) : (
            <>
              <p className="font-serif text-3xl leading-none">{site.name}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted">{site.tagline}</p>
              <h1 className="mt-6 text-xl font-medium">{mode === 'password' ? 'New password' : 'Log in'}</h1>
              <p className="mt-1 text-sm text-muted">
                {mode === 'password'
                  ? 'Choose a new password for this account.'
                  : 'Enter your mobile number. We’ll send a code.'}
              </p>
              <form className="mt-6" onSubmit={submit}>
                {mode !== 'password' && step === 'phone' ? (
                  <label className="flex h-12 overflow-hidden rounded-md border border-line bg-white focus-within:border-leaf">
                    <span className="grid place-items-center border-r border-line px-3 text-sm text-muted">+91</span>
                    <input
                      className="min-w-0 flex-1 px-3 text-sm outline-none"
                      inputMode="numeric"
                      autoComplete="tel"
                      name="tel"
                      placeholder="Mobile number"
                      value={phoneDigits}
                      onChange={(event) => setPhone(event.target.value)}
                    />
                  </label>
                ) : null}
                {mode !== 'password' && step === 'phone' ? (
                  <button
                    type="button"
                    disabled={!phoneOk}
                    className="mt-4 h-12 w-full rounded-md bg-leaf text-[11px] font-medium uppercase tracking-[0.16em] text-paper disabled:bg-[#e4e0d8] disabled:text-muted"
                    onClick={continuePhone}
                  >
                    Continue
                  </button>
                ) : null}
                {mode !== 'password' && step === 'otp' ? (
                  <>
                    <p className="text-sm">+91 {phoneDigits}</p>
                    <input
                      className={`${fieldClass} mt-3`}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      name="one-time-code"
                      required
                      placeholder="6-digit code"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    />
                  </>
                ) : null}
                {mode === 'password' ? (
                  <input
                    className={fieldClass}
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                ) : null}
                {error ? <p className="mt-3 text-sm text-sale">{error}</p> : null}
                {message ? <p className="mt-3 text-sm text-success">{message}</p> : null}
                {mode === 'password' || step === 'otp' ? (
                  <Button type="submit" className="mt-4 w-full rounded-md">
                    {mode === 'password' ? 'Update password' : 'Verify'}
                  </Button>
                ) : null}
              </form>
              {mode !== 'password' && step === 'otp' ? (
                <button type="button" className="mt-4 text-sm underline" onClick={() => { setStep('phone'); setOtp('') }}>
                  Use a different number
                </button>
              ) : null}
              <p className="mt-8 text-xs leading-5 text-muted">
                By continuing, you agree to the{' '}
                <Link to="/terms" className="whitespace-nowrap text-leaf underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="whitespace-nowrap text-leaf underline">Privacy Policy</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function SignedIn({ label, error, onLogout }) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Account</p>
      <h1 className="mt-3 font-serif text-4xl">Hello</h1>
      <p className="mt-4 text-sm">{label}</p>
      <p className="mt-3 text-sm text-muted">Orders and saved details will live here once checkout is connected.</p>
      <Button className="mt-8 w-full rounded-md" onClick={onLogout}>Log out</Button>
      {error ? <p className="mt-4 text-sm text-sale">{error}</p> : null}
    </>
  )
}
