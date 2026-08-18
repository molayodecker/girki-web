import { Link, createFileRoute } from '@tanstack/react-router'
import RequestWizard from '../../components/RequestWizard'
import PageShell from '../../components/layout/PageShell'
import { Route as RequestLayoutRoute } from './route'

export const Route = createFileRoute('/request/')({
  component: RequestPage,
})

function RequestPage() {
  const search = RequestLayoutRoute.useSearch()

  return (
    <PageShell tone="sand">
      <main className="section-pad">
        <div className="mx-auto mb-12 max-w-3xl">
          <p className="typography-eyebrow">Start a request</p>
          <p className="mt-5 text-sm text-ploy-text-secondary">
            We’ll ask for your location first so we can match chefs near you. Prefer to browse?{' '}
            <Link to="/chefs" className="text-ploy-text-primary underline decoration-ploy-accent-tertiary underline-offset-4">
              See chefs
            </Link>
          </p>
        </div>
        <RequestWizard
          initial={{
            city: search.city,
            date: search.date,
            guests: search.guests,
            cuisine: search.cuisine,
          }}
        />
      </main>
    </PageShell>
  )
}
