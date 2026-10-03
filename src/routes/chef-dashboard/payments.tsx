import { createFileRoute } from '@tanstack/react-router'
import PortalSectionPage from '../../components/portal/PortalSectionPage'

export const Route = createFileRoute('/chef-dashboard/payments')({
  component: () => (
    <PortalSectionPage copy="Payout timing and payment history will land here. Available balance is on Earnings." />
  ),
})
