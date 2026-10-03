import { Link, createFileRoute } from '@tanstack/react-router'
import { getChef } from '../../data/marketplace'
import PortalBookingCard from '../../components/portal/PortalBookingCard'
import PortalEmptyState, { PortalError } from '../../components/portal/PortalEmptyState'
import { bookingWhenMatches } from '../../components/portal/booking-range'
import { matchesQuery } from '../../components/portal/format'
import { useCustomerPortal } from '../../components/portal/CustomerPortalProvider'
import { Route as AccountRoute } from './route'

export const Route = createFileRoute('/account/bookings')({
  component: AccountBookingsPage,
})

function AccountBookingsPage() {
  const { data, error } = useCustomerPortal()
  const search = AccountRoute.useSearch()

  const bookings = data.bookings.filter((booking) => {
    if (!bookingWhenMatches(booking.eventDate, search.when)) return false
    const chefName = getChef(booking.chefId)?.name ?? booking.chefId
    return matchesQuery(
      `${chefName} ${booking.bookingNumber} ${booking.occasion} ${booking.location} ${booking.eventDate}`,
      search.q,
    )
  })

  return (
    <>
      <PortalError message={error} />
      {bookings.length === 0 ? (
        <PortalEmptyState
          copy="Book a private chef and your upcoming tables will show up here."
          action={
            <Link to="/request" className="btn btn-primary">
              Book a chef
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <PortalBookingCard
              key={booking.id}
              booking={booking}
              subtitle={getChef(booking.chefId)?.name ?? 'Girki chef'}
              amountLabel="Total"
              amount={booking.total}
            />
          ))}
        </div>
      )}
    </>
  )
}
