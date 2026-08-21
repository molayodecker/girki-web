import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import PageShell from '../../components/layout/PageShell'
import { ensureAuthProfileFn } from '../../lib/auth.functions'
import { establishChefPortalSessionFn } from '../../lib/marketplace.functions'
import { exchangeAuthCode, getSignupIntent, postAuthPath } from '../../lib/auth-client'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallbackPage,
})

function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    void (async () => {
      try {
        const url = window.location.href
        if (url.includes('code=') || url.includes('access_token=')) {
          await exchangeAuthCode(url)
        }
        await ensureAuthProfileFn({ data: {} })
        const intent = getSignupIntent()
        if (intent === 'chef-portal') {
          await establishChefPortalSessionFn()
        }
        await navigate({ to: postAuthPath(intent), replace: true })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in callback failed.')
      }
    })()
  }, [navigate])

  return (
    <PageShell>
      <main className="section-pad">
        <div className="mx-auto max-w-md">
          {error ? (
            <p className="text-ploy-accent-secondary">{error}</p>
          ) : (
            <p className="text-ploy-text-secondary">Finishing sign-in…</p>
          )}
        </div>
      </main>
    </PageShell>
  )
}
