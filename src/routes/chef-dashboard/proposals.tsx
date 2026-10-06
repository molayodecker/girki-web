import { createFileRoute } from '@tanstack/react-router'
import { useChefPortal } from '../../components/portal/ChefPortalProvider'
import PortalEmptyState, { PortalError } from '../../components/portal/PortalEmptyState'
import { matchesQuery, money, statusLabel, statusTone } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/proposals')({
  component: ChefProposalsPage,
})

function ChefProposalsPage() {
  const { data, error } = useChefPortal()
  const search = ChefDashboardRoute.useSearch()
  const proposals = data.proposals.filter((proposal) =>
    matchesQuery(`${proposal.message} ${proposal.menuDescription} ${proposal.status}`, search.q),
  )

  if (proposals.length === 0) {
    return (
      <>
        <PortalError message={error} />
        <PortalEmptyState copy="Quotes you send on open requests will show up here." />
      </>
    )
  }

  return (
    <>
      <PortalError message={error} />
      <div className="space-y-3">
        {proposals.map((proposal) => (
          <article key={proposal.id} className="portal-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-heading text-xl tracking-tight">
                  {money(proposal.proposedPrice, proposal.currency)}
                </p>
                <p className="mt-1 text-sm text-portal-muted">
                  {proposal.menuDescription || 'Custom menu'}
                </p>
              </div>
              <span className={`portal-chip ${statusTone(proposal.status)}`}>
                {statusLabel(proposal.status)}
              </span>
            </div>
            {proposal.message ? (
              <p className="mt-4 text-sm leading-relaxed text-portal-muted">{proposal.message}</p>
            ) : null}
          </article>
        ))}
      </div>
    </>
  )
}
