import { useState } from 'react'
import PhoneContinueForm from './PhoneContinueForm'
import EmailAuthForm from './EmailAuthForm'
import type { EmailPasswordValues, SignupIntent } from '../../lib/validation/auth'
import {
  sendPhoneOtp,
  setSignupIntent,
  signInWithEmailPassword,
  signInWithGoogle,
  signUpWithEmailPassword,
} from '../../lib/auth-client'

export default function AuthLoginPanel({
  intent,
  phoneSubmitLabel = 'Continue',
  onPhoneContinue,
  onSessionReady,
  onEmailSignIn,
  onEmailSignUp,
}: {
  intent: SignupIntent
  phoneSubmitLabel?: string
  onPhoneContinue: () => Promise<void>
  onSessionReady: () => Promise<void>
  onEmailSignIn?: (values: EmailPasswordValues) => Promise<void>
  onEmailSignUp?: (values: EmailPasswordValues) => Promise<void>
}) {
  const [showEmail, setShowEmail] = useState(false)
  const [message, setMessage] = useState('')
  const [googleBusy, setGoogleBusy] = useState(false)
  const [altError, setAltError] = useState('')

  return (
    <div className="space-y-6">
      <PhoneContinueForm
        submitLabel={phoneSubmitLabel}
        onSubmit={async ({ phone }) => {
          setSignupIntent(intent)
          await sendPhoneOtp(phone)
          await onPhoneContinue()
        }}
      />

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-ploy-text-secondary">
        <span className="h-px flex-1 bg-ploy-border-primary" />
        or
        <span className="h-px flex-1 bg-ploy-border-primary" />
      </div>

      <button
        type="button"
        className="btn btn-outline min-h-11 w-full gap-2"
        disabled={googleBusy}
        onClick={() => {
          setAltError('')
          setGoogleBusy(true)
          void signInWithGoogle(intent).catch((error) => {
            setGoogleBusy(false)
            setAltError(error instanceof Error ? error.message : 'Google sign-in failed.')
          })
        }}
      >
        <GoogleMark />
        {googleBusy ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <button
        type="button"
        className="w-full text-sm text-ploy-text-secondary underline-offset-4 hover:underline"
        onClick={() => {
          setShowEmail((open) => !open)
          setMessage('')
          setAltError('')
        }}
      >
        {showEmail ? 'Hide email & password' : 'Use email & password'}
      </button>

      {showEmail ? (
        <EmailAuthForm
          onSignIn={async (values) => {
            setSignupIntent(intent)
            setMessage('')
            if (onEmailSignIn) {
              await onEmailSignIn(values)
              return
            }
            await signInWithEmailPassword(values.email, values.password)
            await onSessionReady()
          }}
          onSignUp={async (values) => {
            setSignupIntent(intent)
            if (onEmailSignUp) {
              await onEmailSignUp(values)
              return
            }
            const data = await signUpWithEmailPassword(values.email, values.password)
            if (data.session) {
              await onSessionReady()
              return
            }
            setMessage('Check your email to confirm your account, then sign in.')
          }}
        />
      ) : null}

      {message ? <p className="text-sm text-ploy-text-secondary">{message}</p> : null}
      {altError ? <p className="text-sm text-ploy-accent-secondary">{altError}</p> : null}
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}
