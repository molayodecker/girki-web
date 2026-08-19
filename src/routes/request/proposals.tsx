import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ChefCard from '../../components/ChefCard'
import PageShell, { PageIntro } from '../../components/layout/PageShell'
import {
  distanceKm,
  emptyRequest,
  getChef,
  matchChefs,
  requestStorageKey,
  sampleMenus,
  type Chef,
  type ChefRequest,
} from '../../data/marketplace'
import { marketplaceRepository } from '../../lib/marketplace.functions'
import type { Booking, ChefProposal } from '../../lib/marketplace/types'

export const Route = createFileRoute('/request/proposals')({
  component: ProposalsPage,
})

const persistedRequestKey = 'girki-marketplace-request-record'

function readRequest(): ChefRequest {
  if (typeof window === 'undefined') return emptyRequest
  const raw = window.sessionStorage.getItem(requestStorageKey)
  if (!raw) return emptyRequest
  try {
    return { ...emptyRequest, ...(JSON.parse(raw) as Partial<ChefRequest>) }
  } catch {
    return emptyRequest
  }
}

function money(amount: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(amount)
}

function requestFingerprint(request: ChefRequest) {
  return JSON.stringify([
    request.city,
    request.date,
    request.name,
    request.email,
    request.cuisine,
    request.guests,
    request.notes,
  ])
}

function ProposalsPage() {
  const [request, setRequest] = useState<ChefRequest>(emptyRequest)
  const [requestId, setRequestId] = useState('')
  const [quotes, setQuotes] = useState<ChefProposal[]>([])
  const [booking, setBooking] = useState<Booking | null>(null)
  const [busyChefId, setBusyChefId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const storedRequest = readRequest()
    setRequest(storedRequest)

    const hasRequest = Boolean(storedRequest.city || storedRequest.cuisine || storedRequest.lat)
    if (!hasRequest || typeof window === 'undefined') return

    const fingerprint = requestFingerprint(storedRequest)
    const storedRecord = window.sessionStorage.getItem(persistedRequestKey)
    if (storedRecord) {
      try {
        const parsed = JSON.parse(storedRecord) as { id?: string; fingerprint?: string }
        if (parsed.id && parsed.fingerprint === fingerprint) {
          setRequestId(parsed.id)
          return
        }
      } catch {
        window.sessionStorage.removeItem(persistedRequestKey)
      }
    }

    void marketplaceRepository
      .createRequest({
        customerName: storedRequest.name || 'Girki guest',
        email: storedRequest.email || 'guest@girki.app',
        phone: storedRequest.phone,
        city: storedRequest.city,
        cuisine: storedRequest.cuisine,
        occasion: storedRequest.occasion || 'Private chef request',
        serviceType: storedRequest.serviceType || 'Single service',
        guestSummary: storedRequest.guests || 'Guests TBC',
        mealTime: storedRequest.mealTime || 'Time TBC',
        eventDate: storedRequest.date,
        budget: storedRequest.budget || 'Flexible',
        restrictions: storedRequest.restrictions,
        notes: storedRequest.notes,
      })
      .then((record) => {
        window.sessionStorage.setItem(
          persistedRequestKey,
          JSON.stringify({ id: record.id, fingerprint }),
        )
        setRequestId(record.id)
      })
      .catch((createError: unknown) => {
        setError(createError instanceof Error ? createError.message : 'Unable to save this request.')
      })
  }, [])

  useEffect(() => {
    if (!requestId) return

    let cancelled = false

    async function loadQuotes() {
      try {
        const nextQuotes = await marketplaceRepository.listProposalsForRequest(requestId)
        if (cancelled) return
        setQuotes(nextQuotes)

        const accepted = nextQuotes.find((quote) => quote.status === 'accepted')
        if (accepted && !booking) {
          setBooking(await marketplaceRepository.acceptProposal(accepted.id))
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load quotes.')
        }
      }
    }

    void loadQuotes()
    const timer = window.setInterval(() => {
      void loadQuotes()
    }, 8000)

    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [requestId, booking])

  const matched = matchChefs(request)
  const hasRequest = Boolean(request.city || request.cuisine || request.lat)
  const origin =
    request.lat != null && request.lng != null
      ? { lat: request.lat, lng: request.lng }
      : null

  async function acceptChef(chef: Chef, proposal: ChefProposal) {
    setBusyChefId(chef.id)
    setError('')
    try {
      setBooking(await marketplaceRepository.acceptProposal(proposal.id))
    } catch (chooseError) {
      setError(chooseError instanceof Error ? chooseError.message : 'Unable to accept this quote.')
    } finally {
      setBusyChefId('')
    }
  }

  return (
    <PageShell>
      <main className="section-pad">
        <div className="mx-auto max-w-7xl">
          <PageIntro
            eyebrow="Your proposals"
            title={origin ? 'Chefs near you.' : 'Chefs ready for a request like yours.'}
            copy={
              hasRequest
                ? `${request.city || 'Near you'} · ${request.cuisine || 'Any cuisine'} · ${request.guests || 'Guests TBC'}`
                : 'Start a request to match chefs to your date, city, and menu.'
            }
            action={
              !hasRequest ? (
                <Link to="/request" className="btn btn-primary">
                  Start a request
                </Link>
              ) : undefined
            }
          />

          {booking ? (
            <section className="mt-12 rounded-[2rem] border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-7 sm:p-9">
              <p className="typography-eyebrow">Chef selected</p>
              <h2 className="display-title mt-4 text-3xl">
                Booking {getChef(booking.chefId)?.name ?? 'your chef'} order #{booking.bookingNumber} is
                ready for payment.
              </h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ploy-text-secondary">
                This booking uses the chef’s live quote. Payment stays pending until checkout is
                connected.
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <span>Total: {money(booking.total)}</span>
                <span>Status: {booking.bookingStatus.replaceAll('_', ' ')}</span>
                <span>{booking.eventDate}</span>
              </div>
            </section>
          ) : (
            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ploy-text-secondary">
              Chefs get this request by email and WhatsApp. They can quote from the dashboard or by
              replying on WhatsApp with the amount and any notes. When a quote arrives, it appears
              here.
            </p>
          )}

          {error ? <p className="mt-8 text-sm text-ploy-accent-secondary">{error}</p> : null}

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {matched.map((chef) => {
              const menu = sampleMenus.find((item) => item.chefId === chef.id)
              const quote = quotes.find((item) => item.chefId === chef.id)
              const canAccept =
                Boolean(quote) &&
                quote != null &&
                ['submitted', 'viewed', 'shortlisted'].includes(quote.status)
              return (
                <div key={chef.id}>
                  <ChefCard
                    chef={chef}
                    distanceKm={origin ? distanceKm(origin, chef) : undefined}
                  />
                  <div className="mt-4 rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-5">
                    <p className="typography-eyebrow">{quote ? 'Chef quote' : 'Awaiting quote'}</p>
                    <p className="mt-3 font-heading text-2xl">
                      {quote ? money(quote.proposedPrice) : 'Waiting for quote'}
                    </p>
                    <p className="mt-2 text-sm text-ploy-text-secondary">
                      {quote?.menuDescription ||
                        (menu ? `Menu direction: ${menu.title}` : 'Custom menu after confirmation')}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary mt-5 min-h-11 w-full"
                      disabled={!canAccept || busyChefId === chef.id || Boolean(booking)}
                      onClick={() => {
                        if (quote) void acceptChef(chef, quote)
                      }}
                    >
                      {busyChefId === chef.id
                        ? 'Creating booking…'
                        : quote
                          ? `Accept ${money(quote.proposedPrice)}`
                          : 'Waiting for quote'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
