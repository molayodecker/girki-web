import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { usePostHog } from '@posthog/react'
import { LocateFixed, MapPin } from 'lucide-react'
import DatePicker from './DatePicker'
import LocationAutocomplete from './LocationAutocomplete'
import { images } from '../data/home'
import {
  budgetOptions,
  cities,
  cuisineOptions,
  emptyRequest,
  guestOptions,
  locationStorageKey,
  mealTimes,
  occasions,
  requestStorageKey,
  serviceTypes,
  type ChefRequest,
  type UserLocation,
} from '../data/marketplace'
import { detectUserLocation, geolocationErrorMessage } from '../lib/geolocation'
import { posthogLoggerInfo } from '../lib/posthog-logs'

const occasionImages: Record<string, string> = {
  'date-night': images.dateNight,
  birthday: images.partiesCelebrations,
  family: images.privateDinner,
  friends: images.cuisine,
  corporate: images.corporateEvents,
  vacation: images.vacationChef,
  other: images.chefWok,
}

const stages = [
  {
    id: 'table',
    kicker: 'Request a chef',
    title: 'Set the table',
    copy: 'Where, when, and for whom. We’ll match chefs around this.',
    image: images.privateDinner,
    caption: 'A chef at your table, not a restaurant reservation.',
  },
  {
    id: 'evening',
    kicker: 'Your evening',
    title: 'Shape the evening',
    copy: 'Occasion, service, cuisine, and the kind of menu you want.',
    image: images.dateNight,
    caption: 'Date night, a celebration, or a week of meals.',
  },
  {
    id: 'details',
    kicker: 'Almost there',
    title: 'A few details',
    copy: 'Dietary notes and how chefs can reach you. No commitment.',
    image: images.cuisine,
    caption: 'Chefs propose. You choose. Nothing is booked yet.',
  },
] as const

const dietaryOptions = ['None', 'Vegetarian', 'Pescatarian', 'Halal', 'Allergies, I’ll note them']

function readStoredLocation(): UserLocation | null {
  if (typeof window === 'undefined') return null
  const raw = window.sessionStorage.getItem(locationStorageKey)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<UserLocation>
    if (typeof parsed.lat !== 'number' || typeof parsed.lng !== 'number') return null
    return {
      lat: parsed.lat,
      lng: parsed.lng,
      city: parsed.city ?? '',
      label: parsed.label ?? parsed.city ?? 'Your location',
    }
  } catch {
    return null
  }
}

function storeLocation(location: UserLocation) {
  window.sessionStorage.setItem(locationStorageKey, JSON.stringify(location))
}

