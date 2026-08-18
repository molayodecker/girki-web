import { Outlet, createFileRoute } from '@tanstack/react-router'

export type RequestSearch = {
  city?: string
  date?: string
  guests?: string
  cuisine?: string
}

export const Route = createFileRoute('/request')({
  validateSearch: (search: Record<string, unknown>): RequestSearch => ({
    city: typeof search.city === 'string' ? search.city : undefined,
    date: typeof search.date === 'string' ? search.date : undefined,
    guests: typeof search.guests === 'string' ? search.guests : undefined,
    cuisine: typeof search.cuisine === 'string' ? search.cuisine : undefined,
  }),
  component: () => <Outlet />,
})

