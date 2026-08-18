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
  type ChefRequest,
} from '../../data/marketplace'

export const Route = createFileRoute('/request/proposals')({
  component: ProposalsPage,
})

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

function ProposalsPage() {
  const [request, setRequest] = useState<ChefRequest>(emptyRequest)

  useEffect(() => {
    setRequest(readRequest())
  }, [])

  const matched = matchChefs(request)
  const hasRequest = Boolean(request.city || request.cuisine || request.lat)
  const origin =
    request.lat != null && request.lng != null
      ? { lat: request.lat, lng: request.lng }
      : null

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

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {matched.map((chef) => {
              const menu = sampleMenus.find((item) => item.chefId === chef.id)
              return (
                <div key={chef.id}>
                  <ChefCard
                    chef={chef}
                    distanceKm={origin ? distanceKm(origin, chef) : undefined}
                  />
                  {menu ? (
                    <p className="mt-4 px-1 text-sm text-ploy-text-secondary">
                      Suggested menu: {menu.title}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </PageShell>
  )
}
