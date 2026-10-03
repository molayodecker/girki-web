import { Link, createFileRoute } from '@tanstack/react-router'
import { getChef } from '../../data/marketplace'
import PortalEmptyState, { PortalError } from '../../components/portal/PortalEmptyState'
import { matchesQuery, money, statusLabel, statusTone } from '../../components/portal/format'
import { useCustomerPortal } from '../../components/portal/CustomerPortalProvider'
import { Route as AccountRoute } from './route'

export const Route = createFileRoute('/account/requests')({
  component: AccountRequestsPage,
})

function AccountRequestsPage() {
  const { data, error } = useCustomerPortal()
  const search = AccountRoute.useSearch()

  const requests = data.requests.filter((request) =>
    matchesQuery(`${request.occasion} ${request.city} ${request.cuisine} ${request.notes}`, search.q),
  )
  const inquiries = data.inquiries.filter((inquiry) =>
    matchesQuery(
      `${inquiry.occasion} ${inquiry.location} ${getChef(inquiry.chefId)?.name ?? inquiry.chefId}`,
      search.q,
    ),
  )

  if (requests.length === 0 && inquiries.length === 0) {
    return (
      <>
        <PortalError message={error} />
        <PortalEmptyState
          copy="Chef requests and direct inquiries will collect here."
          action={
            <Link to="/request" className="btn btn-primary">
              New request
            </Link>
          }
        />
      </>
    )
  }

  return (
    <>
      <PortalError message={error} />
      {requests.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
            Open requests
          </h2>
          {requests.map((request) => (
            <article key={request.id} className="portal-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl tracking-tight">{request.occasion}</p>
                  <p className="mt-1 text-sm text-portal-muted">
                    {request.city} · {request.guestSummary} · {request.eventDate || 'Date TBC'}
                  </p>
                </div>
                <span className={`portal-chip ${statusTone(request.status)}`}>
                  {statusLabel(request.status)}
                </span>
              </div>
              {request.notes ? (
                <p className="mt-4 text-sm leading-relaxed text-portal-muted">{request.notes}</p>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      {inquiries.length > 0 ? (
        <section className="mt-8 space-y-3">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
            Direct inquiries
          </h2>
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="portal-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl tracking-tight">
                    {getChef(inquiry.chefId)?.name ?? 'Girki chef'}
                  </p>
                  <p className="mt-1 text-sm text-portal-muted">
                    {inquiry.occasion} · {inquiry.guestCount} guests · {inquiry.eventDate || 'Date TBC'}
                  </p>
                </div>
                <span className={`portal-chip ${statusTone(inquiry.status)}`}>
                  {statusLabel(inquiry.status)}
                </span>
              </div>
              {inquiry.status === 'quoted' && inquiry.quotedPrice != null ? (
                <p className="mt-4 font-heading text-xl">
                  Quote: {money(inquiry.quotedPrice, inquiry.currency)}
                </p>
              ) : null}
              <Link
                to="/chefs/$chefId"
                params={{ chefId: inquiry.chefId }}
                className="mt-4 inline-flex text-sm underline underline-offset-4"
              >
                View chef
              </Link>
            </article>
          ))}
        </section>
      ) : null}
    </>
  )
}
