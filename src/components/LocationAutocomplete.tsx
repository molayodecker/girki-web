import { useEffect, useId, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import {
  cityNameFromPlace,
  searchPlaces,
  type PlacePrediction,
} from '../lib/places.functions'

export default function LocationAutocomplete({
  value,
  onChange,
  name = 'city',
  placeholder = 'Search a city',
  compact = false,
  tone = 'light',
  lat,
  lng,
}: {
  value?: string
  onChange: (value: string) => void
  name?: string
  placeholder?: string
  compact?: boolean
  tone?: 'light' | 'dark'
  lat?: number
  lng?: number
}) {
  const dark = tone === 'dark'
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState(value ?? '')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState<PlacePrediction[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    setQuery(value ?? '')
  }, [value])

  useEffect(() => {
    const next = (query ?? '').trim()
    if (next.length < 2) {
      setPredictions([])
      setLoading(false)
      return
    }

    const timer = window.setTimeout(() => {
      setLoading(true)
      void searchPlaces({ data: { input: next, lat, lng } })
        .then((results) => {
          setPredictions(results)
          setActiveIndex(-1)
        })
        .catch(() => {
          setPredictions([])
        })
        .finally(() => setLoading(false))
    }, 220)

    return () => window.clearTimeout(timer)
  }, [query, lat, lng])

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  function selectPlace(prediction: PlacePrediction) {
    const city = cityNameFromPlace(prediction.description)
    setQuery(prediction.description)
    onChange(city)
    setPredictions([])
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <div className={`flex items-center gap-3 ${compact ? '' : 'min-h-16'}`}>
        {compact ? null : (
          <MapPin size={16} className="shrink-0 text-ploy-accent-tertiary" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1">
          {compact ? null : <span className="typography-eyebrow block">Where</span>}
          <input
            name={name}
            value={query ?? ''}
            autoComplete="off"
            aria-label="City or location"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-expanded={open && predictions.length > 0}
            placeholder={placeholder}
            className={`w-full bg-transparent outline-none ${
              dark
                ? 'text-white placeholder:text-white/45'
                : 'placeholder:text-ploy-text-secondary'
            } ${compact ? 'min-h-14 text-base' : 'mt-1 text-sm'}`}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              const next = event.target.value
              setQuery(next)
              onChange(cityNameFromPlace(next))
              setOpen(true)
            }}
            onKeyDown={(event) => {
              if (!open || predictions.length === 0) return
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                setActiveIndex((index) => (index + 1) % predictions.length)
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault()
                setActiveIndex((index) => (index - 1 + predictions.length) % predictions.length)
              }
              if (event.key === 'Enter' && activeIndex >= 0) {
                event.preventDefault()
                selectPlace(predictions[activeIndex])
              }
              if (event.key === 'Escape') {
                setOpen(false)
              }
            }}
          />
        </span>
      </div>

      {open && (loading || predictions.length > 0) ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-2xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 py-2 text-ploy-text-primary shadow-[var(--shadow-lift)]"
        >
          {loading && predictions.length === 0 ? (
            <li className="px-4 py-2 text-sm text-ploy-text-secondary">Searching places…</li>
          ) : null}
          {predictions.map((prediction, index) => (
            <li key={prediction.placeId} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm ${
                  index === activeIndex ? 'bg-ploy-background-secondary' : 'hover:bg-ploy-background-secondary'
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectPlace(prediction)}
              >
                <MapPin size={15} className="mt-0.5 shrink-0 text-ploy-accent-tertiary" />
                <span>{prediction.description}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
