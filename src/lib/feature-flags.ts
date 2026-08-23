/**
 * Showcase chefs appear in marketing but are not bookable yet.
 * Clicks open their Instagram profile instead of the booking flow.
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
  return SHOWCASE_CHEFS[chefId as ShowcaseChefId].instagramUrl
}

export function isShowcaseChef(chefId: string): chefId is ShowcaseChefId {
  if (!isShowcaseOnlyChefsEnabled()) return false
  return chefId in SHOWCASE_CHEFS
}
