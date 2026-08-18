import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import LocationAutocomplete from './LocationAutocomplete'
import LocationAccessGate from './LocationAccessGate'
import DatePicker from './DatePicker'
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

type StepId = keyof Pick<
  ChefRequest,
  | 'city'
  | 'occasion'
  | 'serviceType'
  | 'guests'
  | 'mealTime'
  | 'cuisine'
  | 'date'
  | 'budget'
  | 'restrictions'
  | 'notes'
  | 'name'
>

const steps: Array<{
  id: StepId
  title: string
  copy: string
}> = [
  {
    id: 'city',
    title: 'Where’s the table?',
    copy: 'We use your location to match chefs nearby. Confirm or change the city if needed.',
  },
  {
    id: 'occasion',
    title: 'What’s the occasion?',
    copy: 'This sets the tone, pacing, and menu.',
  },
  {
    id: 'serviceType',
    title: 'What kind of service?',
    copy: 'One evening, several days, or a week of meals.',
  },
  {
    id: 'guests',
    title: 'For how many guests?',
    copy: 'The chef’s fee is typically fixed, so the price per person changes with group size.',
  },
  {
    id: 'mealTime',
    title: 'Lunch or dinner?',
    copy: 'You can refine the exact hour with your chef later.',
  },
  {
    id: 'cuisine',
    title: 'What are you craving?',
    copy: 'A direction only. Your chef will still tailor every course.',
  },
  {
    id: 'date',
    title: 'When?',
    copy: 'Not sure yet? Choose a date you can change later.',
  },
  {
    id: 'budget',
    title: 'What feels right for this night?',
    copy: 'Prices vary with the chef’s expertise and the complexity of the menu.',
  },
  {
    id: 'restrictions',
    title: 'Any food restrictions?',
    copy: 'If you still need to check with guests, you can tell your chef later.',
  },
  {
    id: 'notes',
    title: 'Describe the evening',
    copy: 'Share the vibe, must-have dishes, and anything that would make this perfect.',
  },
  {
    id: 'name',
    title: 'That’s it.',
    copy: 'Add your details and we’ll match you with chefs. No commitment.',
  },
]

