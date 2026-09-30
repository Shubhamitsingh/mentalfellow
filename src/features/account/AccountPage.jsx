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

const fieldClass = 'h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none placeholder:text-muted focus:border-[#0e9b00]'

function CampaignPanel() {
  return (
    <div className="relative h-32 md:h-full md:min-h-80">
      <img
        src="/uploads/model6.png"
        alt="Two women in red, one in a black cap and one in sunglasses"
        className="absolute inset-0 h-full w-full object-cover object-[center_22%] md:object-[center_18%]"
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
    description: 'Log in or create a Mental Fellow account.',
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
    <div className="mx-auto grid w-full max-w-[20.5rem] overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_rgba(22,24,21,0.12)] md:max-w-[680px] md:grid-cols-2">
      <CampaignPanel />
      <div className="relative flex items-center px-5 py-4 md:px-8 md:py-10">
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
              <p className="mt-1.5 text-[11px] uppercase tracking-[0.18em] text-muted">{site.tagline}</p>
              <h1 className="mt-4 text-xl font-medium md:mt-6">{mode === 'password' ? 'New password' : 'Log in'}</h1>
              <p className="mt-1 text-sm text-muted">
                {mode === 'password'
                  ? 'Choose a new password for this account.'
                  : 'Enter your mobile number. We’ll send a code.'}
              </p>
              <form className="mt-4 md:mt-6" onSubmit={submit}>
                {mode !== 'password' && step === 'phone' ? (
                  <label className="flex h-12 overflow-hidden rounded-xl border border-line bg-white focus-within:border-[#0e9b00]">
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
                    className="mt-4 h-12 w-full rounded-xl bg-[#0e9b00] text-[11px] font-medium uppercase tracking-[0.16em] text-white disabled:bg-[#d7e8d4] disabled:text-[#5f6b62]"
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
                  <Button type="submit" variant="green" className="mt-4 w-full rounded-xl">
                    {mode === 'password' ? 'Update password' : 'Verify'}
                  </Button>
                ) : null}
              </form>
              {mode !== 'password' && step === 'otp' ? (
                <button type="button" className="mt-4 text-sm underline" onClick={() => { setStep('phone'); setOtp('') }}>
                  Use a different number
                </button>
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

function SignedIn({ label, error, onLogout }) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Account</p>
      <h1 className="mt-3 font-serif text-4xl">Hello</h1>
      <p className="mt-4 text-sm">{label}</p>
      <p className="mt-3 text-sm text-muted">Orders and saved details will live here once checkout is connected.</p>
      <Button variant="green" className="mt-8 w-full rounded-xl" onClick={onLogout}>Log out</Button>
      {error ? <p className="mt-4 text-sm text-sale">{error}</p> : null}
    </>
  )
}
