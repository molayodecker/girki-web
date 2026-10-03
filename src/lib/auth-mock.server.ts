import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { isMockPhoneLoginEnabled } from './auth-mock'

const MOCK_COOKIE = 'girki_mock_auth'

export function issueMockAuth() {
  if (!isMockPhoneLoginEnabled()) {
    throw new Error('Mock phone login is disabled.')
  }
  setCookie(MOCK_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 14 * 24 * 60 * 60,
  })
}

export function readMockAuth() {
  if (!isMockPhoneLoginEnabled()) return false
  return getCookie(MOCK_COOKIE) === '1'
}

export function clearMockAuth() {
  deleteCookie(MOCK_COOKIE, { path: '/' })
}
