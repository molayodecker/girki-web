import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { reverseGeocode } from '../lib/places.functions'
import type { UserLocation } from '../data/marketplace'

function geolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Location access is required to continue. Allow it in your browser, then try again.'
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'We couldn’t read your position. Check that location services are on, then try again.'
  }
  if (error.code === error.TIMEOUT) {
    return 'Finding your location took too long. Try again.'
  }
  return 'We couldn’t access your location. Try again to continue.'
}

export default function LocationAccessGate({
  onGranted,
}: {
  onGranted: (location: UserLocation) => void
}) {
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const started = useRef(false)

  async function locate() {
    if (!navigator.geolocation) {
      setBusy(false)
      setError('This browser doesn’t support location. Please use a current browser to continue.')
      return
    }

    setBusy(true)
    setError('')

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60_000,
        })
      })

      const lat = position.coords.latitude
      const lng = position.coords.longitude
      let city = ''
      let label = 'Your location'

      try {
        const place = await reverseGeocode({ data: { lat, lng } })
        if (place?.city) {
          city = place.city
          label = place.label
        }
      } catch {
        // Coordinates are enough to match local chefs if reverse geocode fails.
      }

      onGranted({ lat, lng, city, label })
    } catch (caught) {
      setBusy(false)
      if (caught && typeof caught === 'object' && 'code' in caught) {
        setError(geolocationErrorMessage(caught as GeolocationPositionError))
        return
      }
      setError('We couldn’t access your location. Try again to continue.')
    }
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    void locate()
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <p className="typography-eyebrow">Local chefs</p>
      <h1 className="display-title mt-4 text-4xl sm:text-5xl">Share your location to continue</h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ploy-text-secondary">
        Girki uses your position to match chefs who can cook at your table. Allow location access
        before you start the request.
      </p>

      <div className="mt-12 rounded-3xl border border-ploy-border-primary bg-ploy-neutral-primary-s0 p-8">
        <div className="flex items-start gap-4">
          <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-ploy-background-secondary text-ploy-accent-tertiary">
            <MapPin size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-2xl tracking-tight">Find chefs near you</p>
            <p className="mt-2 text-sm leading-relaxed text-ploy-text-secondary">
              Your coordinates stay on this device for matching. You can still change the city after
              we detect it.
            </p>
          </div>
        </div>

        {error ? <p className="mt-6 text-sm text-ploy-accent-secondary">{error}</p> : null}

        <button
          type="button"
          className="btn btn-primary mt-8 min-h-12 px-8"
          disabled={busy}
          onClick={() => void locate()}
        >
          {busy ? 'Finding your location…' : 'Allow location access'}
        </button>
      </div>
    </div>
  )
}
