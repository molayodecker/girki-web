import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import AuthLoginPanel from '../auth/AuthLoginPanel'
import { getChef } from '../../data/marketplace'
import { ensureAuthProfileFn } from '../../lib/auth.functions'
import {
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
import PortalAuthScreen from './PortalAuthScreen'

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
        setSession(null)
        setData(null)
      },
    }
  }, [busyId, chef, data, displayName, error, session])

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
    <PortalAuthScreen
      eyebrow="Chef portal"
      title="Sign in to your kitchen"
      copy="Use your phone, Google, Facebook, or email. Access still requires an approved Girki chef profile."
      error={portalError}
      footer={
        <p>
          Not a chef yet?{' '}
          <Link to="/sign-in" search={{ intent: 'chef' }}>
            Apply as a chef
          </Link>
        </p>
      }
    >
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
    </PortalAuthScreen>
  )
}
