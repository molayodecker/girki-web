export const posthogKey = () => import.meta.env.VITE_POSTHOG_KEY?.trim() ?? ''

export const posthogHost = () => import.meta.env.VITE_POSTHOG_HOST?.trim().replace(/\/$/, '') ?? ''

export function posthogEnabled() {
  const key = posthogKey()
  const host = posthogHost()

  if (!key || !host) {
    if (import.meta.env.DEV) {
      const variable = key ? 'VITE_POSTHOG_HOST' : 'VITE_POSTHOG_KEY'
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
      )
    }

    return false
  }

  if (import.meta.env.PROD) return true
  return import.meta.env.VITE_POSTHOG_DEV === 'true'
}
