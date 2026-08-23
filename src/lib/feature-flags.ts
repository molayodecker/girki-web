/**
 * Showcase chefs appear in marketing but are not bookable yet.
 * Clicks open their Instagram profile instead of the booking flow.
 */
export const SHOWCASE_ONLY_CHEFS = {
  nana: {
    instagramUrl: 'https://www.instagram.com/midunu/',
    label: 'Follow on Instagram',
  },
  youssef: {
    instagramUrl: 'https://www.instagram.com/lukedaleroberts/',
    label: 'Follow on Instagram',
  },
} as const

export type ShowcaseChefId = keyof typeof SHOWCASE_ONLY_CHEFS

export function isChefBookable(chefId: string) {
  return !(chefId in SHOWCASE_ONLY_CHEFS)
}

export function getChefInstagramUrl(chefId: string): string | undefined {
  if (!(chefId in SHOWCASE_ONLY_CHEFS)) return undefined
  return SHOWCASE_ONLY_CHEFS[chefId as ShowcaseChefId].instagramUrl
}

export function isShowcaseChef(chefId: string): chefId is ShowcaseChefId {
  return chefId in SHOWCASE_ONLY_CHEFS
}
