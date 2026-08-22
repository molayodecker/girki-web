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

/** Native pixel size of each pattern PNG (uniform scale — never stretch one axis). */
export const girkiPatternNativeSize: Record<
  GirkiPatternId,
  { width: number; height: number }
> = {
  borderStrip: { width: 1024, height: 71 },
  service: { width: 1024, height: 512 },
  flavor: { width: 1024, height: 512 },
  woven: { width: 1024, height: 512 },
  gathering: { width: 1024, height: 512 },
}

/** Display scale for field patterns (256×128px tiles — dense, rich repeats). */
export const GIRKI_FIELD_TILE_SCALE = 0.25

/** Border strip reads better at half native width (512×71px tiles). */
export const GIRKI_BORDER_TILE_SCALE = 0.5

export const girkiPatternMeta: Record<
  GirkiPatternId,
  { ground: string; tileWidth: number; tileHeight: number }
> = {
  borderStrip: {
    ground: girkiBrand.charcoal,
    tileWidth: girkiPatternNativeSize.borderStrip.width * GIRKI_BORDER_TILE_SCALE,
    tileHeight: girkiPatternNativeSize.borderStrip.height * GIRKI_BORDER_TILE_SCALE,
  },
  service: {
    ground: girkiBrand.charcoal,
    tileWidth: girkiPatternNativeSize.service.width * GIRKI_FIELD_TILE_SCALE,
    tileHeight: girkiPatternNativeSize.service.height * GIRKI_FIELD_TILE_SCALE,
  },
  flavor: {
    ground: girkiBrand.cream,
    tileWidth: girkiPatternNativeSize.flavor.width * GIRKI_FIELD_TILE_SCALE,
    tileHeight: girkiPatternNativeSize.flavor.height * GIRKI_FIELD_TILE_SCALE,
  },
  woven: {
    ground: girkiBrand.palm,
    tileWidth: girkiPatternNativeSize.woven.width * GIRKI_FIELD_TILE_SCALE,
    tileHeight: girkiPatternNativeSize.woven.height * GIRKI_FIELD_TILE_SCALE,
  },
  gathering: {
    ground: girkiBrand.plum,
    tileWidth: girkiPatternNativeSize.gathering.width * GIRKI_FIELD_TILE_SCALE,
    tileHeight: girkiPatternNativeSize.gathering.height * GIRKI_FIELD_TILE_SCALE,
  },
}

export function girkiPatternBackgroundStyle(
  pattern: GirkiPatternId,
  repeat: 'repeat' | 'repeat-x' = 'repeat',
) {
  const meta = girkiPatternMeta[pattern]
  return {
    backgroundColor: meta.ground,
    backgroundImage: `url(${girkiPatterns[pattern]})`,
    backgroundRepeat: repeat,
    backgroundSize: `${meta.tileWidth}px ${meta.tileHeight}px`,
    backgroundPosition: 'top left',
  }
}
