import { createSupabaseBrowserClient } from '../lib/supabase/browser'
import { normalizePhone } from '../lib/phone'
import {
  PENDING_PHONE_KEY,
  SIGNUP_INTENT_KEY,
  type SignupIntent,
} from '../lib/validation/auth'

export function setSignupIntent(intent: SignupIntent) {
  if (typeof window === 'undefined') return
  window.sessionStorage.setItem(SIGNUP_INTENT_KEY, intent)
}

export function getSignupIntent(): SignupIntent {
  if (typeof window === 'undefined') return 'customer'
  const value = window.sessionStorage.getItem(SIGNUP_INTENT_KEY)
  if (value === 'chef' || value === 'chef-portal') return value
  return 'customer'
}

export function clearSignupIntent() {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(SIGNUP_INTENT_KEY)
}

export function setPendingPhone(phone: string) {
  window.sessionStorage.setItem(PENDING_PHONE_KEY, phone)
}

export function getPendingPhone() {
  return window.sessionStorage.getItem(PENDING_PHONE_KEY) ?? ''
}

export function clearPendingPhone() {
  window.sessionStorage.removeItem(PENDING_PHONE_KEY)
}

export function postAuthPath(intent: SignupIntent = getSignupIntent()) {
  if (intent === 'chef') return '/chef/onboarding'
  if (intent === 'chef-portal') return '/chef-dashboard'
  return '/request'
}

export async function sendPhoneOtp(rawPhone: string) {
  const phone = normalizePhone(rawPhone)
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signInWithOtp({ phone })
  if (error) throw new Error(error.message)
  setPendingPhone(phone)
  return phone
}

export async function verifyPhoneOtp(rawPhone: string, token: string) {
  const phone = normalizePhone(rawPhone)
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })
  if (error) throw new Error(error.message)
  if (!data.session || !data.user) throw new Error('Verification failed. Try again.')
  return data
}

export async function signInWithOAuthProvider(
  provider: 'google' | 'facebook',
  intent: SignupIntent,
) {
  setSignupIntent(intent)
  const supabase = createSupabaseBrowserClient()
  const redirectTo = `${window.location.origin}/auth/callback`
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      ...(provider === 'google'
        ? { queryParams: { access_type: 'offline', prompt: 'consent' } }
        : {}),
    },
  })
  if (error) throw new Error(error.message)
}

export async function signInWithGoogle(intent: SignupIntent) {
  return signInWithOAuthProvider('google', intent)
}

export async function signInWithFacebook(intent: SignupIntent) {
  return signInWithOAuthProvider('facebook', intent)
}

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  if (!data.session || !data.user) throw new Error('Sign in failed. Try again.')
  return data
}

export async function signUpWithEmailPassword(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()
  const emailRedirectTo = `${window.location.origin}/auth/callback`
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  })
  if (error) throw new Error(error.message)
  return data
}

export async function exchangeAuthCode(url: string) {
  const supabase = createSupabaseBrowserClient()
  const parsed = new URL(url)
  const code = parsed.searchParams.get('code')
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) throw new Error(error.message)
    return data
  }
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  if (!data.session) throw new Error('No session returned from provider.')
  return data
}
