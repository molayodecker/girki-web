import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import CustomerPortalProvider, {
  useCustomerPortal,
} from '../../components/portal/CustomerPortalProvider'
import PortalShell from '../../components/portal/PortalShell'
import { formatLongDate, parseBookingWhen } from '../../components/portal/booking-range'

export type AccountSearch = {
  when: ReturnType<typeof parseBookingWhen>
  q: string
}

export const Route = createFileRoute('/account')({
  validateSearch: (search: Record<string, unknown>): AccountSearch => ({
    when: parseBookingWhen(search.when),
    q: typeof search.q === 'string' ? search.q : '',
  }),
  component: AccountLayout,
})

function AccountLayout() {
  return (
    <CustomerPortalProvider>
      <AccountChrome>
        <Outlet />
      </AccountChrome>
    </CustomerPortalProvider>
  )
}

function accountTitle(pathname: string) {
  if (pathname.includes('/bookings')) return 'Bookings'
  if (pathname.includes('/requests')) return 'Requests'
  if (pathname.includes('/menus')) return 'Menus'
  if (pathname.includes('/messages')) return 'Messages'
  if (pathname.includes('/payments')) return 'Payments'
  if (pathname.includes('/reviews')) return 'Reviews'
  if (pathname.includes('/settings')) return 'Settings'
  if (pathname.includes('/profile')) return 'Profile'
  return 'Today'
}

function AccountChrome({ children }: { children: ReactNode }) {
  const { profile, data, signOut } = useCustomerPortal()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/account' })
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isTodayPage = pathname === '/account' || pathname === '/account/'
  const sharedSearch = { when: search.when, q: search.q }
  const quoted = data.inquiries.filter((inquiry) => inquiry.status === 'quoted').length
  const upcomingCount = data.bookings.filter((booking) =>
    ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
  ).length
  const active = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

  return (
    <PortalShell
      title={accountTitle(pathname)}
      subtitle={isTodayPage ? formatLongDate() : undefined}
      brandLabel="Girki · table"
      userName={profile.displayName}
      userMeta={profile.phone || 'Guest'}
      notificationCount={quoted}
      searchPlaceholder="Search bookings, chefs, menus"
      searchValue={search.q}
      onSearchChange={(q) => {
        void navigate({ search: (prev) => ({ ...prev, q }) })
      }}
      onSignOut={() => void signOut()}
      railItems={[
        {
          to: '/account',
          search: sharedSearch,
          label: 'Today',
          icon: 'home',
          active: isTodayPage,
          mobile: true,
        },
        {
          to: '/account/bookings',
          search: sharedSearch,
          label: 'Bookings',
          icon: 'bookings',
          active: active('/account/bookings'),
          badge: upcomingCount,
          mobile: true,
        },
        {
          to: '/account/requests',
          search: sharedSearch,
          label: 'Requests',
          icon: 'requests',
          active: active('/account/requests'),
          badge: quoted,
          mobile: true,
        },
        {
          to: '/account/menus',
          search: sharedSearch,
          label: 'Menus',
          icon: 'menus',
          active: active('/account/menus'),
        },
        {
          to: '/account/messages',
          search: sharedSearch,
          label: 'Messages',
          icon: 'messages',
          active: active('/account/messages'),
          mobile: true,
        },
        {
          to: '/account/payments',
          search: sharedSearch,
          label: 'Payments',
          icon: 'payments',
          active: active('/account/payments'),
        },
        {
          to: '/account/reviews',
          search: sharedSearch,
          label: 'Reviews',
          icon: 'reviews',
          active: active('/account/reviews'),
        },
        {
          to: '/account/profile',
          search: sharedSearch,
          label: 'Profile',
          icon: 'profile',
          active: active('/account/profile'),
        },
        {
          to: '/account/settings',
          search: sharedSearch,
          label: 'Settings',
          icon: 'settings',
          active: active('/account/settings'),
          mobile: true,
        },
      ]}
    >
      {children}
    </PortalShell>
  )
}
