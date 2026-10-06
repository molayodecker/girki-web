import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, ListChecks, MapPin, Navigation } from 'lucide-react'
import { useChefPortal } from '../../components/portal/ChefPortalProvider'
import { PortalError } from '../../components/portal/PortalEmptyState'
import { formatWeekCard, isThisWeekAfterToday, isToday } from '../../components/portal/booking-range'
import { compactMoney, hoursAgo, matchesQuery, money, statusLabel } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/')({
  component: ChefTodayPage,
})

function ChefTodayPage() {
  const { data, error, chef } = useChefPortal()
  const search = ChefDashboardRoute.useSearch()
  const upcoming = data.bookings.filter((booking) =>
    ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
  )
  const tonight = upcoming.find((booking) => isToday(booking.eventDate)) ?? upcoming[0]
  const waitingInquiries = data.inquiries.filter((inquiry) => inquiry.status === 'new')
  const waitingRequests = data.openRequests.filter(
    (request) => !data.proposals.some((proposal) => proposal.requestId === request.id),
  )
  const waitingCount = waitingInquiries.length + waitingRequests.length
  const oldestWaiting = [...waitingInquiries, ...waitingRequests].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )[0]
  const later = upcoming.filter((booking) => isThisWeekAfterToday(booking.eventDate))
  const monthLabel = new Date().toLocaleDateString('en-GB', { month: 'long' }).toUpperCase()
  const q = search.q

  const waitingRows = [
    ...waitingInquiries.map((inquiry) => ({
      id: inquiry.id,
      kind: 'inbox' as const,
      name: inquiry.customerName,
      badge: inquiry.occasion.toLowerCase().includes('birthday') ? 'Birthday' : 'New',
      when: inquiry.eventDate ? formatWeekCard(inquiry.eventDate) : 'Date TBC',
      place: inquiry.location,
      menu: inquiry.occasion,
      take: inquiry.budget || undefined,
    })),
    ...waitingRequests.map((request) => ({
      id: request.id,
      kind: 'requests' as const,
      name: request.customerName,
      badge: request.occasion.toLowerCase().includes('birthday') ? 'Birthday' : 'New',
      when: `${request.eventDate ? formatWeekCard(request.eventDate) : 'Date TBC'}${request.mealTime ? ` · ${request.mealTime}` : ''}`,
      place: request.city,
      menu: request.cuisine || request.occasion,
      take: request.budget || undefined,
    })),
  ].filter((row) => matchesQuery(`${row.name} ${row.menu} ${row.place}`, q))

  return (
    <>
      <PortalError message={error} />
      <div className="grid gap-4 xl:grid-cols-12">
        <article className="portal-card p-5 xl:col-span-6">
          {tonight ? (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">
                {isToday(tonight.eventDate) ? 'Tonight' : tonight.eventDate} · dinner
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{tonight.customerName}</h2>
              <p className="mt-2 text-sm text-portal-muted">
                {tonight.occasion} · {tonight.guestSummary}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-portal-muted">
                <MapPin size={14} /> {tonight.location}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  to="/chef-dashboard/menus"
                  search={search}
                  className="btn btn-outline min-h-10 px-4"
                >
                  <ListChecks size={15} /> Prep list
                </Link>
                {tonight.location ? (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(tonight.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline min-h-10 px-4"
                  >
                    <Navigation size={15} /> Directions
                  </a>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">Tonight</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">No dinner booked</h2>
              <p className="mt-2 text-sm text-portal-muted">Open requests and inquiries still show below.</p>
              {chef ? (
                <Link
                  to="/chefs/$chefId"
                  params={{ chefId: chef.id }}
                  className="btn btn-primary mt-5 min-h-10 px-4"
                >
                  View profile
                </Link>
              ) : null}
            </>
          )}
        </article>

        <Link to="/chef-dashboard/inbox" search={search} className="portal-card p-5 xl:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">
            Waiting on you
          </p>
          <p className="mt-4 font-heading text-5xl tracking-tight">{waitingCount}</p>
          <p className="mt-4 text-sm text-portal-muted">
            {oldestWaiting
              ? `Oldest request sent ${hoursAgo(oldestWaiting.createdAt)}`
              : 'You are clear for now'}
          </p>
        </Link>

        <Link to="/chef-dashboard/earnings" search={search} className="portal-card p-5 xl:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">
            {monthLabel} earnings
          </p>
          <p className="mt-4 font-heading text-4xl tracking-tight sm:text-5xl">
            {compactMoney(data.revenue.available + data.revenue.pending, data.revenue.currency)}
          </p>
          <p className="mt-4 text-sm text-portal-muted">
            {money(data.revenue.available, data.revenue.currency)} cleared
          </p>
        </Link>
      </div>

      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight">Requests waiting on you</h2>
          <p className="mt-1 text-sm text-portal-muted">
            Guests see a reply time on your profile. Answer within 24 hours to keep it.
          </p>
        </div>
        {waitingRows.length === 0 ? (
          <div className="portal-card px-5 py-8 text-sm text-portal-muted">No open requests right now.</div>
        ) : (
          <div className="space-y-3">
            {waitingRows.map((row) => (
              <article key={row.id} className="portal-card flex flex-col gap-4 p-4 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{row.name}</p>
                    <span className="portal-chip bg-portal-accent/15 text-portal-accent">{row.badge}</span>
                  </div>
                  <p className="mt-1 text-sm text-portal-muted">
                    {row.when} · {row.place} · {row.menu}
                  </p>
                </div>
                {row.take ? (
                  <p className="text-sm text-portal-muted">
                    <span className="font-medium text-portal-text">{row.take}</span> budget
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={row.kind === 'inbox' ? '/chef-dashboard/inbox' : '/chef-dashboard/opportunities'}
                    search={search}
                    className="btn btn-outline min-h-9 px-3"
                  >
                    Details
                  </Link>
                  <Link
                    to={row.kind === 'inbox' ? '/chef-dashboard/inbox' : '/chef-dashboard/opportunities'}
                    search={search}
                    className="btn btn-primary min-h-9 px-3"
                  >
                    <Check size={14} /> Confirm
                  </Link>
                </div>
              </article>
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
              <Link
                key={booking.id}
                to="/chef-dashboard/bookings"
                search={search}
                className="portal-card block p-4"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
                  {formatWeekCard(booking.eventDate)}
                </p>
                <p className="mt-3 font-medium">{booking.customerName}</p>
                <p className="mt-1 text-sm text-portal-muted">
                  {booking.guestSummary} · {booking.occasion}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-emerald-300">{statusLabel(booking.bookingStatus)}</span>
                  <span>{money(booking.chefPayout, booking.currency)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
