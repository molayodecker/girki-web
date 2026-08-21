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
  return value === 'chef' ? 'chef' : 'customer'
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
