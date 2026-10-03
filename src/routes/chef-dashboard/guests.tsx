import { createFileRoute } from '@tanstack/react-router'
import { useChefPortal } from '../../components/portal/ChefPortalProvider'
import PortalEmptyState, { PortalError } from '../../components/portal/PortalEmptyState'
import { matchesQuery } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/guests')({
  component: ChefGuestsPage,
})

function ChefGuestsPage() {
  const { data, error } = useChefPortal()
  const search = ChefDashboardRoute.useSearch()
  const guests = [
    ...new Map(
      [
        ...data.bookings.map((booking) => ({
          name: booking.customerName,
          detail: booking.bookingNumber,
        })),
        ...data.inquiries.map((inquiry) => ({
          name: inquiry.customerName,
          detail: inquiry.occasion,
        })),
      ].map((guest) => [guest.name, guest]),
    ).values(),
  ].filter((guest) => matchesQuery(`${guest.name} ${guest.detail}`, search.q))

  if (guests.length === 0) {
    return (
      <>
        <PortalError message={error} />
        <PortalEmptyState copy="Guests from inquiries and bookings will collect here." />
      </>
    )
  }

  return (
    <>
      <PortalError message={error} />
      <div className="space-y-3">
        {guests.map((guest) => (
          <article
            key={guest.name}
            className="portal-card flex items-center justify-between gap-3 px-5 py-4"
          >
            <p className="font-heading text-xl tracking-tight">{guest.name}</p>
            <p className="text-sm text-portal-muted">{guest.detail}</p>
          </article>
        ))}
      </div>
    </>
  )
}
