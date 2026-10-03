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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${window.location.origin}/account` },
  })
  return {
    error: error?.message || null,
    needsConfirmation: !error && !data.session,
  }
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

export { isSupabaseConfigured }
