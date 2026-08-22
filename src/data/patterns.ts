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
  borderStrip: { ground: girkiBrand.charcoal, tileWidth: 640, tileHeight: 44 },
  service: { ground: girkiBrand.charcoal, tileWidth: 640, tileHeight: 320 },
  flavor: { ground: girkiBrand.cream, tileWidth: 640, tileHeight: 320 },
  woven: { ground: girkiBrand.palm, tileWidth: 640, tileHeight: 320 },
  gathering: { ground: girkiBrand.plum, tileWidth: 640, tileHeight: 320 },
}

/**
 * Four reusable Girki master compositions built from existing tiles + shapes.
 * Prefer these over inventing one-off pattern treatments per page.
 */
export const girkiCompositions = {
  gathering: {
    pattern: 'gathering' as const,
    ground: girkiBrand.plum,
    shapes: ['plate', 'conversationArc', 'flameDrop'] as const,
  },
  table: {
    pattern: 'woven' as const,
    ground: girkiBrand.palm,
    shapes: ['tableArch', 'wovenDiamond'] as const,
  },
  celebration: {
    pattern: 'flavor' as const,
    ground: girkiBrand.cream,
    shapes: ['cloche', 'plate', 'wovenDiamond'] as const,
  },
  quiet: {
    pattern: 'service' as const,
    ground: girkiBrand.charcoal,
    shapes: ['conversationArc'] as const,
  },
} as const

export type GirkiCompositionId = keyof typeof girkiCompositions
