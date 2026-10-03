import { createFileRoute } from '@tanstack/react-router'
import PortalSectionPage from '../../components/portal/PortalSectionPage'

export const Route = createFileRoute('/account/messages')({
  component: () => (
    <PortalSectionPage copy="Messages with your chef will land here once a booking is confirmed." />
  ),
})
