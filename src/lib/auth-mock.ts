export const MOCK_PHONE = '+233550000000'
export const MOCK_PHONE_DISPLAY = '+233 55 000 0000'
export const MOCK_OTP = '000000'
export const MOCK_DISPLAY_NAME = 'Ama Guest'
export const MOCK_EMAIL = 'mock.guest@girki.local'
export const MOCK_USER_ID = '00000000-0000-4000-a000-000000000001'

export const MOCK_CHEF_SESSION = {
  chefId: 'mock-chef',
  slug: 'nana',
  displayName: 'Mock Chef',
  email: 'mock.chef@girki.local',
} as const

function envFlag(value: unknown) {
  return value === 'true' || value === '1'
}

/** Dev-only phone bypass. Off in production unless ALLOW_MOCK_PHONE_LOGIN is set. */
export function isMockPhoneLoginEnabled() {
  try {
    if (import.meta.env.DEV) return true
    if (envFlag(import.meta.env.VITE_ALLOW_MOCK_PHONE_LOGIN)) return true
  } catch {
    // import.meta may be unavailable in some server contexts
  }
  if (typeof process !== 'undefined') {
    if (envFlag(process.env.ALLOW_MOCK_PHONE_LOGIN)) return true
    if (process.env.NODE_ENV !== 'production') return true
  }
  return false
}

export function isMockPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  const mockDigits = MOCK_PHONE.replace(/\D/g, '')
  return digits === mockDigits || digits === mockDigits.slice(3)
}

export function isMockOtp(token: string) {
  return token.trim() === MOCK_OTP
}
