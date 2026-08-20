import { reverseGeocode } from './places.functions'
import type { UserLocation } from '../data/marketplace'

export function geolocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Location is blocked. Search a city instead, or allow access in the browser.'
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return 'We couldn’t read your position. Search a city instead.'
  }
  if (error.code === error.TIMEOUT) {
    return 'Finding your location took too long. Search a city instead.'
  }
  return 'We couldn’t access your location. Search a city instead.'
}

export async function detectUserLocation(): Promise<UserLocation> {
  if (!navigator.geolocation) {
    throw new Error('This browser doesn’t support location.')
  }

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
    // Coordinates still help chef matching if reverse geocode fails.
  }

  return { lat, lng, city, label }
}
