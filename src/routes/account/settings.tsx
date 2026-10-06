import { createFileRoute } from '@tanstack/react-router'
import PortalSectionPage from '../../components/portal/PortalSectionPage'

export const Route = createFileRoute('/account/settings')({
  component: () => (
    <PortalSectionPage copy="Notification and account preferences will live here." />
  ),
})