function ChoiceButton({
  selected,
  title,
  copy,
  onClick,
}: {
  selected: boolean
  title: string
  copy?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-5 py-4 text-left transition-all ${
        selected
          ? 'border-ploy-accent-primary bg-ploy-accent-primary text-white shadow-[var(--shadow-soft)]'
          : 'border-ploy-border-primary bg-ploy-neutral-primary-s0 hover:border-ploy-accent-tertiary'
      }`}
    >
      <span className="block font-heading text-xl tracking-tight">{title}</span>
      {copy ? (
        <span
          className={`mt-1.5 block text-sm leading-relaxed ${
            selected ? 'text-white/70' : 'text-ploy-text-secondary'
          }`}
        >
          {copy}
        </span>
      ) : null}
    </button>
  )
}

export default function RequestWizard({
  initial,
}: {
  initial?: Partial<ChefRequest>
}) {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [request, setRequest] = useState<ChefRequest>(() => ({
    ...emptyRequest,
    ...Object.fromEntries(
      Object.entries(initial ?? {}).filter(([, value]) => value != null && value !== ''),
    ),
  }))
  const [error, setError] = useState('')
  const [locationStatus, setLocationStatus] = useState<'checking' | 'needed' | 'ready'>(
    'checking',
  )
  const [detectedLocation, setDetectedLocation] = useState<UserLocation | null>(null)

  useEffect(() => {
    const stored = readStoredLocation()
    if (!stored) {
      setLocationStatus('needed')
      return
    }
    setDetectedLocation(stored)
    setRequest((current) => ({
      ...current,
      lat: stored.lat,
      lng: stored.lng,
      city: current.city || stored.city,
    }))
    setLocationStatus('ready')
  }, [])

  const step = steps[stepIndex]
  const progress = ((stepIndex + 1) / steps.length) * 100

  const canContinue = useMemo(() => {
    if (step.id === 'notes') return true
    if (step.id === 'name') {
      return Boolean(request.name && request.email && request.phone)
    }
    return Boolean(request[step.id])
  }, [request, step.id])

  function update<K extends keyof ChefRequest>(key: K, value: ChefRequest[K]) {
    setError('')
    setRequest((current) => ({ ...current, [key]: value }))
  }

  function next() {
    if (request.lat == null || request.lng == null) {
      setLocationStatus('needed')
      return
    }
    if (!canContinue) {
      setError('Please complete this step to continue.')
      return
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex((index) => index + 1)
      return
    }
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(requestStorageKey, JSON.stringify(request))
    }
    void navigate({ to: '/request/proposals' })
  }

  function grantLocation(location: UserLocation) {
    storeLocation(location)
    setDetectedLocation(location)
    setRequest((current) => ({
      ...current,
      lat: location.lat,
      lng: location.lng,
      city: current.city || location.city,
    }))
    setLocationStatus('ready')
  }

  const fieldClass =
    'min-h-14 w-full rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 outline-none transition-colors focus:border-ploy-accent-tertiary'

  if (locationStatus !== 'ready') {
    if (locationStatus === 'checking') return null
    return <LocationAccessGate onGranted={grantLocation} />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-10 flex items-end justify-between gap-6">
        <p className="text-sm text-ploy-text-secondary">No commitment · Quotes after you submit</p>
        <p className="typography-eyebrow">
          {String(stepIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
        </p>
      </div>
      <div className="mb-12 h-px overflow-hidden bg-ploy-border-primary">
        <div
          className="h-full bg-ploy-accent-tertiary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="display-title text-4xl sm:text-5xl">{step.title}</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ploy-text-secondary">{step.copy}</p>

      <div className="mt-12">
        {step.id === 'city' ? (
          <div className="space-y-6">
            <label className="block rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4">
              <span className="typography-eyebrow mt-3 block">Location</span>
              <LocationAutocomplete
                compact
                lat={request.lat}
                lng={request.lng}
                value={request.city}
                onChange={(city) => update('city', city)}
                placeholder="Search a city on Google"
              />
            </label>
            {detectedLocation?.label ? (
              <p className="text-sm text-ploy-text-secondary">
                Detected from your location: {detectedLocation.label}
              </p>
            ) : null}
            <div>
              <p className="typography-eyebrow mb-3">Popular cities</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {cities.map((city) => (
                  <ChoiceButton
                    key={city.slug}
                    selected={request.city === city.name}
                    title={city.name}
                    copy={city.country}
                    onClick={() => update('city', city.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {step.id === 'occasion' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {occasions.map((occasion) => (
              <ChoiceButton
                key={occasion.id}
                selected={request.occasion === occasion.id}
                title={occasion.label}
                onClick={() => update('occasion', occasion.id)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'serviceType' ? (
          <div className="grid gap-3">
            {serviceTypes.map((service) => (
              <ChoiceButton
                key={service.id}
                selected={request.serviceType === service.id}
                title={service.label}
                copy={service.copy}
                onClick={() => update('serviceType', service.id)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'guests' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {guestOptions.map((option) => (
              <ChoiceButton
                key={option.id}
                selected={request.guests === option.id}
                title={option.label}
                onClick={() => update('guests', option.id)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'mealTime' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {mealTimes.map((option) => (
              <ChoiceButton
                key={option.id}
                selected={request.mealTime === option.id}
                title={option.label}
                onClick={() => update('mealTime', option.id)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'cuisine' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {cuisineOptions.map((cuisine) => (
              <ChoiceButton
                key={cuisine}
                selected={request.cuisine === cuisine}
                title={cuisine}
                onClick={() => update('cuisine', cuisine)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'date' ? (
          <div className="max-w-sm rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4">
            <span className="typography-eyebrow mt-3 block">Date</span>
            <DatePicker compact value={request.date} onChange={(date) => update('date', date)} />
          </div>
        ) : null}

        {step.id === 'budget' ? (
          <div className="grid gap-3">
            {budgetOptions.map((option) => (
              <ChoiceButton
                key={option.id}
                selected={request.budget === option.id}
                title={option.label}
                copy={option.copy}
                onClick={() => update('budget', option.id)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'restrictions' ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {['None', 'Yes, I’ll share details'].map((option) => (
              <ChoiceButton
                key={option}
                selected={request.restrictions === option}
                title={option}
                onClick={() => update('restrictions', option)}
              />
            ))}
          </div>
        ) : null}

        {step.id === 'notes' ? (
          <textarea
            value={request.notes}
            onChange={(event) => update('notes', event.target.value)}
            rows={6}
            placeholder="Birthday dinner for six, no shellfish, we’d love jollof on the table…"
            className={`${fieldClass} py-4`}
          />
        ) : null}

        {step.id === 'name' ? (
          <div className="grid gap-5">
            <label>
              <span className="typography-eyebrow mb-3 block">Name</span>
              <input
                value={request.name}
                onChange={(event) => update('name', event.target.value)}
                className={fieldClass}
              />
            </label>
            <label>
              <span className="typography-eyebrow mb-3 block">Email</span>
              <input
                type="email"
                value={request.email}
                onChange={(event) => update('email', event.target.value)}
                className={fieldClass}
              />
            </label>
            <label>
              <span className="typography-eyebrow mb-3 block">Phone</span>
              <input
                type="tel"
                value={request.phone}
                onChange={(event) => update('phone', event.target.value)}
                className={fieldClass}
              />
            </label>
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-6 text-sm text-ploy-accent-secondary">{error}</p> : null}

      <div className="mt-14 flex items-center justify-between gap-4">
        <button
          type="button"
          className="text-sm tracking-[0.08em] uppercase disabled:text-ploy-text-secondary"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
        >
          Previous
        </button>
        <button type="button" className="btn btn-primary min-h-12 px-8" onClick={next}>
          {step.id === 'name' ? 'See proposals' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
