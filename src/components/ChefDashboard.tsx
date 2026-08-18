import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Inbox,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react'
import { getChef } from '../data/marketplace'
import { marketplaceRepository } from '../lib/marketplace/mockRepository'
import type {
  BookingStatus,
  ChefDashboardData,
  ChefRequestRecord,
} from '../lib/marketplace/types'

function money(amount: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(amount)
}

function suggestedProposal(request: ChefRequestRecord) {
  if (request.budget.toLowerCase().includes('exclusive')) return 3200
  if (request.budget.toLowerCase().includes('gourmet')) return 2200
  return request.serviceType.toLowerCase().includes('weekly') ? 1400 : 1700
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ')
}

export default function ChefDashboard({ chefId }: { chefId: string }) {
  const chef = getChef(chefId)
  const [data, setData] = useState<ChefDashboardData | null>(null)
  const [quoteDrafts, setQuoteDrafts] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    setData(await marketplaceRepository.listChefDashboard(chefId))
  }

  useEffect(() => {
    void marketplaceRepository.listChefDashboard(chefId).then(setData)
  }, [chefId])

  if (!chef) return null
  if (!data) {
    return <div className="mx-auto max-w-7xl px-5 py-24 text-ploy-text-secondary">Loading chef dashboard…</div>
  }

  async function sendQuote(inquiryId: string) {
    const amount = Number.parseInt(quoteDrafts[inquiryId] ?? '', 10)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid quote amount before sending.')
      return
    }
    setBusyId(inquiryId)
    setError('')
    try {
      await marketplaceRepository.quoteInquiry(inquiryId, amount)
      await refresh()
    } catch (quoteError) {
      setError(quoteError instanceof Error ? quoteError.message : 'Unable to send quote.')
    } finally {
      setBusyId('')
    }
  }

  async function sendProposal(request: ChefRequestRecord) {
    setBusyId(request.id)
    setError('')
    try {
      await marketplaceRepository.createProposal({
        requestId: request.id,
        chefId,
        message: `I can create a tailored ${request.cuisine || 'private chef'} experience for this request.`,
        proposedPrice: suggestedProposal(request),
        currency: 'GHS',
        menuDescription: 'Custom menu after customer confirmation',
        includedServices: ['Menu design', 'Grocery sourcing', 'Cooking', 'Kitchen cleanup'],
      })
      await refresh()
    } catch (proposalError) {
      setError(proposalError instanceof Error ? proposalError.message : 'Unable to send proposal.')
    } finally {
      setBusyId('')
    }
  }

  async function moveBooking(bookingId: string, status: BookingStatus) {
    setBusyId(bookingId)
    setError('')
    try {
      await marketplaceRepository.updateBookingStatus(bookingId, status)
      await refresh()
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : 'Unable to update booking.')
    } finally {
      setBusyId('')
    }
  }

  const activeBookings = data.bookings.filter((booking) =>
    ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
  )
  const newInquiries = data.inquiries.filter((inquiry) => inquiry.status === 'new').length

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-6 border-b border-ploy-border-primary pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="typography-eyebrow">Chef portal · Demo mode</p>
          <h1 className="display-title mt-4 text-4xl sm:text-5xl">Welcome back, {chef.name}.</h1>
          <p className="mt-4 max-w-2xl text-ploy-text-secondary">
            Manage incoming inquiries, respond to open chef requests, move bookings through service,
            and track earnings. Data is stored locally until Supabase is connected.
          </p>
        </div>
        <a href={`/chefs/${chef.id}`} className="btn btn-outline min-h-11 px-5">
          View public profile
        </a>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Chef overview">
        {[
          { label: 'New inquiries', value: String(newInquiries), icon: Inbox },
          { label: 'Active bookings', value: String(activeBookings.length), icon: CalendarDays },
          { label: 'Open opportunities', value: String(data.openRequests.length), icon: UtensilsCrossed },
          { label: 'Pending earnings', value: money(data.revenue.pending), icon: CircleDollarSign },
        ].map((item) => (
          <article key={item.label} className="rounded-[1.6rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6">
            <item.icon size={20} className="text-ploy-accent-tertiary" aria-hidden="true" />
            <p className="mt-8 text-sm text-ploy-text-secondary">{item.label}</p>
            <p className="mt-2 font-heading text-3xl tracking-tight">{item.value}</p>
          </article>
        ))}
      </section>

      {error ? (
        <p className="mt-8 rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-5 py-4 text-sm text-ploy-accent-secondary">
          {error}
        </p>
      ) : null}

      <div className="mt-14 grid gap-14 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-14">
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="typography-eyebrow">Inbox</p>
                <h2 className="display-title mt-3 text-3xl">Inquiries</h2>
              </div>
              <span className="text-sm text-ploy-text-secondary">{data.inquiries.length} total</span>
            </div>
            <div className="mt-7 space-y-4">
              {data.inquiries.map((inquiry) => (
                <article key={inquiry.id} className="rounded-[1.6rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-heading text-2xl tracking-tight">{inquiry.customerName}</p>
                      <p className="mt-1 text-sm text-ploy-text-secondary">
                        {inquiry.occasion} · {inquiry.guestCount} guests · {inquiry.eventDate}
                      </p>
                    </div>
                    <span className="rounded-full border border-ploy-border-primary px-3 py-1 text-xs uppercase tracking-[0.08em] text-ploy-text-secondary">
                      {statusLabel(inquiry.status)}
                    </span>
                  </div>
                  <p className="mt-4 flex items-center gap-2 text-sm text-ploy-text-secondary">
                    <MapPin size={14} aria-hidden="true" /> {inquiry.location}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ploy-text-secondary">{inquiry.message}</p>
                  <p className="mt-3 text-sm">Budget: {inquiry.budget || 'Not specified'}</p>

                  {inquiry.status !== 'quoted' ? (
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <input
                        inputMode="numeric"
                        value={quoteDrafts[inquiry.id] ?? ''}
                        onChange={(event) =>
                          setQuoteDrafts((current) => ({ ...current, [inquiry.id]: event.target.value }))
                        }
                        placeholder="Quote amount in GHS"
                        className="min-h-11 flex-1 rounded-xl border border-ploy-border-primary bg-ploy-background-primary px-4 outline-none focus:border-ploy-accent-tertiary"
                      />
                      <button
                        type="button"
                        className="btn btn-primary min-h-11 px-5"
                        disabled={busyId === inquiry.id}
                        onClick={() => void sendQuote(inquiry.id)}
                      >
                        Send quote
                      </button>
                    </div>
                  ) : (
                    <p className="mt-5 font-heading text-xl">Quote sent: {money(inquiry.quotedPrice ?? 0)}</p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="typography-eyebrow">Opportunities</p>
                <h2 className="display-title mt-3 text-3xl">Open chef requests</h2>
              </div>
              <span className="text-sm text-ploy-text-secondary">Matched to your market</span>
            </div>
            <div className="mt-7 space-y-4">
              {data.openRequests.map((request) => {
                const existingProposal = data.proposals.find((proposal) => proposal.requestId === request.id)
                return (
                  <article key={request.id} className="rounded-[1.6rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-heading text-2xl tracking-tight">{request.occasion}</p>
                        <p className="mt-1 text-sm text-ploy-text-secondary">
                          {request.city} · {request.guestSummary} · {request.eventDate}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{request.budget}</span>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-ploy-text-secondary">{request.notes}</p>
                    <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-ploy-text-secondary">
                      <span>{request.cuisine || 'Any cuisine'}</span>
                      <span>·</span>
                      <span>{request.serviceType}</span>
                      <span>·</span>
                      <span>{request.mealTime}</span>
                    </div>
                    {existingProposal ? (
                      <p className="mt-6 flex items-center gap-2 text-sm">
                        Proposal sent for {money(existingProposal.proposedPrice)}
                        <ArrowRight size={14} aria-hidden="true" />
                        {statusLabel(existingProposal.status)}
                      </p>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary mt-6 min-h-11 px-5"
                        disabled={busyId === request.id}
                        onClick={() => void sendProposal(request)}
                      >
                        Send {money(suggestedProposal(request))} proposal
                      </button>
                    )}
                  </article>
                )
              })}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section>
            <p className="typography-eyebrow">Bookings</p>
            <h2 className="display-title mt-3 text-3xl">Orders & service</h2>
            <div className="mt-7 space-y-4">
              {data.bookings.map((booking) => (
                <article key={booking.id} className="rounded-[1.6rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-heading text-xl tracking-tight">{booking.bookingNumber}</p>
                      <p className="mt-1 text-sm text-ploy-text-secondary">{booking.customerName}</p>
                    </div>
                    <span className="text-xs uppercase tracking-[0.08em] text-ploy-text-secondary">
                      {statusLabel(booking.bookingStatus)}
                    </span>
                  </div>
                  <p className="mt-5 text-sm">{booking.occasion}</p>
                  <p className="mt-1 text-sm text-ploy-text-secondary">
                    {booking.eventDate} · {booking.guestSummary}
                  </p>
                  <p className="mt-1 text-sm text-ploy-text-secondary">{booking.location}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-ploy-border-primary pt-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.08em] text-ploy-text-secondary">Chef payout</p>
                      <p className="mt-1 font-heading text-xl">{money(booking.chefPayout)}</p>
                    </div>
                    {booking.bookingStatus === 'confirmed' ? (
                      <button
                        type="button"
                        className="btn btn-outline min-h-10 px-4"
                        disabled={busyId === booking.id}
                        onClick={() => void moveBooking(booking.id, 'in_progress')}
                      >
                        Start service
                      </button>
                    ) : null}
                    {booking.bookingStatus === 'in_progress' ? (
                      <button
                        type="button"
                        className="btn btn-primary min-h-10 px-4"
                        disabled={busyId === booking.id}
                        onClick={() => void moveBooking(booking.id, 'completed')}
                      >
                        Complete
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[1.8rem] bg-ploy-text-primary p-7 text-ploy-text-inverse">
            <p className="text-xs uppercase tracking-[0.12em] text-white/60">Earnings</p>
            <p className="mt-5 font-heading text-4xl">{money(data.revenue.lifetime)}</p>
            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-6 text-sm">
              <div>
                <p className="text-white/55">Available</p>
                <p className="mt-1 font-medium">{money(data.revenue.available)}</p>
              </div>
              <div>
                <p className="text-white/55">Pending</p>
                <p className="mt-1 font-medium">{money(data.revenue.pending)}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
