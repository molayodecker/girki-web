import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import AuthLoginPanel from '../components/auth/AuthLoginPanel'
import PageShell, { PageIntro } from '../components/layout/PageShell'
import GirkiBorderStrip from '../components/patterns/GirkiBorderStrip'
import GirkiPatternBand from '../components/patterns/GirkiPatternBand'
import { ensureAuthProfileFn, getAuthProfileFn } from '../lib/auth.functions'
import { postAuthPath, setSignupIntent } from '../lib/auth-client'
import type { SignupIntent } from '../lib/validation/auth'

type SignInSearch = {
  intent?: SignupIntent
}

export const Route = createFileRoute('/sign-in')({
  validateSearch: (search: Record<string, unknown>): SignInSearch => {
    if (search.intent === 'chef') return { intent: 'chef' }
    if (search.intent === 'customer') return { intent: 'customer' }
    return {}
  },
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const intent: SignupIntent = search.intent === 'chef' ? 'chef' : 'customer'
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setSignupIntent(intent)
    void getAuthProfileFn()
      .then(async (profile) => {
        if (!profile) return
        await ensureAuthProfileFn({ data: {} })
        await navigate({ to: postAuthPath(intent) })
      })
      .finally(() => setChecking(false))
  }, [intent, navigate])

  const isChef = intent === 'chef'

  if (checking) {
    return (
      <PageShell tone={isChef ? 'sand' : undefined}>
        <main className="section-pad text-ploy-text-secondary">Checking your session…</main>
      </PageShell>
    )
  }

  return (
    <PageShell tone={isChef ? 'sand' : undefined}>
      <GirkiPatternBand pattern="flavor" height="sm" />
      <GirkiBorderStrip />
      <main className="section-pad">
        <div className="mx-auto max-w-md">
          <PageIntro
            eyebrow={isChef ? 'Become a Girki chef' : 'Continue with phone'}
            title={isChef ? 'Sign in to apply.' : 'Welcome to Girki.'}
            copy={
              isChef
                ? 'Enter your mobile number to start your chef application. You can also use Google, Facebook, or email. Roles stay server-controlled.'
                : 'Enter your mobile number. We’ll text a 6-digit code. No password required. Google, Facebook, and email are available if you prefer.'
            }
          />
          <div className="mt-10 rounded-[1.8rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6 sm:p-8">
            <AuthLoginPanel
              intent={intent}
              phoneSubmitLabel="Continue to verification"
              onPhoneContinue={async () => {
                await navigate({ to: '/verify-phone' })
              }}
              onSessionReady={async () => {
                await ensureAuthProfileFn({ data: {} })
                await navigate({ to: postAuthPath(intent) })
              }}
            />
            <p className="mt-6 text-sm leading-relaxed text-ploy-text-secondary">
              By continuing you agree to Girki’s terms. SMS rates may apply for phone codes.
            </p>
            {isChef ? (
              <p className="mt-4 text-sm text-ploy-text-secondary">
                Looking for a private chef?{' '}
                <Link to="/sign-in" search={{ intent: 'customer' }} className="underline underline-offset-4">
                  Sign in as a guest
                </Link>
              </p>
            ) : (
              <p className="mt-4 text-sm text-ploy-text-secondary">
                Want to cook with Girki?{' '}
                <Link to="/sign-in" search={{ intent: 'chef' }} className="underline underline-offset-4">
                  Apply as a chef
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
