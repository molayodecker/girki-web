import { Link, createFileRoute } from '@tanstack/react-router'
import { getChef } from '../../data/marketplace'
import { useCustomerPortal } from '../../components/portal/CustomerPortalProvider'
import { PortalError } from '../../components/portal/PortalEmptyState'
import { formatWeekCard, isThisWeekAfterToday, isToday } from '../../components/portal/booking-range'
import { compactMoney, matchesQuery, money, statusLabel } from '../../components/portal/format'
import { Route as AccountRoute } from './route'

export const Route = createFileRoute('/account/')({
  component: AccountTodayPage,
})

function AccountTodayPage() {
  const { data, error } = useCustomerPortal()
  const search = AccountRoute.useSearch()
  const upcoming = data.bookings.filter((booking) =>
    ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
  )
  const next = upcoming.find((booking) => isToday(booking.eventDate)) ?? upcoming[0]
  const waiting = [
    ...data.inquiries.filter((inquiry) => inquiry.status === 'quoted'),
    ...data.requests.filter((request) => request.status === 'receiving_proposals' || request.status === 'open'),
  ]
  const later = upcoming.filter((booking) => isThisWeekAfterToday(booking.eventDate))
  const monthSpend = data.bookings.reduce((sum, booking) => sum + booking.total, 0)
  const q = search.q
  const waitingRows = waiting.filter((item) =>
    matchesQuery(`${item.occasion} ${item.status}`, q),
  )

  return (
    <>
      <PortalError message={error} />
      <div className="grid gap-4 xl:grid-cols-12">
        <article className="portal-card p-5 xl:col-span-6">
          {next ? (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">
                {isToday(next.eventDate) ? 'Tonight' : 'Next table'} · {next.eventDate}
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                {getChef(next.chefId)?.name ?? 'Girki chef'}
              </h2>
              <p className="mt-2 text-sm text-portal-muted">
                {next.occasion} · {next.guestSummary} · {next.location}
              </p>
              <Link to="/account/bookings" search={search} className="btn btn-primary mt-5 min-h-10 px-4">
                View booking
              </Link>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">Next table</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">No dinner booked</h2>
              <p className="mt-2 text-sm text-portal-muted">Request a chef and your table will appear here.</p>
              <Link to="/request" className="btn btn-primary mt-5 min-h-10 px-4">
                Book a chef
              </Link>
            </>
          )}
        </article>

        <Link to="/account/requests" search={search} className="portal-card p-5 xl:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">Waiting on chefs</p>
          <p className="mt-4 font-heading text-5xl tracking-tight">{waiting.length}</p>
          <p className="mt-4 text-sm text-portal-muted">Open requests and quotes</p>
        </Link>

        <div className="portal-card p-5 xl:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">
            {new Date().toLocaleDateString('en-GB', { month: 'long' }).toUpperCase()} spend
          </p>
          <p className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">
            {compactMoney(monthSpend, upcoming[0]?.currency ?? 'GHS')}
          </p>
          <p className="mt-4 text-sm text-portal-muted">{money(monthSpend, upcoming[0]?.currency ?? 'GHS')} booked</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Requests in play</h2>
        {waitingRows.length === 0 ? (
          <div className="portal-card px-5 py-8 text-sm text-portal-muted">No open requests right now.</div>
        ) : (
          <div className="space-y-3">
            {waitingRows.map((item) => (
              <Link
                key={item.id}
                to="/account/requests"
                search={search}
                className="portal-card block p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.occasion}</p>
                    <p className="mt-1 text-sm text-portal-muted">
                      {'city' in item ? item.city : item.location} · {item.eventDate || 'Date TBC'}
                    </p>
                  </div>
                  <span className="portal-chip bg-amber-300/12 text-amber-200">{statusLabel(item.status)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Later this week</h2>
        {later.length === 0 ? (
          <div className="portal-card px-5 py-8 text-sm text-portal-muted">Nothing else booked this week.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {later.map((booking) => (
              <article key={booking.id} className="portal-card p-4">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
                  {formatWeekCard(booking.eventDate)}
                </p>
                <p className="mt-3 font-medium">{getChef(booking.chefId)?.name ?? 'Girki chef'}</p>
                <p className="mt-1 text-sm text-portal-muted">{booking.occasion}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-emerald-300">{statusLabel(booking.bookingStatus)}</span>
                  <span>{money(booking.total, booking.currency)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
