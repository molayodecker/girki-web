import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import OtpVerifyForm from '../components/auth/OtpVerifyForm'
import PageShell, { PageIntro } from '../components/layout/PageShell'
import { syncPhoneProfileFn } from '../lib/auth.functions'
import {
  clearPendingPhone,
  getPendingPhone,
  getSignupIntent,
  sendPhoneOtp,
  verifyPhoneOtp,
} from '../lib/auth-client'

export const Route = createFileRoute('/verify-phone')({
  component: VerifyPhonePage,
})

function VerifyPhonePage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const pending = getPendingPhone()
    if (!pending) {
      void navigate({ to: '/sign-in' })
      return
    }
    setPhone(pending)
  }, [navigate])

  if (!phone) {
    return (
      <PageShell>
        <main className="section-pad">
          <p className="text-ploy-text-secondary">Preparing verification…</p>
        </main>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <main className="section-pad">
        <div className="mx-auto max-w-md">
          <PageIntro
            eyebrow="Verify"
            title="Enter the code we sent."
            copy={`Sent to ${phone}. Codes expire quickly — request a new one if needed.`}
          />
          <div className="mt-10 rounded-[1.8rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6 sm:p-8">
            <OtpVerifyForm
              onSubmit={async ({ otp }) => {
                await verifyPhoneOtp(phone, otp)
                await syncPhoneProfileFn({ data: { phone } })
                clearPendingPhone()
                const intent = getSignupIntent()
                if (intent === 'chef') {
                  await navigate({ to: '/chef/onboarding' })
                } else {
                  await navigate({ to: '/request' })
                }
              }}
              onResend={async () => {
                await sendPhoneOtp(phone)
                setMessage('A new code is on the way.')
              }}
            />
            {message ? <p className="mt-4 text-sm text-ploy-text-secondary">{message}</p> : null}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
