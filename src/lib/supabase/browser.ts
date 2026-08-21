import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.')
  }
  return createBrowserClient(url, anonKey)
}
