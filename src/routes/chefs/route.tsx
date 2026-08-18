import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chefs')({
  component: () => <Outlet />,
})
