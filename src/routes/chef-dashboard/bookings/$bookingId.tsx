import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, Check, MessageCircle, RefreshCw, X } from 'lucide-react'
import { chefPortalDemo } from '../../../data/chef-portal-demo'
import { Route as ChefDashboardRoute } from '../route'

export const Route = createFileRoute('/chef-dashboard/bookings/$bookingId')({
  component: ChefBookingDetailPage,
})

function ChefBookingDetailPage() {
  const { bookingId } = Route.useParams()
  const search = ChefDashboardRoute.useSearch()
  const detail = chefPortalDemo.detail
  const row = chefPortalDemo.bookings.find((b) => b.id === bookingId)

  return (
    <div>
      <Link
        to="/chef-dashboard/bookings"
        search={search}
        className="inline-flex items-center gap-1.5 text-sm text-portal-muted hover:text-portal-text"
      >
        <ArrowLeft size={14} /> All bookings
      </Link>

      <div className="mt-5 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-portal-accent">
            {row ? `Request · ${row.id.toUpperCase()}` : detail.requestLabel}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {row?.guest ?? detail.guest}
          </h2>
          <p className="mt-2 text-sm text-portal-muted">
            {row
              ? `${row.date} · ${row.guests} guests · ${row.place}`
              : detail.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/chef-dashboard/messages"
            search={search}
            className="btn btn-outline min-h-10 px-4"
          >
            <MessageCircle size={15} /> Message
          </Link>
          <button type="button" className="btn btn-outline min-h-10 px-4">
            <X size={15} /> Decline
          </button>
          <button type="button" className="btn btn-primary min-h-10 px-4">
            <Check size={15} /> Confirm this table
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <section className="portal-card p-5">
            <h3 className="text-base font-semibold">The evening</h3>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {detail.facts.map((fact) => (
                <div key={fact.k}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
                    {fact.k}
                  </dt>
                  <dd className="mt-1.5 text-sm">{fact.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="portal-card p-5">
            <h3 className="text-base font-semibold">Notes from {detail.notes.from}</h3>
            <p className="mt-3 text-sm leading-relaxed text-portal-muted">{detail.notes.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.notes.tags.map((tag) => (
                <span key={tag} className="portal-chip bg-portal-accent/14 text-portal-accent">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section className="portal-card p-5">
            <h3 className="text-base font-semibold">Proposed menu · {detail.menuName}</h3>
            <ul className="mt-4 divide-y divide-portal-border">
              {detail.courses.map((course) => (
                <li
                  key={course.course}
                  className="flex flex-wrap items-baseline justify-between gap-2 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-portal-muted">
                      {course.course}
                    </p>
                    <p className="mt-1 text-sm">{course.dish}</p>
                  </div>
                  {course.note ? (
                    <p className="text-xs text-portal-muted">{course.note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
            <button type="button" className="btn btn-outline mt-4 min-h-9 px-3.5">
              <RefreshCw size={14} /> Swap a course
            </button>
          </section>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <section className="portal-card p-5">
            <h3 className="text-base font-semibold">What you'll be paid</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {detail.payoutLines.map((line) => (
                <li key={line.k} className="flex justify-between gap-3">
                  <span className="text-portal-muted">{line.k}</span>
                  <span className="font-medium tabular-nums">{line.v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-end justify-between border-t border-portal-border pt-4">
              <div>
                <p className="text-sm font-semibold">Your take</p>
                <p className="mt-1 text-xs text-portal-muted">{detail.takeNote}</p>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{detail.take}</p>
            </div>
          </section>

          <section className="portal-card p-5">
            <h3 className="text-base font-semibold">The guest</h3>
            <div className="mt-4 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-portal-accent/20 text-sm font-semibold text-portal-accent">
                {detail.guestCard.initials}
              </div>
              <div>
                <p className="font-medium">{detail.guestCard.name}</p>
                <p className="mt-1 text-sm text-portal-muted">{detail.guestCard.meta}</p>
                <p className="mt-2 text-sm text-portal-muted">{detail.guestCard.note}</p>
              </div>
            </div>
          </section>

          <section className="portal-card p-5">
            <h3 className="text-base font-semibold">Your day</h3>
            <p className="mt-3 text-sm text-portal-muted">{detail.dayCard.text}</p>
            <button type="button" className="btn btn-outline mt-4 min-h-9 px-3.5">
              <CalendarDays size={14} /> Calendar is free
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
