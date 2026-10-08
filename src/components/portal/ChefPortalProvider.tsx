import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import AuthLoginPanel from '../auth/AuthLoginPanel'
import { getChef } from '../../data/marketplace'
import { ensureAuthProfileFn } from '../../lib/auth.functions'
import {
  notifyPostHogIdentity,
  resetPostHogIdentity,
  signInWithEmailPassword,
  signUpWithEmailPassword,
} from '../../lib/auth-client'
import { createSupabaseBrowserClient } from '../../lib/supabase/browser'
import {
  chefLoginFn,
  chefLogoutFn,
  establishChefPortalSessionFn,
  getChefSessionFn,
  marketplaceRepository,
} from '../../lib/marketplace.functions'
import type {
  BookingStatus,
  ChefDashboardData,
  ChefRequestRecord,
  ChefSession,
} from '../../lib/marketplace/types'
import PageShell, { PageIntro } from '../layout/PageShell'
import { posthogLoggerInfo } from '../../lib/posthog-logs'

type ChefPortalContextValue = {
  session: ChefSession
  data: ChefDashboardData
  displayName: string
  chef: ReturnType<typeof getChef>
  error: string
  busyId: string
  refresh: () => Promise<void>
  sendQuote: (inquiryId: string, amount: number) => Promise<void>
  sendProposal: (request: ChefRequestRecord, amount: number) => Promise<void>
  moveBooking: (bookingId: string, status: BookingStatus) => Promise<void>
  signOut: () => Promise<void>
}

const ChefPortalContext = createContext<ChefPortalContextValue | null>(null)

export function useChefPortal() {
  const value = useContext(ChefPortalContext)
  if (!value) throw new Error('useChefPortal must be used within ChefPortalProvider.')
  return value
}

export default function ChefPortalProvider({ children }: { children: ReactNode }) {
  const posthog = usePostHog()
  const [session, setSession] = useState<ChefSession | null>(null)
  const [data, setData] = useState<ChefDashboardData | null>(null)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [portalError, setPortalError] = useState('')
  const [checking, setChecking] = useState(true)

  const chef = session ? getChef(session.slug) : undefined
  const displayName = chef?.name ?? session?.displayName ?? 'Chef'

  async function refresh() {
    setData(await marketplaceRepository.listChefDashboard())
  }

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const existing = await getChefSessionFn()
        if (cancelled) return
        if (existing) {
          notifyPostHogIdentity({
            distinctId: existing.chefId,
            email: existing.email,
            name: existing.displayName,
            role: 'chef',
          })
          setSession(existing)
          return
        }

        const supabase = createSupabaseBrowserClient()
        const { data: auth } = await supabase.auth.getSession()
        if (!auth.session) return

        const established = await establishChefPortalSessionFn()
        if (!cancelled) setSession(established)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : ''
        if (message && !message.toLowerCase().includes('unauthorized')) {
          setPortalError(message)
        }
      } finally {
        if (!cancelled) setChecking(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!session) {
      setData(null)
      return
    }
    void marketplaceRepository
      .listChefDashboard()
      .then(setData)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the chef dashboard.')
      })
  }, [session])

  const value = useMemo<ChefPortalContextValue | null>(() => {
    if (!session || !data) return null
    return {
      session,
      data,
      displayName,
      chef,
      error,
      busyId,
      refresh,
      sendQuote: async (inquiryId, amount) => {
        if (!Number.isFinite(amount) || amount <= 0) {
          setError('Enter a valid quote amount before sending.')
          return
        }
        setBusyId(inquiryId)
        setError('')
        try {
          await marketplaceRepository.quoteInquiry(inquiryId, amount)
          await refresh()
          const logAttributes = { quote_amount: amount, currency: 'GHS' }
          posthog.capture('chef_quote_sent', logAttributes)
          posthogLoggerInfo(posthog, 'chef_quote_sent', logAttributes)
        } catch (quoteError) {
          setError(quoteError instanceof Error ? quoteError.message : 'Unable to send quote.')
        } finally {
          setBusyId('')
        }
      },
      sendProposal: async (request, amount) => {
        if (!Number.isFinite(amount) || amount <= 0) {
          setError('Enter a valid quote amount before sending.')
          return
        }
        setBusyId(request.id)
        setError('')
        try {
          await marketplaceRepository.createProposal({
            requestId: request.id,
            message: `I can create a tailored ${request.cuisine || 'private chef'} experience for this request.`,
            proposedPrice: amount,
            menuDescription: 'Custom menu after customer confirmation',
            includedServices: ['Menu design', 'Grocery sourcing', 'Cooking', 'Kitchen cleanup'],
          })
          await refresh()
        } catch (proposalError) {
          setError(proposalError instanceof Error ? proposalError.message : 'Unable to send proposal.')
        } finally {
          setBusyId('')
        }
      },
      moveBooking: async (bookingId, status) => {
        setBusyId(bookingId)
        setError('')
        try {
          await marketplaceRepository.updateBookingStatus(bookingId, status)
          await refresh()
        } catch (bookingError) {
          setError(bookingError instanceof Error ? bookingError.message : 'Unable to update booking.')
        } finally {
          setBusyId('')
        }
      },
      signOut: async () => {
        await chefLogoutFn()
        try {
          await createSupabaseBrowserClient().auth.signOut()
        } catch {
          // Cookie clear is enough for portal access.
        }
        resetPostHogIdentity()
        setSession(null)
        setData(null)
      },
    }
  }, [busyId, chef, data, displayName, error, posthog, session])

  if (!session) {
    if (checking) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-ploy-background-primary text-ploy-text-secondary">
          Checking chef session…
        </div>
      )
    }
    return (
      <ChefLogin
        portalError={portalError || undefined}
        onSignedIn={(next) => {
          setPortalError('')
          setChecking(false)
          setSession(next)
        }}
      />
    )
  }

  if (!data || !value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ploy-background-primary text-ploy-text-secondary">
        {error || 'Loading chef portal…'}
      </div>
    )
  }

  return <ChefPortalContext.Provider value={value}>{children}</ChefPortalContext.Provider>
}

