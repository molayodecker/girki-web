import type { ReactNode } from 'react'
import { MapPin } from 'lucide-react'
import type { Booking } from '../../lib/marketplace/types'
import { eventDateParts, money, statusLabel, statusTone } from './format'

export default function PortalBookingCard({
  booking,
  subtitle,
  amountLabel,
  amount,
  actions,
}: {
  booking: Booking
  subtitle: string
  amountLabel: string
  amount: number
  actions?: ReactNode
}) {
  const date = eventDateParts(booking.eventDate)

  return (
    <article className="portal-card p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-portal-bg">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-portal-muted">
            {date.month || 'TBC'}
          </span>
          <span className="font-heading text-xl leading-none tracking-tight">{date.day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-heading text-lg tracking-tight">{subtitle}</p>
              <p className="mt-0.5 text-sm text-portal-muted">{booking.bookingNumber}</p>
            </div>
            <span className={`portal-chip ${statusTone(booking.bookingStatus)}`}>
              {statusLabel(booking.bookingStatus)}
            </span>
          </div>
          <p className="mt-3 text-sm">{booking.occasion}</p>
          <p className="mt-1 text-sm text-portal-muted">{booking.guestSummary}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-portal-muted">
            <MapPin size={13} aria-hidden="true" /> {booking.location}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-portal-border pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.1em] text-portal-muted">{amountLabel}</p>
          <p className="mt-0.5 font-heading text-xl tracking-tight">{money(amount, booking.currency)}</p>
        </div>
        {actions}
      </div>
    </article>
  )
}
