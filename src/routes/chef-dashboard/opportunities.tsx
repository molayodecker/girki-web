import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import PortalEmptyState, { PortalError } from '../../components/portal/PortalEmptyState'
import { useChefPortal } from '../../components/portal/ChefPortalProvider'
import { matchesQuery, money, statusLabel } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/opportunities')({
  component: ChefOpportunitiesPage,
})

function ChefOpportunitiesPage() {
  const { data, error, busyId, sendProposal } = useChefPortal()
  const search = ChefDashboardRoute.useSearch()
  const [quoteDrafts, setQuoteDrafts] = useState<Record<string, string>>({})

  const requests = data.openRequests.filter((request) =>
    matchesQuery(
      `${request.occasion} ${request.city} ${request.cuisine} ${request.notes} ${request.guestSummary}`,
      search.q,
    ),
  )

  return (
    <>
      <PortalError message={error} />
      {requests.length === 0 ? (
        <PortalEmptyState copy="Open chef requests matched to your market will appear here." />
      ) : (
        <div className="space-y-3">
          {requests.map((request) => {
            const existingProposal = data.proposals.find((proposal) => proposal.requestId === request.id)
            return (
              <article key={request.id} className="portal-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-xl tracking-tight">{request.occasion}</p>
                    <p className="mt-1 text-sm text-portal-muted">
                      {request.city} · {request.guestSummary} · {request.eventDate || 'Date TBC'}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{request.budget || 'Budget TBC'}</span>
                </div>
                {request.notes ? (
                  <p className="mt-4 text-sm leading-relaxed text-portal-muted">{request.notes}</p>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-portal-muted">
                  <span>{request.cuisine || 'Any cuisine'}</span>
                  <span>·</span>
                  <span>{request.serviceType}</span>
                  {request.mealTime ? (
                    <>
                      <span>·</span>
                      <span>{request.mealTime}</span>
                    </>
                  ) : null}
                </div>
                {existingProposal ? (
                  <p className="mt-5 flex items-center gap-2 text-sm">
                    Quote sent: {money(existingProposal.proposedPrice, existingProposal.currency)}
                    <ArrowRight size={14} aria-hidden="true" />
                    {statusLabel(existingProposal.status)}
                  </p>
                ) : (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <input
                      inputMode="numeric"
                      value={quoteDrafts[`request:${request.id}`] ?? ''}
                      onChange={(event) =>
                        setQuoteDrafts((current) => ({
                          ...current,
                          [`request:${request.id}`]: event.target.value,
                        }))
                      }
                      placeholder="Quote amount in GHS"
                      className="field flex-1"
                    />
                    <button
                      type="button"
                      className="btn btn-primary min-h-11 px-5"
                      disabled={busyId === request.id}
                      onClick={() =>
                        void sendProposal(
                          request,
                          Number.parseInt(quoteDrafts[`request:${request.id}`] ?? '', 10),
                        )
                      }
                    >
                      Send quote
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