function ChefLogin({
  onSignedIn,
  portalError,
}: {
  onSignedIn: (session: ChefSession) => void
  portalError?: string
}) {
  const navigate = useNavigate()

  async function openPortalFromSupabase() {
    await ensureAuthProfileFn({ data: {} })
    const session = await establishChefPortalSessionFn()
    onSignedIn(session)
  }

  return (
    <PageShell tone="sand">
      <main className="section-pad">
        <div className="mx-auto max-w-md">
          <PageIntro
            eyebrow="Chef portal"
            title="Sign in to your kitchen"
            copy="Use your phone, Google, Facebook, or email. Access still requires an approved Girki chef profile."
          />
          {portalError ? (
            <p
              role="alert"
              className="mt-6 rounded-2xl border-2 border-ploy-accent-secondary bg-ploy-accent-secondary/10 px-4 py-3 text-sm text-ploy-text-primary"
            >
              {portalError}
            </p>
          ) : null}
          <div className="mt-10 rounded-[1.8rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6 sm:p-8">
            <AuthLoginPanel
              intent="chef-portal"
              phoneSubmitLabel="Continue to verification"
              onPhoneContinue={async () => {
                await navigate({ to: '/verify-phone' })
              }}
              onSessionReady={openPortalFromSupabase}
              onEmailSignIn={async ({ email, password }) => {
                try {
                  await signInWithEmailPassword(email, password)
                  await openPortalFromSupabase()
                } catch {
                  const session = await chefLoginFn({ data: { email, password } })
                  notifyPostHogIdentity({
                    distinctId: session.chefId,
                    email: session.email,
                    name: session.displayName,
                    role: 'chef',
                  })
                  onSignedIn(session)
                }
              }}
              onEmailSignUp={async ({ email, password }) => {
                const result = await signUpWithEmailPassword(email, password)
                if (!result.session) {
                  throw new Error('Check your email to confirm your account, then sign in.')
                }
                await openPortalFromSupabase()
              }}
            />
            <p className="mt-6 text-sm leading-relaxed text-ploy-text-secondary">
              By continuing you agree to Girki’s terms. SMS rates may apply for phone codes.
            </p>
            <p className="mt-4 text-sm text-ploy-text-secondary">
              Not a chef yet?{' '}
              <Link to="/become-a-chef" className="underline underline-offset-4">
                Apply as a chef
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  )
}
