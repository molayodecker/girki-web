import { Link, createFileRoute } from '@tanstack/react-router'
import { useCustomerPortal } from '../../components/portal/CustomerPortalProvider'
import { PortalError } from '../../components/portal/PortalEmptyState'

export const Route = createFileRoute('/account/profile')({
  component: AccountProfilePage,
})

function AccountProfilePage() {
  const { profile, error, signOut } = useCustomerPortal()

  return (
    <div>
      <PortalError message={error} />
      <article className="portal-card p-6 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-muted">Account</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{profile.displayName}</h2>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-portal-muted">Phone</dt>
            <dd className="mt-1">{profile.phone || 'Not added yet'}</dd>
          </div>
          <div>
            <dt className="text-portal-muted">Email</dt>
            <dd className="mt-1">{profile.email || 'Not added yet'}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/request" className="btn btn-primary">
            New booking
          </Link>
          <Link to="/chef-dashboard" search={{ when: 'all', status: 'all', q: '' }} className="btn btn-outline">
            Chef portal
          </Link>
          <button type="button" className="btn btn-outline" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </article>
    </div>
  )
}
