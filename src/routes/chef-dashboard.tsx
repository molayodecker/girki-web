import { createFileRoute } from '@tanstack/react-router'
import ChefDashboard from '../components/ChefDashboard'
import PageShell from '../components/layout/PageShell'

export const Route = createFileRoute('/chef-dashboard')({
  component: ChefDashboardPage,
})

function ChefDashboardPage() {
  return (
    <PageShell tone="sand">
      <main>
        <ChefDashboard chefId="nana" />
      </main>
    </PageShell>
  )
}
