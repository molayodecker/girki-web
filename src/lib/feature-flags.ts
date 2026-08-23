/**
 * Showcase chefs appear in marketing but are not bookable yet.
 * When an Instagram URL is set, clicks open that profile instead of booking.
 *
 * Toggle with SHOWCASE_ONLY_CHEFS=true in .env / Vercel.
 */
export const SHOWCASE_CHEFS = {
  nana: {
    instagramUrl: 'https://www.instagram.com/midunu/',
    label: 'Follow on Instagram',
  },
  youssef: {
    instagramUrl: 'https://www.instagram.com/lukedaleroberts/',
    label: 'Follow on Instagram',
  },
  amani: {
    label: 'Coming soon',
  },
  zuri: {
    label: 'Coming soon',
  },
  kofi: {
    label: 'Coming soon',
  },
  ibrahim: {
    label: 'Coming soon',
  },
} as const

export type ShowcaseChefId = keyof typeof SHOWCASE_CHEFS

function isTruthyEnv(value: string | undefined) {
  return value === 'true' || value === '1'
}

export function isShowcaseOnlyChefsEnabled() {
  if (import.meta.env.VITE_SHOWCASE_ONLY_CHEFS !== undefined) {
    return isTruthyEnv(String(import.meta.env.VITE_SHOWCASE_ONLY_CHEFS))
  }

  return isTruthyEnv(process.env.SHOWCASE_ONLY_CHEFS)
}

export function isChefBookable(chefId: string) {
  if (!isShowcaseOnlyChefsEnabled()) return true
  return !(chefId in SHOWCASE_CHEFS)
}

export function getChefInstagramUrl(chefId: string): string | undefined {
  if (!isShowcaseOnlyChefsEnabled()) return undefined
  if (!(chefId in SHOWCASE_CHEFS)) return undefined
  const config = SHOWCASE_CHEFS[chefId as ShowcaseChefId]
  return 'instagramUrl' in config ? config.instagramUrl : undefined
}

export function getShowcaseChefLabel(chefId: string): string | undefined {
  if (!isShowcaseChef(chefId)) return undefined
  return SHOWCASE_CHEFS[chefId].label
}

export function isShowcaseChef(chefId: string): chefId is ShowcaseChefId {
  if (!isShowcaseOnlyChefsEnabled()) return false
  return chefId in SHOWCASE_CHEFS
}
