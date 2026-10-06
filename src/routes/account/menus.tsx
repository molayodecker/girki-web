import { createFileRoute } from '@tanstack/react-router'
import PortalSectionPage from '../../components/portal/PortalSectionPage'

export const Route = createFileRoute('/account/menus')({
  component: () => (
    <PortalSectionPage copy="Menus chefs share for your table will appear here after you book." />
  ),
})
