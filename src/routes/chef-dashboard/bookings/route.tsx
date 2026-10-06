import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chef-dashboard/bookings')({
  component: () => <Outlet />,
})
