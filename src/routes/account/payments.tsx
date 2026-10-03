import { createFileRoute } from '@tanstack/react-router'
import PortalSectionPage from '../../components/portal/PortalSectionPage'

export const Route = createFileRoute('/account/payments')({
  component: () => (
    <PortalSectionPage copy="Receipts and payment status for your dinners will show up here." />
  ),
})