function formatDate(value: string) {
  if (!value) return ''
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value
  return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function Chip({
  selected,
  children,
  onClick,
}: {
  selected: boolean
  children: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-2 px-4 py-2.5 text-sm font-heading font-medium transition-colors ${
        selected
          ? 'border-[#1c1418] bg-[#1c1418] text-girki-cream'
          : 'border-[#1c1418]/20 bg-white text-ploy-text-primary hover:border-[#1c1418]/45'
      }`}
    >
      {children}
    </button>
  )
}

export default function RequestWizard({
  initial,
}: {
  initial?: Partial<ChefRequest>
}) {
  const navigate = useNavigate()
  const posthog = usePostHog()
  const seeded = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(initial ?? {}).filter(([, value]) => value != null && value !== ''),
      ) as Partial<ChefRequest>,
    [initial],
  )
  const [stageIndex, setStageIndex] = useState(() =>
    seeded.city && seeded.date && seeded.guests ? 1 : 0,
  )
  const [request, setRequest] = useState<ChefRequest>(() => ({
    ...emptyRequest,
    mealTime: seeded.mealTime || 'dinner',
    restrictions: seeded.restrictions || 'None',
    ...seeded,
  }))
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)
  const [locationHint, setLocationHint] = useState('')
  const [detectedLabel, setDetectedLabel] = useState('')

  useEffect(() => {
    const stored = readStoredLocation()
    if (!stored) return
    setDetectedLabel(stored.label)
    setRequest((current) => ({
      ...current,
      lat: current.lat ?? stored.lat,
      lng: current.lng ?? stored.lng,
      city: current.city || stored.city,
    }))
  }, [])

  const stage = stages[stageIndex]

  const canContinue = useMemo(() => {
    if (stage.id === 'table') {
      return Boolean(request.city && request.date && request.guests && request.mealTime)
    }
    if (stage.id === 'evening') {
      return Boolean(
        request.occasion && request.serviceType && request.cuisine && request.budget,
      )
    }
    return Boolean(request.name && request.email && request.phone)
  }, [request, stage.id])

  function update<K extends keyof ChefRequest>(key: K, value: ChefRequest[K]) {
    setError('')
    setRequest((current) => ({ ...current, [key]: value }))
  }

  async function useMyLocation() {
    setLocating(true)
    setLocationHint('')
    try {
      const location = await detectUserLocation()
      storeLocation(location)
      setDetectedLabel(location.label)
      setRequest((current) => ({
        ...current,
        lat: location.lat,
        lng: location.lng,
        city: current.city || location.city,
      }))
    } catch (caught) {
      if (caught && typeof caught === 'object' && 'code' in caught) {
        setLocationHint(geolocationErrorMessage(caught as GeolocationPositionError))
      } else {
        setLocationHint('Search a city instead if location isn’t available.')
      }
    } finally {
      setLocating(false)
    }
  }

  function chooseOccasion(occasionId: string) {
    setError('')
    setRequest((current) => ({
      ...current,
      occasion: occasionId,
      serviceType: current.serviceType
        ? current.serviceType
        : occasionId === 'vacation'
          ? 'multiple'
          : 'single',
    }))
  }

  function next() {
    if (!canContinue) {
      setError(
        stage.id === 'details'
          ? 'Add your name, email, and phone to see chefs.'
          : 'Complete this step to continue.',
      )
      return
    }
    if (stageIndex < stages.length - 1) {
      posthog.capture('chef_request_step_completed', { step: stage.id })
      setStageIndex((index) => index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.sessionStorage.setItem(requestStorageKey, JSON.stringify(request))
    const logAttributes = {
      cuisine: request.cuisine,
      service_type: request.serviceType,
      guest_range: request.guests,
      budget_range: request.budget,
    }
    posthog.capture('chef_request_submitted', logAttributes)
    posthogLoggerInfo(posthog, 'chef_request_submitted', logAttributes)
    void navigate({ to: '/request/proposals' })
  }

  const summary = [
    request.city,
    formatDate(request.date),
    guestOptions.find((option) => option.id === request.guests)?.label,
    occasions.find((occasion) => occasion.id === request.occasion)?.label,
  ]
    .filter(Boolean)
    .join(' · ')

  const fieldClass =
    'min-h-12 w-full border-2 border-[#1c1418]/20 bg-white px-4 outline-none transition-colors focus:border-[#1c1418]'

  return (
    <div className="grid min-h-svh border-b-4 border-[#1c1418] lg:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden lg:sticky lg:top-20 lg:block lg:h-[calc(100svh-5rem)] lg:p-6 lg:pr-3">
        <div className="relative h-full">
          <div
            className="absolute inset-0 translate-x-3 translate-y-3 bg-girki-saffron"
            aria-hidden="true"
          />
          <div className="relative h-full overflow-hidden border-4 border-[#1c1418] bg-[#1c1418]">
            <img src={stage.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#1c1418]/95 via-[#1c1418]/35 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-8 text-girki-cream xl:p-10">
              <p className="font-heading text-[0.65rem] font-semibold tracking-[0.38em] text-girki-saffron uppercase">
                {stage.kicker}
              </p>
              <p
                className="mt-5 max-w-sm font-display-heavy leading-[1.02]"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}
              >
                {stage.caption}
              </p>
              {summary ? (
                <p className="mt-6 max-w-sm border-t border-white/15 pt-4 text-sm leading-relaxed text-girki-cream/75">
                  {summary}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <section className="bg-ploy-background-primary">
        <div className="relative border-b-4 border-[#1c1418] lg:hidden">
          <div className="relative h-48 overflow-hidden">
            <img src={stage.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#1c1418]/45" />
          </div>
          <p className="px-5 py-4 font-display-heavy text-xl text-ploy-text-primary">{stage.caption}</p>
        </div>

        <div className="mx-auto max-w-2xl px-5 pb-20 pt-8 lg:px-12 lg:pb-16 lg:pt-12">
          <div className="flex gap-2">
            {stages.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-current={index === stageIndex ? 'step' : undefined}
                className={`h-2 flex-1 border-2 border-[#1c1418] transition-colors ${
                  index <= stageIndex ? 'bg-girki-saffron' : 'bg-transparent'
                }`}
                onClick={() => {
                  if (index < stageIndex) setStageIndex(index)
                }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between font-heading text-xs font-semibold tracking-[0.14em] text-ploy-text-secondary uppercase">
            <span>{stage.title}</span>
            <span className="text-girki-saffron">No commitment</span>
          </div>

          <p className="mt-10 font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/55 uppercase">
            {stage.kicker}
          </p>
          <h1
            className="mt-4 font-display-heavy text-ploy-text-primary"
            style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)' }}
          >
            {stage.title}
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-ploy-text-secondary sm:text-lg">
            {stage.copy}
          </p>

          <div className="mt-10 space-y-10">
            {stage.id === 'table' ? (
              <>
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="typography-label">Where</p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs tracking-[0.08em] uppercase text-ploy-accent-secondary"
                      disabled={locating}
                      onClick={() => void useMyLocation()}
                    >
                      <LocateFixed size={14} aria-hidden="true" />
                      {locating ? 'Finding you…' : 'Use my location'}
                    </button>
                  </div>
                  <label className="block border-2 border-[#1c1418]/20 bg-white px-4">
                    <span className="sr-only">City</span>
                    <LocationAutocomplete
                      compact
                      lat={request.lat}
                      lng={request.lng}
                      value={request.city}
                      onChange={(city) => update('city', city)}
                      placeholder="Search Accra, Kumasi, Tema…"
                    />
                  </label>
                  {detectedLabel ? (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-ploy-text-secondary">
                      <MapPin size={14} aria-hidden="true" /> {detectedLabel}
                    </p>
                  ) : null}
                  {locationHint ? (
                    <p className="mt-2 text-sm text-ploy-text-secondary">{locationHint}</p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {cities.slice(0, 6).map((city) => (
                      <Chip
                        key={city.slug}
                        selected={request.city === city.name}
                        onClick={() => update('city', city.name)}
                      >
                        {city.name}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="typography-label mb-3">When</p>
                    <div className="border-2 border-[#1c1418]/20 bg-white px-4">
                      <DatePicker compact value={request.date} onChange={(date) => update('date', date)} />
                    </div>
                  </div>
                  <div>
                    <p className="typography-label mb-3">Meal</p>
                    <div className="grid grid-cols-2 gap-2">
                      {mealTimes.map((option) => (
                        <Chip
                          key={option.id}
                          selected={request.mealTime === option.id}
                          onClick={() => update('mealTime', option.id)}
                        >
                          {option.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="typography-label mb-3">Guests</p>
                  <div className="flex flex-wrap gap-2">
                    {guestOptions.map((option) => (
                      <Chip
                        key={option.id}
                        selected={request.guests === option.id}
                        onClick={() => update('guests', option.id)}
                      >
                        {option.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {stage.id === 'evening' ? (
              <>
                <div>
                  <p className="typography-label mb-4">Occasion</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {occasions.map((occasion) => {
                      const selected = request.occasion === occasion.id
                      return (
                        <button
                          key={occasion.id}
                          type="button"
                          onClick={() => chooseOccasion(occasion.id)}
                          className={`group overflow-hidden border-4 text-left transition-all ${
                            selected
                              ? 'border-girki-saffron bg-girki-saffron/10'
                              : 'border-[#1c1418]/15 hover:border-[#1c1418]/35'
                          }`}
                        >
                          <span className="relative block aspect-4/3 overflow-hidden">
                            <img
                              src={occasionImages[occasion.id]}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                            <span className="absolute inset-x-0 bottom-0 p-3 font-heading text-lg text-white">
                              {occasion.label}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="typography-label mb-3">Service</p>
                  <div className="grid gap-2">
                    {serviceTypes.map((service) => {
                      const selected = request.serviceType === service.id
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => update('serviceType', service.id)}
                          className={`border-2 px-5 py-4 text-left transition-colors ${
                            selected
                              ? 'border-[#1c1418] bg-[#1c1418] text-girki-cream'
                              : 'border-[#1c1418]/20 bg-white hover:border-[#1c1418]/45'
                          }`}
                        >
                          <span className="block font-heading text-xl tracking-tight">{service.label}</span>
                          <span
                            className={`mt-1 block text-sm ${selected ? 'text-white/70' : 'text-ploy-text-secondary'}`}
                          >
                            {service.copy}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="typography-label mb-3">Cuisine</p>
                  <div className="flex flex-wrap gap-2">
                    {cuisineOptions.map((cuisine) => (
                      <Chip
                        key={cuisine}
                        selected={request.cuisine === cuisine}
                        onClick={() => update('cuisine', cuisine)}
                      >
                        {cuisine}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="typography-label mb-3">Budget</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {budgetOptions.map((option) => {
                      const selected = request.budget === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => update('budget', option.id)}
                          className={`border-2 px-4 py-4 text-left transition-colors ${
                            selected
                              ? 'border-[#1c1418] bg-[#1c1418] text-girki-cream'
                              : 'border-[#1c1418]/20 bg-white hover:border-[#1c1418]/45'
                          }`}
                        >
                          <span className="block font-heading text-xl tracking-tight">{option.label}</span>
                          <span
                            className={`mt-1 block text-sm leading-snug ${
                              selected ? 'text-white/70' : 'text-ploy-text-secondary'
                            }`}
                          >
                            {option.copy}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : null}

            {stage.id === 'details' ? (
              <>
                <div>
                  <p className="typography-label mb-3">Dietary notes</p>
                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((option) => (
                      <Chip
                        key={option}
                        selected={request.restrictions === option}
                        onClick={() => update('restrictions', option)}
                      >
                        {option}
                      </Chip>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="typography-label mb-3 block">Anything the chef should know</span>
                  <textarea
                    value={request.notes}
                    onChange={(event) => update('notes', event.target.value)}
                    rows={4}
                    placeholder="Must-have dishes, kitchen notes, timing, the vibe…"
                    className={`${fieldClass} py-4`}
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="typography-label mb-3 block">Name</span>
                    <input
                      value={request.name}
                      onChange={(event) => update('name', event.target.value)}
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </label>
                  <label>
                    <span className="typography-label mb-3 block">Email</span>
                    <input
                      type="email"
                      value={request.email}
                      onChange={(event) => update('email', event.target.value)}
                      autoComplete="email"
                      className={fieldClass}
                    />
                  </label>
                  <label>
                    <span className="typography-label mb-3 block">Phone</span>
                    <input
                      type="tel"
                      value={request.phone}
                      onChange={(event) => update('phone', event.target.value)}
                      autoComplete="tel"
                      className={fieldClass}
                    />
                  </label>
                </div>
                <p className="text-sm text-ploy-text-secondary">
                  Chefs send proposals. You only pay if you book.{' '}
                  <Link to="/chefs" className="underline decoration-ploy-accent-tertiary underline-offset-4">
                    Browse chefs instead
                  </Link>
                </p>
              </>
            ) : null}
          </div>

          {error ? <p className="mt-6 text-sm text-ploy-accent-secondary">{error}</p> : null}

          <div className="mt-10 flex items-center justify-between gap-4 border-t-2 border-[#1c1418]/15 pt-8">
            <button
              type="button"
              className="font-heading text-sm font-semibold tracking-[0.08em] uppercase disabled:text-ploy-text-secondary"
              disabled={stageIndex === 0}
              onClick={() => setStageIndex((index) => Math.max(0, index - 1))}
            >
              Back
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center bg-girki-saffron px-8 font-heading text-sm font-semibold text-[#1c1418] transition-transform hover:-translate-y-0.5"
              onClick={next}
            >
              {stage.id === 'details' ? 'See chefs near you' : 'Continue'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
