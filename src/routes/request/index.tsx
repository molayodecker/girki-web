import { createFileRoute } from '@tanstack/react-router'
import RequestWizard from '../../components/RequestWizard'
import PageShell from '../../components/layout/PageShell'
import { Route as RequestLayoutRoute } from './route'

export const Route = createFileRoute('/request/')({
  component: RequestPage,
})

function RequestPage() {
  const search = RequestLayoutRoute.useSearch()

  return (
    <PageShell>
      <main>
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
