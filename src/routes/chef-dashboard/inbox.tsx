import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import PortalEmptyState, { PortalError } from '../../components/portal/PortalEmptyState'
import { useChefPortal } from '../../components/portal/ChefPortalProvider'
import { matchesQuery, money, statusLabel, statusTone } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/inbox')({
  component: ChefInboxPage,
})

function ChefInboxPage() {
  const { data, error, busyId, sendQuote } = useChefPortal()
  const search = ChefDashboardRoute.useSearch()
  const [quoteDrafts, setQuoteDrafts] = useState<Record<string, string>>({})

  const inquiries = data.inquiries.filter((inquiry) => {
    if (search.status === 'new' && inquiry.status !== 'new') return false
    if (search.status === 'quoted' && inquiry.status !== 'quoted') return false
    return matchesQuery(
      `${inquiry.customerName} ${inquiry.occasion} ${inquiry.location} ${inquiry.message}`,
      search.q,
    )
  })

  return (
    <>
      <PortalError message={error} />
      {inquiries.length === 0 ? (
        <PortalEmptyState copy="Direct requests from your public profile will appear here." />
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="portal-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-heading text-xl tracking-tight">{inquiry.customerName}</p>
                  <p className="mt-1 text-sm text-portal-muted">
                    {inquiry.occasion} · {inquiry.guestCount} guests · {inquiry.eventDate || 'Date TBC'}
                  </p>
                </div>
                <span className={`portal-chip ${statusTone(inquiry.status)}`}>
                  {statusLabel(inquiry.status)}
                </span>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-portal-muted">
                <MapPin size={14} aria-hidden="true" /> {inquiry.location}
              </p>
              {inquiry.message ? (
                <p className="mt-4 text-sm leading-relaxed text-portal-muted">{inquiry.message}</p>
              ) : null}
              <p className="mt-3 text-sm">Budget: {inquiry.budget || 'Not specified'}</p>
              {inquiry.status !== 'quoted' ? (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <input
                    inputMode="numeric"
                    value={quoteDrafts[inquiry.id] ?? ''}
                    onChange={(event) =>
                      setQuoteDrafts((current) => ({ ...current, [inquiry.id]: event.target.value }))
                    }
                    placeholder="Quote amount in GHS"
                    className="field flex-1"
                  />
                  <button
                    type="button"
                    className="btn btn-primary min-h-11 px-5"
                    disabled={busyId === inquiry.id}
                    onClick={() => void sendQuote(inquiry.id, Number.parseInt(quoteDrafts[inquiry.id] ?? '', 10))}
                  >
                    Send quote
                  </button>
                </div>
              ) : (
                <p className="mt-5 font-heading text-xl">
                  Quote sent: {money(inquiry.quotedPrice ?? 0, inquiry.currency)}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
