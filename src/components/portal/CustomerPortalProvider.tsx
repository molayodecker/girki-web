import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import AuthLoginPanel from '../auth/AuthLoginPanel'
import {
  ensureAuthProfileFn,
  getAuthProfileFn,
  signOutFn,
} from '../../lib/auth.functions'
import { resetPostHogIdentity } from '../../lib/auth-client'
import { createSupabaseBrowserClient } from '../../lib/supabase/browser'
import { marketplaceRepository } from '../../lib/marketplace.functions'
import type { CustomerDashboardData } from '../../lib/marketplace/types'
import PortalAuthScreen from './PortalAuthScreen'

export type CustomerProfile = {
  userId: string
  phone: string | null
  email: string | null
  displayName: string
}

type CustomerPortalContextValue = {
  profile: CustomerProfile
  data: CustomerDashboardData
  error: string
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const CustomerPortalContext = createContext<CustomerPortalContextValue | null>(null)

export function useCustomerPortal() {
  const value = useContext(CustomerPortalContext)
  if (!value) throw new Error('useCustomerPortal must be used within CustomerPortalProvider.')
  return value
}

export default function CustomerPortalProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [data, setData] = useState<CustomerDashboardData | null>(null)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  async function refresh() {
    setData(await marketplaceRepository.listCustomerDashboard())
  }

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const auth = await getAuthProfileFn()
        if (cancelled) return
        if (!auth) return
        setProfile({
          userId: auth.userId,
          phone: auth.phone,
          email: auth.email,
          displayName: auth.profile?.displayName || 'Guest',
        })
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load your account.')
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
    if (!profile) {
      setData(null)
      return
    }
    void marketplaceRepository
      .listCustomerDashboard()
      .then(setData)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load your bookings.')
      })
  }, [profile])

  const value = useMemo<CustomerPortalContextValue | null>(() => {
    if (!profile || !data) return null
    return {
      profile,
      data,
      error,
      refresh,
      signOut: async () => {
        await signOutFn()
        try {
          await createSupabaseBrowserClient().auth.signOut()
        } catch {
          // Cookie clear is enough.
        }
        resetPostHogIdentity()
        setProfile(null)
        setData(null)
      },
    }
  }, [data, error, profile])

  if (!profile) {
    if (checking) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-ploy-background-primary text-ploy-text-secondary">
          Checking your session…
        </div>
      )
    }
    return (
      <CustomerLogin
        onSignedIn={async () => {
          const auth = await getAuthProfileFn()
          if (!auth) return
          setProfile({
            userId: auth.userId,
            phone: auth.phone,
            email: auth.email,
            displayName: auth.profile?.displayName || 'Guest',
          })
        }}
      />
    )
  }

  if (!data || !value) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ploy-background-primary text-ploy-text-secondary">
        {error || 'Loading your table…'}
      </div>
    )
  }

  return <CustomerPortalContext.Provider value={value}>{children}</CustomerPortalContext.Provider>
}

function CustomerLogin({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const navigate = useNavigate()

  return (
    <PortalAuthScreen
      eyebrow="Guest portal"
      title="Welcome back to the table"
      copy="Sign in with your phone, Google, Facebook, or email to see bookings, requests, and quotes."
      footer={
        <p>
          Want to cook with Girki?{' '}
          <Link to="/sign-in" search={{ intent: 'chef' }}>
            Apply as a chef
          </Link>
        </p>
      }
    >
      <AuthLoginPanel
        intent="customer"
        phoneSubmitLabel="Continue to verification"
        onPhoneContinue={async () => {
          await navigate({ to: '/verify-phone' })
        }}
        onSessionReady={async () => {
          await ensureAuthProfileFn({ data: {} })
          await onSignedIn()
        }}
      />
    </PortalAuthScreen>
  )
}
