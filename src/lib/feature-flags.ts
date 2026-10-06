/**
 * Showcase chefs appear in marketing but are not bookable yet.
 *
 * Toggle with SHOWCASE_ONLY_CHEFS=true in .env / Vercel.
 */
export const SHOWCASE_CHEFS = {
  ama: { label: 'Coming soon' },
  chidinma: { label: 'Coming soon' },
  kwame: { label: 'Coming soon' },
  yaw: { label: 'Coming soon' },
  sophie: { label: 'Coming soon' },
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

export function getChefInstagramUrl(_chefId: string): string | undefined {
  return undefined
}

export function getShowcaseChefLabel(chefId: string): string | undefined {
  if (!isShowcaseChef(chefId)) return undefined
  return SHOWCASE_CHEFS[chefId].label
}

export function isShowcaseChef(chefId: string): chefId is ShowcaseChefId {
  if (!isShowcaseOnlyChefsEnabled()) return false
  return chefId in SHOWCASE_CHEFS
}
