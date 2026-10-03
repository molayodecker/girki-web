import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { chefPortalDemo } from '../../data/chef-portal-demo'

export const Route = createFileRoute('/chef-dashboard/calendar')({
  component: ChefCalendarPage,
})

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function ChefCalendarPage() {
  const { calendar } = chefPortalDemo
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - calendar.startOffset + 1
    if (day < 1 || day > calendar.daysInMonth) return null
    return day
  })

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <section className="portal-card p-5 xl:col-span-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{calendar.monthLabel}</h2>
          <div className="flex gap-1">
            <button type="button" className="btn btn-outline size-9 min-h-0 p-0" aria-label="Previous month">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="btn btn-outline size-9 min-h-0 p-0" aria-label="Next month">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="px-1 pb-2 text-center text-[11px] font-medium uppercase tracking-[0.12em] text-portal-muted"
            >
              {day}
            </div>
          ))}
          {cells.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="min-h-[4.5rem] rounded-xl opacity-25" />
            }
            const event = calendar.events[day]
            return (
              <div
                key={day}
                className={[
                  'flex min-h-[4.5rem] flex-col rounded-xl border border-portal-border p-2',
                  event?.pending ? 'bg-portal-accent/18' : event ? 'bg-white/[0.03]' : '',
                  event?.today ? 'ring-1 ring-inset ring-portal-accent' : '',
                ].join(' ')}
              >
                <span
                  className={`text-xs ${event?.today ? 'font-semibold text-portal-accent' : 'text-portal-muted'}`}
                >
                  {day}
                </span>
                {event ? (
                  <span
                    className={[
                      'portal-chip mt-auto w-fit max-w-full truncate px-1.5 text-[0.6rem]',
                      event.pending
                        ? 'bg-portal-accent/30 text-portal-accent'
                        : 'bg-white/10 text-portal-text',
                    ].join(' ')}
                  >
                    {event.label}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>

      <div className="space-y-4 xl:col-span-5">
        <section className="portal-card p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Standing availability</h3>
            <button type="button" className="text-sm text-portal-muted hover:text-portal-text">
              Edit
            </button>
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            {calendar.availability.map((slot) => (
              <li key={slot.day} className="flex items-center gap-3">
                <span className="w-10 text-portal-muted">{slot.day}</span>
                <span className="flex-1">{slot.hours}</span>
                <span
                  className={
                    slot.state === 'Off'
                      ? 'portal-chip bg-white/6 text-portal-muted'
                      : 'portal-chip bg-white/6 text-portal-muted ring-1 ring-inset ring-white/14'
                  }
                >
                  {slot.state}
                </span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-outline mt-5 min-h-9 px-3.5">
            Edit hours
          </button>
        </section>

        <section className="portal-card p-5">
          <h3 className="text-base font-semibold">Blocked out</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {calendar.blocked.map((block) => (
              <li key={block.when} className="flex justify-between gap-3">
                <span>{block.when}</span>
                <span className="text-portal-muted">{block.reason}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-outline mt-5 min-h-9 px-3.5">
            <Plus size={14} /> Block dates
          </button>
        </section>
      </div>
    </div>
  )
}
