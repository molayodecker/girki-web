import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Inbox,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react'
import { getChef } from '../data/marketplace'
import {
  chefLoginFn,
  chefLogoutFn,
  getChefSessionFn,
  marketplaceRepository,
} from '../lib/marketplace.functions'
import type {
  BookingStatus,
  ChefDashboardData,
  ChefRequestRecord,
  ChefSession,
} from '../lib/marketplace/types'

function money(amount: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(amount)
}

function statusLabel(status: string) {
  return status.replaceAll('_', ' ')
}

function ChefLogin({
  onSignedIn,
}: {
  onSignedIn: (session: ChefSession) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const session = await chefLoginFn({ data: { email, password } })
      onSignedIn(session)
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24">
      <p className="typography-eyebrow">Chef portal</p>
      <h1 className="display-title mt-4 text-4xl">Sign in to your kitchen.</h1>
      <p className="mt-4 text-ploy-text-secondary">
        Use the email Girki has on file for your chef profile. Quotes and bookings stay tied to
        your account.
      </p>
      <form onSubmit={(event) => void submit(event)} className="mt-10 space-y-4">
        <label className="block">
          <span className="text-sm text-ploy-text-secondary">Email</span>
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 outline-none focus:border-ploy-accent-tertiary"
          />
        </label>
        <label className="block">
          <span className="text-sm text-ploy-text-secondary">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 outline-none focus:border-ploy-accent-tertiary"
          />
        </label>
        {error ? <p className="text-sm text-ploy-accent-secondary">{error}</p> : null}
        <button type="submit" className="btn btn-primary min-h-11 w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default function ChefDashboard() {
  const [session, setSession] = useState<ChefSession | null | undefined>(undefined)
  const [data, setData] = useState<ChefDashboardData | null>(null)
  const [quoteDrafts, setQuoteDrafts] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')

  const chef = session ? getChef(session.slug) : null
  const displayName = chef?.name ?? session?.displayName ?? 'Chef'

  async function refresh() {
    setData(await marketplaceRepository.listChefDashboard())
  }

  useEffect(() => {
    void getChefSessionFn()
      .then((next) => setSession(next))
      .catch(() => setSession(null))
  }, [])

  useEffect(() => {
    if (!session) {
      setData(null)
      return
    }
    void marketplaceRepository
      .listChefDashboard()
      .then(setData)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load the chef dashboard.')
      })
  }, [session])

  if (session === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-ploy-text-secondary">
        Checking chef session…
      </div>
    )
  }

  if (!session) {
    return <ChefLogin onSignedIn={setSession} />
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-24 text-ploy-text-secondary">
        {error || 'Loading chef dashboard…'}
      </div>
    )
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
    const amount = Number.parseInt(quoteDrafts[`request:${request.id}`] ?? '', 10)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid quote amount before sending.')
      return
    }
    setBusyId(request.id)
    setError('')
    try {
      await marketplaceRepository.createProposal({
        requestId: request.id,
        message: `I can create a tailored ${request.cuisine || 'private chef'} experience for this request.`,
        proposedPrice: amount,
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

  async function signOut() {
    await chefLogoutFn()
    setSession(null)
    setData(null)
  }

  const activeBookings = data.bookings.filter((booking) =>
    ['awaiting_payment', 'confirmed', 'in_progress'].includes(booking.bookingStatus),
  )
  const newInquiries = data.inquiries.filter((inquiry) => inquiry.status === 'new').length

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-6 border-b border-ploy-border-primary pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="typography-eyebrow">Chef portal</p>
          <h1 className="display-title mt-4 text-4xl sm:text-5xl">Welcome back, {displayName}.</h1>
          <p className="mt-4 max-w-2xl text-ploy-text-secondary">
            Quote from here, or reply on WhatsApp with the amount and any notes. Requests also
            arrive by email. Quotes you send are saved live for the customer.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {chef ? (
            <a href={`/chefs/${chef.id}`} className="btn btn-outline min-h-11 px-5">
              View public profile
            </a>
          ) : null}
          <button type="button" className="btn btn-outline min-h-11 px-5" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
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
              {data.inquiries.length === 0 ? (
                <p className="rounded-[1.6rem] border border-dashed border-ploy-border-primary px-6 py-8 text-sm text-ploy-text-secondary">
                  No inquiries yet. Direct requests from your profile will appear here.
                </p>
              ) : null}
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
              {data.openRequests.length === 0 ? (
                <p className="rounded-[1.6rem] border border-dashed border-ploy-border-primary px-6 py-8 text-sm text-ploy-text-secondary">
                  No open chef requests right now.
                </p>
              ) : null}
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
                        Quote sent: {money(existingProposal.proposedPrice)}
                        <ArrowRight size={14} aria-hidden="true" />
                        {statusLabel(existingProposal.status)}
                      </p>
                    ) : (
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                          className="min-h-11 flex-1 rounded-xl border border-ploy-border-primary bg-ploy-background-primary px-4 outline-none focus:border-ploy-accent-tertiary"
                        />
                        <button
                          type="button"
                          className="btn btn-primary min-h-11 px-5"
                          disabled={busyId === request.id}
                          onClick={() => void sendProposal(request)}
                        >
                          Send quote
                        </button>
                      </div>
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
