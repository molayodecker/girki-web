import { createFileRoute } from '@tanstack/react-router'
import PortalSectionPage from '../../components/portal/PortalSectionPage'

export const Route = createFileRoute('/account/reviews')({
  component: () => (
    <PortalSectionPage copy="After a dinner, you will be able to rate your chef from this page." />
  ),
})
