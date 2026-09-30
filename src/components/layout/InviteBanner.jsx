import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

function Sparkles() {
  return (
    <svg viewBox="0 0 88 36" className="h-8 w-20 shrink-0 text-ink md:h-10 md:w-24" aria-hidden="true">
      <path fill="currentColor" d="M14 2.2 15.7 8.6 22 10.2 15.7 11.8 14 18.2 12.3 11.8 6 10.2 12.3 8.6z" />
      <path fill="currentColor" d="M46 6.5 48.4 15.4 57.4 17.8 48.4 20.2 46 29.1 43.6 20.2 34.6 17.8 43.6 15.4z" />
      <path fill="currentColor" d="M74 3.2 75.5 8.8 81.2 10.3 75.5 11.8 74 17.4 72.5 11.8 66.8 10.3 72.5 8.8z" />
    </svg>
  )
}

export function InviteBanner() {
  const auth = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  if (pathname.startsWith('/creators')) return null

  function openCashback() {
    if (!auth.ready) return
    if (auth.user) {
      navigate('/creators')
      return
    }
    navigate('/creators', { state: { login: true } })
  }

  return (
    <section className="bg-paper px-4 pt-8 pb-4 md:px-8 md:pt-12 md:pb-6" aria-label="Creator cashback">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-4 rounded-2xl bg-[#ffd500] px-5 py-6 md:gap-8 md:rounded-3xl md:px-10 md:py-8">
        <div className="min-w-0 max-w-2xl">
          <h2 className="text-[1.35rem] font-extrabold uppercase leading-[1.15] tracking-tight text-ink md:text-4xl">
            Share the piece. Earn <span className="text-[#0e9b00]">cashback</span>
          </h2>
          <p className="mt-2 max-w-md text-sm leading-snug text-ink md:text-lg">
            Buy it, post it after delivery, and cashback can be yours once the post is checked.
          </p>
          <button
            type="button"
            onClick={openCashback}
            className="mt-4 inline-flex cursor-pointer border-0 bg-[#0e9b00] px-4 py-2.5 text-sm font-semibold text-white shadow-[3px_3px_0_#161815] md:mt-5 md:px-5 md:py-3 md:text-base"
          >
            See how it works
          </button>
        </div>
        <Sparkles />
      </div>
    </section>
  )
}
