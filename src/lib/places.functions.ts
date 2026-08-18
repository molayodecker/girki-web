import { createServerFn } from '@tanstack/react-start'

export type PlacePrediction = {
  description: string
  placeId: string
}

type GoogleAutocompleteResponse = {
  status: string
  predictions?: Array<{
    description: string
    place_id: string
  }>
}

function mapsApiKey() {
  return process.env.GOOGLE_MAPS_API_KEY ?? process.env.VITE_GOOGLE_MAPS_API_KEY
}

function numberFrom(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

export const searchPlaces = createServerFn({ method: 'GET' })
  .validator((data: unknown) => {
    const input =
      typeof data === 'object' && data !== null && 'input' in data
        ? String((data as { input: unknown }).input)
        : ''
    const payload = data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
    return {
      input,
      lat: numberFrom(payload.lat),
      lng: numberFrom(payload.lng),
    }
  })
  .handler(async ({ data }) => {
    const input = data.input.trim()
    if (input.length < 2) return [] as PlacePrediction[]

    const key = mapsApiKey()
    if (!key) return [] as PlacePrediction[]

    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', input)
    url.searchParams.set('types', '(cities)')
    url.searchParams.set('language', 'en')
    url.searchParams.set('key', key)
    if (data.lat != null && data.lng != null) {
      url.searchParams.set('location', `${data.lat},${data.lng}`)
      url.searchParams.set('radius', '80000')
    }

    const response = await fetch(url)
    if (!response.ok) return [] as PlacePrediction[]

    const json = (await response.json()) as GoogleAutocompleteResponse
    if (json.status !== 'OK' || !json.predictions) return [] as PlacePrediction[]

    return json.predictions.slice(0, 6).map((prediction) => ({
      description: prediction.description,
      placeId: prediction.place_id,
    }))
  })

type GeocodeComponent = {
  long_name: string
  short_name: string
  types: string[]
}

type GoogleGeocodeResponse = {
  status: string
  results?: Array<{
    formatted_address: string
    address_components: GeocodeComponent[]
  }>
}

export type ReverseGeocodeResult = {
  city: string
  label: string
}

function componentName(components: GeocodeComponent[], type: string) {
  return components.find((component) => component.types.includes(type))?.long_name
}

export const reverseGeocode = createServerFn({ method: 'GET' })
  .validator((data: unknown) => {
    const payload = data && typeof data === 'object' ? (data as Record<string, unknown>) : {}
    const lat = numberFrom(payload.lat)
    const lng = numberFrom(payload.lng)
    if (lat == null || lng == null) {
      throw new Error('lat and lng are required')
    }
    return { lat, lng }
  })
  .handler(async ({ data }): Promise<ReverseGeocodeResult | null> => {
    const key = mapsApiKey()
    if (!key) return null

    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
    url.searchParams.set('latlng', `${data.lat},${data.lng}`)
    url.searchParams.set('language', 'en')
    url.searchParams.set('key', key)

    const response = await fetch(url)
    if (!response.ok) return null

    const json = (await response.json()) as GoogleGeocodeResponse
    if (json.status !== 'OK' || !json.results?.[0]) return null

    const result = json.results.find((item) =>
      item.address_components.some((component) =>
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_2'),
      ),
    ) ?? json.results[0]

    const city =
      componentName(result.address_components, 'locality') ||
      componentName(result.address_components, 'sublocality') ||
      componentName(result.address_components, 'administrative_area_level_2') ||
      componentName(result.address_components, 'administrative_area_level_1') ||
      cityNameFromPlace(result.formatted_address)

    const country = componentName(result.address_components, 'country')
    const label = country ? `${city}, ${country}` : city

    return { city, label }
  })

export function cityNameFromPlace(place: string) {
  return place.split(',')[0]?.trim() || place
}
