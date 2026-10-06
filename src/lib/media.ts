/** Public girki-media R2 bucket (same as girki mobile `EXPO_PUBLIC_MEDIA_CDN`). */
const DEFAULT_CDN = 'https://pub-f9836d33623d4ccc996f95736e21e93b.r2.dev'

const CDN = (import.meta.env.VITE_MEDIA_CDN?.trim() || DEFAULT_CDN).replace(/\/+$/, '')

export function mediaCdnBase() {
  return CDN
}

export function mediaUrl(key: string) {
  const path = key.replace(/^\/+/, '')
  return `${CDN}/${path}`
}

const chefMediaSlug: Record<string, string> = {
  chidinma: 'chidinma-eze',
}

export function chefPhotoUrl(chefId: string) {
  const slug = chefMediaSlug[chefId] ?? chefId
  return mediaUrl(`chefs/${slug}.jpg`)
}

export function chefGalleryUrl(chefId: string, index: number) {
  const slug = chefMediaSlug[chefId] ?? chefId
  return mediaUrl(`chefs/${slug}/gallery-${index}.jpg`)
}

export function mealPhotoUrl(mealId: string) {
  return mediaUrl(`meals/${mealId}.jpg`)
}
