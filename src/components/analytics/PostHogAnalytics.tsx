import { useEffect, useRef, useState, type ReactNode } from 'react'
import { getAuthProfileFn } from '../../lib/auth.functions'
import {
  POSTHOG_AUTH_IDENTIFIED_EVENT,
  POSTHOG_AUTH_RESET_EVENT,
  type PostHogIdentity,
} from '../../lib/auth-client'
import { posthogEnabled, posthogHost, posthogKey } from '../../lib/posthog'
import { createSupabaseBrowserClient } from '../../lib/supabase/browser'

export default function PostHogAnalytics({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<{
    client: import('posthog-js').PostHog
    Provider: typeof import('@posthog/react').PostHogProvider
    ErrorBoundary: typeof import('@posthog/react').PostHogErrorBoundary
    usePostHog: typeof import('@posthog/react').usePostHog
  } | null>(null)

  useEffect(() => {
    if (!posthogEnabled()) return

    void (async () => {
      const [{ default: posthog }, { PostHogErrorBoundary, PostHogProvider, usePostHog }] = await Promise.all([
        import('posthog-js'),
        import('@posthog/react'),
      ])

      posthog.init(posthogKey(), {
        api_host: posthogHost(),
        defaults: '2026-05-30',
        logs: {
          serviceName: 'girki-web',
          environment: import.meta.env.MODE,
        },
        person_profiles: 'identified_only',
        capture_exceptions: {
          capture_unhandled_errors: true,
          capture_unhandled_rejections: true,
          capture_console_errors: false,
        },
      })

      setBundle({
        client: posthog,
        Provider: PostHogProvider,
        ErrorBoundary: PostHogErrorBoundary,
        usePostHog,
      })
    })()
  }, [])

  if (!bundle) return children

  const { client, ErrorBoundary, Provider, usePostHog } = bundle
  return (
    <Provider client={client}>
      <PostHogIdentity usePostHog={usePostHog} />
      <ErrorBoundary
        fallback={<div role="alert">Something went wrong. Please refresh the page and try again.</div>}
      >
        {children}
      </ErrorBoundary>
    </Provider>
  )
}

function PostHogIdentity({
  usePostHog,
}: {
  usePostHog: typeof import('@posthog/react').usePostHog
}) {
  const posthog = usePostHog()
  const identifiedUserId = useRef<string | null>(null)
  const syncInProgress = useRef(false)
  const queuedFallbackIdentity = useRef<PostHogIdentity | undefined>(undefined)

  useEffect(() => {
    let active = true

    const identify = (distinctId: string, properties: Record<string, string>) => {
      if (identifiedUserId.current === distinctId) return
      if (identifiedUserId.current) posthog.reset()
      posthog.identify(distinctId, properties)
      identifiedUserId.current = distinctId
    }

    const syncIdentity = async (fallbackIdentity?: PostHogIdentity) => {
      if (syncInProgress.current) {
        if (fallbackIdentity) queuedFallbackIdentity.current = fallbackIdentity
        return
      }
      syncInProgress.current = true

      try {
        const auth = await getAuthProfileFn()
        if (!active) return

        if (auth) {
          const properties: Record<string, string> = {}
          if (auth.email) properties.email = auth.email
          if (auth.phone) properties.phone = auth.phone
          if (auth.profile?.displayName) properties.name = auth.profile.displayName
          if (auth.profile?.accountRole) properties.role = auth.profile.accountRole
          identify(auth.userId, properties)
          return
        }

        if (fallbackIdentity) {
          const properties: Record<string, string> = {}
          if (fallbackIdentity.email) properties.email = fallbackIdentity.email
          if (fallbackIdentity.name) properties.name = fallbackIdentity.name
          if (fallbackIdentity.role) properties.role = fallbackIdentity.role
          identify(fallbackIdentity.distinctId, properties)
        }
      } catch {
        if (active && fallbackIdentity) {
          const properties: Record<string, string> = {}
          if (fallbackIdentity.email) properties.email = fallbackIdentity.email
          if (fallbackIdentity.name) properties.name = fallbackIdentity.name
          if (fallbackIdentity.role) properties.role = fallbackIdentity.role
          identify(fallbackIdentity.distinctId, properties)
        }
      } finally {
        syncInProgress.current = false
        const queuedIdentity = queuedFallbackIdentity.current
        queuedFallbackIdentity.current = undefined
        if (queuedIdentity) void syncIdentity(queuedIdentity)
      }
    }

    const resetIdentity = () => {
      if (!identifiedUserId.current) return
      identifiedUserId.current = null
      posthog.reset()
    }

    const handleIdentified = (event: Event) => {
      void syncIdentity((event as CustomEvent<PostHogIdentity | undefined>).detail)
    }

    window.addEventListener(POSTHOG_AUTH_IDENTIFIED_EVENT, handleIdentified)
    window.addEventListener(POSTHOG_AUTH_RESET_EVENT, resetIdentity)
    void syncIdentity()

    let unsubscribe: (() => void) | undefined
    try {
      const supabase = createSupabaseBrowserClient()
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_OUT') {
          resetIdentity()
        } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          void syncIdentity()
        }
      })
      unsubscribe = data.subscription.unsubscribe
    } catch {
      // Public pages can run without Supabase browser configuration.
    }

    return () => {
      active = false
      window.removeEventListener(POSTHOG_AUTH_IDENTIFIED_EVENT, handleIdentified)
      window.removeEventListener(POSTHOG_AUTH_RESET_EVENT, resetIdentity)
      unsubscribe?.()
    }
  }, [posthog])

  return null
}
