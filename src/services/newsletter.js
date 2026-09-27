import { isSupabaseConfigured, supabase } from '@/lib/supabase'

export async function subscribeNewsletter(email) {
  const clean = email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { ok: false, message: 'Enter a valid email address.' }
  }

  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      code: 'offline',
      message: 'The list opens once the store database is connected.',
    }
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({ email: clean })
  if (error) {
    if (error.code === '23505') return { ok: true }
    return { ok: false, message: 'Could not save that email. Try again in a moment.' }
  }

  return { ok: true }
}
