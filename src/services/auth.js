import { isSupabaseConfigured, supabase } from '@/lib/supabase'

function unavailable() {
  return { error: 'Add your Supabase URL and anon key in .env.local to enable accounts.' }
}

export async function signIn(email, password) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return { error: error?.message || null }
}

export async function signUp(email, password) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/account` },
  })
  return { error: error?.message || null }
}

export async function signOut() {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.signOut()
  return { error: error?.message || null }
}

export async function sendPasswordReset(email) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/account/update-password`,
  })
  return { error: error?.message || null }
}

export async function updatePassword(password) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.updateUser({ password })
  return { error: error?.message || null }
}

export async function sendPhoneOtp(phone) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.signInWithOtp({ phone })
  return { error: error?.message || null }
}

export async function verifyPhoneOtp(phone, token) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
  return { error: error?.message || null }
}

export async function signInWithGoogle() {
  return signInWithProvider('google')
}

export async function signInWithFacebook() {
  return signInWithProvider('facebook')
}

async function signInWithProvider(provider) {
  if (!supabase) return unavailable()
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/account` },
  })
  return { error: error?.message || null }
}

export { isSupabaseConfigured }
