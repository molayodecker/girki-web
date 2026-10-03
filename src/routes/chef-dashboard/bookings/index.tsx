import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Filter, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  chefPortalDemo,
  demoBookingStatusTone,
  type DemoBookingStatus,
} from '../../../data/chef-portal-demo'
import { matchesQuery } from '../../../components/portal/format'
import { Route as ChefDashboardRoute } from '../route'

export const Route = createFileRoute('/chef-dashboard/bookings/')({
  component: ChefBookingsPage,
})

type FilterKey = 'all' | 'pending' | 'confirmed' | 'past'

function matchesFilter(status: DemoBookingStatus, filter: FilterKey) {
  if (filter === 'all') return true
  if (filter === 'pending') return status === 'Pending'
  if (filter === 'confirmed') return status === 'Confirmed' || status === 'Tonight'
  return status === 'Completed'
}

function ChefBookingsPage() {
  const search = ChefDashboardRoute.useSearch()
  const [filter, setFilter] = useState<FilterKey>('all')
  const rows = chefPortalDemo.bookings

  const counts = useMemo(
    () => ({
      all: rows.length,
      pending: rows.filter((r) => r.status === 'Pending').length,
      confirmed: rows.filter((r) => r.status === 'Confirmed' || r.status === 'Tonight').length,
      past: rows.filter((r) => r.status === 'Completed').length,
    }),
    [rows],
  )

  const visible = rows.filter(
    (row) =>
      matchesFilter(row.status, filter) &&
      matchesQuery(`${row.guest} ${row.menu} ${row.place} ${row.status}`, search.q),
  )

  const chips: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: counts.all },
    { key: 'pending', label: 'Pending', count: counts.pending },
    { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
    { key: 'past', label: 'Past', count: counts.past },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {chips.map((chip) => {
          const active = filter === chip.key
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setFilter(chip.key)}
              className={
                active
                  ? 'portal-chip bg-portal-accent/16 text-portal-accent ring-1 ring-inset ring-portal-accent/40'
                  : 'portal-chip bg-white/5 text-portal-muted hover:bg-white/8'
              }
            >
              {chip.label} {chip.count}
            </button>
          )
        })}
        <button type="button" className="btn btn-outline ml-1 min-h-8 px-3 text-[0.65rem]">
          <Filter size={13} /> Filter
        </button>
        <button type="button" className="btn btn-outline ml-auto min-h-9 px-3.5">
          <Plus size={14} /> Add a private table
        </button>
      </div>

      <div className="portal-card mt-4 overflow-hidden">
        <div className="hidden grid-cols-[7rem_minmax(0,1.2fr)_minmax(0,1.15fr)_4rem_minmax(0,1fr)_6.25rem_6.5rem_1rem] gap-3 border-b border-portal-border px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted lg:grid">
          <span>Date</span>
          <span>Guest</span>
          <span>Menu</span>
          <span>Guests</span>
          <span>Location</span>
          <span>Fee</span>
          <span>Status</span>
          <span />
        </div>
        <ul>
          {visible.map((row) => (
            <li key={row.id} className="border-b border-portal-border last:border-0">
              <Link
                to="/chef-dashboard/bookings/$bookingId"
                params={{ bookingId: row.id }}
                search={search}
                className="grid grid-cols-1 items-center gap-2 px-5 py-3.5 transition hover:bg-white/[0.03] lg:grid-cols-[7rem_minmax(0,1.2fr)_minmax(0,1.15fr)_4rem_minmax(0,1fr)_6.25rem_6.5rem_1rem] lg:gap-3"
              >
                <span className="text-sm font-medium">{row.date}</span>
                <span className="truncate text-sm">{row.guest}</span>
                <span className="truncate text-sm text-portal-muted">{row.menu}</span>
                <span className="text-sm text-portal-muted">{row.guests}</span>
                <span className="truncate text-sm text-portal-muted">{row.place}</span>
                <span className="text-sm font-medium tabular-nums">{row.fee}</span>
                <span className={`portal-chip w-fit ${demoBookingStatusTone(row.status)}`}>
                  {row.status}
                </span>
                <ChevronRight size={16} className="justify-self-end text-portal-muted" />
              </Link>
            </li>
          ))}
          {visible.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-portal-muted">No bookings in this filter.</li>
          ) : null}
        </ul>
      </div>
    </div>
  )
}
