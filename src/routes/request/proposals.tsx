import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import ChefCard from '../../components/ChefCard'
import PageShell, { PageIntro } from '../../components/layout/PageShell'
import {
  distanceKm,
  emptyRequest,
  matchChefs,
  requestStorageKey,
  sampleMenus,
  type Chef,
  type ChefRequest,
} from '../../data/marketplace'
import { marketplaceRepository } from '../../lib/marketplace/mockRepository'
import type { Booking } from '../../lib/marketplace/types'

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

function proposalPrice(chef: Chef, request: ChefRequest) {
  const tier = request.budget === 'exclusive' ? 2900 : request.budget === 'gourmet' ? 2100 : 1500
  const chefAdjustment: Record<string, number> = {
    nana: 300,
    youssef: 500,
    amani: 150,
    zuri: 450,
    kofi: 0,
    ibrahim: 350,
  }
  return tier + (chefAdjustment[chef.id] ?? 200)
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
        email: storedRequest.email,
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

  const matched = matchChefs(request)
  const hasRequest = Boolean(request.city || request.cuisine || request.lat)
  const origin =
    request.lat != null && request.lng != null
      ? { lat: request.lat, lng: request.lng }
      : null

  async function chooseChef(chef: Chef) {
    if (!requestId) {
      setError('Your request is still being prepared. Please try again.')
      return
    }
    setBusyChefId(chef.id)
    setError('')
    try {
      const menu = sampleMenus.find((item) => item.chefId === chef.id)
      const proposal = await marketplaceRepository.createProposal({
        requestId,
        chefId: chef.id,
        message: `${chef.name} is available to tailor this experience to your request.`,
        proposedPrice: proposalPrice(chef, request),
        currency: 'GHS',
        menuDescription: menu?.title ?? 'Custom menu',
        includedServices: chef.included,
      })
      setBooking(await marketplaceRepository.acceptProposal(proposal.id))
    } catch (chooseError) {
      setError(chooseError instanceof Error ? chooseError.message : 'Unable to select this chef.')
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
              <h2 className="display-title mt-4 text-3xl">Booking {booking.bookingNumber} is ready for payment.</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-ploy-text-secondary">
                The booking record now connects the customer request, chef proposal, event details,
                pricing, payment state, and future chef payout. Payment remains pending until Supabase
                and the payment provider are connected.
              </p>
              <div className="mt-6 flex flex-wrap gap-6 text-sm">
                <span>Total: {money(booking.total)}</span>
                <span>Status: {booking.bookingStatus.replaceAll('_', ' ')}</span>
                <span>{booking.eventDate}</span>
              </div>
            </section>
          ) : null}

          {error ? <p className="mt-8 text-sm text-ploy-accent-secondary">{error}</p> : null}

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {matched.map((chef) => {
              const menu = sampleMenus.find((item) => item.chefId === chef.id)
              const price = proposalPrice(chef, request)
              return (
                <div key={chef.id}>
                  <ChefCard
                    chef={chef}
                    distanceKm={origin ? distanceKm(origin, chef) : undefined}
                  />
                  <div className="mt-4 rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-5">
                    <p className="typography-eyebrow">Suggested proposal</p>
                    <p className="mt-3 font-heading text-2xl">{money(price)}</p>
                    <p className="mt-2 text-sm text-ploy-text-secondary">
                      {menu ? `Menu direction: ${menu.title}` : 'Custom menu after confirmation'}
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary mt-5 min-h-11 w-full"
                      disabled={!requestId || busyChefId === chef.id || Boolean(booking)}
                      onClick={() => void chooseChef(chef)}
                    >
                      {busyChefId === chef.id ? 'Creating booking…' : 'Choose this chef'}
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
