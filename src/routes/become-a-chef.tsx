import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/become-a-chef')({
  beforeLoad: () => {
    throw redirect({
      to: '/sign-in',
      search: { intent: 'chef' },
    })
  },
  component: () => null,
})
