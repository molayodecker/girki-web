/** Girki pattern system (see Girki_Pattern_System.pdf). */
export const girkiBrand = {
  terracotta: '#B4462B',
  saffron: '#E0A02E',
  palm: '#2E5340',
  charcoal: '#201A16',
  cream: '#F5ECDE',
  plum: '#6B2F45',
} as const

export const girkiPatterns = {
  borderStrip: '/patterns/border-strip.png',
  service: '/patterns/pattern-service.png',
  flavor: '/patterns/pattern-flavor.png',
  woven: '/patterns/pattern-woven.png',
  gathering: '/patterns/pattern-gathering.png',
} as const

export const girkiShapes = {
  cloche: '/patterns/shapes/cloche.png',
  plate: '/patterns/shapes/plate.png',
  tableArch: '/patterns/shapes/table-arch.png',
  flameDrop: '/patterns/shapes/flame-drop.png',
  wovenDiamond: '/patterns/shapes/woven-diamond.png',
  cutleryBar: '/patterns/shapes/cutlery-bar.png',
  conversationArc: '/patterns/shapes/conversation-arc.png',
} as const

export type GirkiPatternId = keyof typeof girkiPatterns
export type GirkiShapeId = keyof typeof girkiShapes

/** Tile metadata for CSS background-repeat (assets are 1024×512 except border strip). */
export const girkiPatternMeta: Record<
  GirkiPatternId,
  { ground: string; tileWidth: number; tileHeight: number }
> = {
  borderStrip: { ground: girkiBrand.charcoal, tileWidth: 640, tileHeight: 88 },
  service: { ground: girkiBrand.charcoal, tileWidth: 640, tileHeight: 320 },
  flavor: { ground: girkiBrand.cream, tileWidth: 640, tileHeight: 320 },
  woven: { ground: girkiBrand.palm, tileWidth: 640, tileHeight: 320 },
  gathering: { ground: girkiBrand.plum, tileWidth: 640, tileHeight: 320 },
}

/**
 * Named composition IDs for the true shape-assembled pattern system.
 * Prefer GirkiComposition over inventing one-off treatments.
 */
export type GirkiCompositionId =
  | 'gathering'
  | 'feast'
  | 'tableRhythm'
  | 'celebration'

export const girkiCompositions: Record<
  GirkiCompositionId,
  { ground: string; shapes: readonly GirkiShapeId[]; note: string }
> = {
  gathering: {
    ground: girkiBrand.plum,
    shapes: ['plate', 'conversationArc', 'wovenDiamond'],
    note: 'Plate + conversation arc + woven diamond',
  },
  feast: {
    ground: girkiBrand.charcoal,
    shapes: ['cloche', 'flameDrop'],
    note: 'Repeating cloche domes with gold and terracotta accents',
  },
  tableRhythm: {
    ground: girkiBrand.palm,
    shapes: ['tableArch', 'plate', 'wovenDiamond'],
    note: 'Interlocking table arches with plates and diamonds',
  },
  celebration: {
    ground: girkiBrand.plum,
    shapes: ['cloche', 'plate', 'flameDrop', 'wovenDiamond', 'conversationArc'],
    note: 'Expressive partial forms with negative space',
  },
}
