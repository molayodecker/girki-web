import { createServerClient } from '@supabase/ssr'
import { getCookie, getCookies, setCookie } from '@tanstack/react-start/server'

function supabaseUrl() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  if (!url) throw new Error('SUPABASE_URL / VITE_SUPABASE_URL is not configured.')
  return url
}

function supabaseAnonKey() {
  const key = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY
  if (!key) throw new Error('SUPABASE_ANON_KEY / VITE_SUPABASE_ANON_KEY is not configured.')
  return key
}

export function createSupabaseServerClient() {
  return createServerClient(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        const all = getCookies()
        return Object.entries(all).map(([name, value]) => ({ name, value }))
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, options)
        }
      },
    },
  })
}

export async function requireSupabaseUser() {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    throw new Error('Unauthorized. Sign in with your phone to continue.')
  }
  return { supabase, user: data.user }
}

/** Prefer getCookie for one-off reads without constructing a client. */
export function peekAuthCookie(name: string) {
  return getCookie(name)
}
