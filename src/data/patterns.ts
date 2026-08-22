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
  borderStrip: { ground: girkiBrand.charcoal, tileWidth: 960, tileHeight: 68 },
  service: { ground: girkiBrand.charcoal, tileWidth: 960, tileHeight: 480 },
  flavor: { ground: girkiBrand.cream, tileWidth: 960, tileHeight: 480 },
  woven: { ground: girkiBrand.palm, tileWidth: 960, tileHeight: 480 },
  gathering: { ground: girkiBrand.plum, tileWidth: 960, tileHeight: 480 },
}
