import { Outlet, createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import ChefPortalProvider, { useChefPortal } from '../../components/portal/ChefPortalProvider'
import PortalShell from '../../components/portal/PortalShell'
import { formatLongDate, isToday, parseBookingWhen } from '../../components/portal/booking-range'
import { chefPortalDemo } from '../../data/chef-portal-demo'

export type ChefPortalSearch = {
  when: ReturnType<typeof parseBookingWhen>
  status: 'new' | 'quoted' | 'all'
  q: string
}

export const Route = createFileRoute('/chef-dashboard')({
  validateSearch: (search: Record<string, unknown>): ChefPortalSearch => ({
    when: parseBookingWhen(search.when),
    status: search.status === 'new' || search.status === 'quoted' ? search.status : 'all',
    q: typeof search.q === 'string' ? search.q : '',
  }),
  component: ChefDashboardLayout,
})

function ChefDashboardLayout() {
  return (
    <ChefPortalProvider>
      <ChefPortalChrome>
        <Outlet />
      </ChefPortalChrome>
    </ChefPortalProvider>
  )
}

function chefPageMeta(pathname: string) {
  const bookingDetail = pathname.match(/\/chef-dashboard\/bookings\/([^/]+)/)
  if (bookingDetail) {
    const row = chefPortalDemo.bookings.find((b) => b.id === bookingDetail[1])
    return {
      title: 'Booking',
      subtitle: row
        ? `Request ${row.id.toUpperCase()} · ${row.guest}`
        : chefPortalDemo.titles.detail.subtitle,
    }
  }
  if (pathname.includes('/bookings')) return chefPortalDemo.titles.bookings
  if (pathname.includes('/calendar')) return chefPortalDemo.titles.calendar
  if (pathname.includes('/menus')) return chefPortalDemo.titles.menus
  if (pathname.includes('/messages') || pathname.includes('/inbox')) {
    return chefPortalDemo.titles.messages
  }
  if (pathname.includes('/earnings')) return chefPortalDemo.titles.earnings
  if (pathname.includes('/reviews')) return chefPortalDemo.titles.reviews
  if (pathname.includes('/settings')) return chefPortalDemo.titles.settings
  if (pathname.includes('/opportunities')) return { title: 'Requests', subtitle: undefined }
  if (pathname.includes('/proposals')) return { title: 'Proposals', subtitle: undefined }
  if (pathname.includes('/payments')) return { title: 'Payments', subtitle: undefined }
  if (pathname.includes('/guests')) return { title: 'Guests', subtitle: undefined }
  return { title: 'Today', subtitle: undefined as string | undefined }
}

function ChefPortalChrome({ children }: { children: ReactNode }) {
  const { data, displayName, chef, signOut } = useChefPortal()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/chef-dashboard' })
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const isTodayPage = pathname === '/chef-dashboard' || pathname === '/chef-dashboard/'
  const sharedSearch = { when: search.when, q: search.q, status: search.status }
  const dinnersTonight = data.bookings.filter(
    (booking) =>
      isToday(booking.eventDate) &&
      ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
  ).length
  const active = (path: string) => pathname === path || pathname.startsWith(`${path}/`)
  const page = chefPageMeta(pathname)
  const todaySubtitle =
    dinnersTonight === 1
      ? `${formatLongDate()} · one dinner tonight`
      : dinnersTonight > 1
        ? `${formatLongDate()} · ${dinnersTonight} dinners tonight`
        : formatLongDate()

  return (
    <PortalShell
      title={page.title}
      subtitle={isTodayPage ? todaySubtitle : page.subtitle}
      brandLabel="Girki · chef"
      userName={displayName || chefPortalDemo.settings.name}
      userMeta={chef ? `${chef.city} · Verified` : 'Accra · Verified'}
      notificationCount={chefPortalDemo.badges.messages}
      searchPlaceholder="Search bookings, guests, menus"
      searchValue={search.q}
      onSearchChange={(q) => {
        void navigate({ search: (prev) => ({ ...prev, q }) })
      }}
      onSignOut={() => void signOut()}
      railItems={[
        {
          to: '/chef-dashboard',
          search: sharedSearch,
          label: 'Today',
          icon: 'home',
          active: isTodayPage,
          mobile: true,
        },
        {
          to: '/chef-dashboard/bookings',
          search: sharedSearch,
          label: 'Bookings',
          icon: 'bookings',
          active: active('/chef-dashboard/bookings'),
          badge: chefPortalDemo.badges.bookings,
          mobile: true,
        },
        {
          to: '/chef-dashboard/calendar',
          search: sharedSearch,
          label: 'Calendar',
          icon: 'calendar',
          active: active('/chef-dashboard/calendar'),
        },
        {
          to: '/chef-dashboard/menus',
          search: sharedSearch,
          label: 'Menus',
          icon: 'menus',
          active: active('/chef-dashboard/menus'),
        },
        {
          to: '/chef-dashboard/messages',
          search: sharedSearch,
          label: 'Messages',
          icon: 'messages',
          active: active('/chef-dashboard/messages') || active('/chef-dashboard/inbox'),
          badge: chefPortalDemo.badges.messages,
          mobile: true,
        },
        {
          to: '/chef-dashboard/earnings',
          search: sharedSearch,
          label: 'Earnings',
          icon: 'earnings',
          active: active('/chef-dashboard/earnings'),
          mobile: true,
        },
        {
          to: '/chef-dashboard/reviews',
          search: sharedSearch,
          label: 'Reviews',
          icon: 'reviews',
          active: active('/chef-dashboard/reviews'),
        },
        {
          to: '/chef-dashboard/settings',
          search: sharedSearch,
          label: 'Settings',
          icon: 'settings',
          active: active('/chef-dashboard/settings'),
          mobile: true,
        },
      ]}
    >
      {children}
    </PortalShell>
  )
}
