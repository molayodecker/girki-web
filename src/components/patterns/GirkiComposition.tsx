import type { GirkiShapeId } from '../../data/patterns'
import { girkiBrand, girkiShapes } from '../../data/patterns'

export type GirkiCompositionId = 'gathering' | 'feast' | 'tableRhythm' | 'celebration'

type MotifCell = {
  shape: GirkiShapeId
  x: string
  y: string
  size: string
  opacity?: number
  rotate?: number
  /** Soft color wash for accent variation (Feast gold/terracotta). */
  tint?: string
}

type CompositionSpec = {
  ground: string
  cellWidth: number
  cellHeight: number
  blend: 'screen' | 'multiply' | 'normal'
  cells: MotifCell[]
}

/** True repeat compositions assembled from existing Girki shape PNGs. */
export const girkiCompositionSpecs: Record<GirkiCompositionId, CompositionSpec> = {
  gathering: {
    ground: girkiBrand.plum,
    cellWidth: 220,
    cellHeight: 200,
    blend: 'screen',
    cells: [
      { shape: 'plate', x: '8%', y: '18%', size: '58%', opacity: 0.85 },
      { shape: 'conversationArc', x: '48%', y: '6%', size: '48%', opacity: 0.75, rotate: -6 },
      { shape: 'wovenDiamond', x: '62%', y: '58%', size: '28%', opacity: 0.7 },
    ],
  },
  feast: {
    ground: girkiBrand.charcoal,
    cellWidth: 180,
    cellHeight: 170,
    blend: 'screen',
    cells: [
      { shape: 'cloche', x: '10%', y: '12%', size: '70%', opacity: 0.9, tint: girkiBrand.terracotta },
      { shape: 'cloche', x: '52%', y: '28%', size: '55%', opacity: 0.75, tint: girkiBrand.saffron },
      { shape: 'flameDrop', x: '78%', y: '8%', size: '22%', opacity: 0.65 },
    ],
  },
  tableRhythm: {
    ground: girkiBrand.palm,
    cellWidth: 200,
    cellHeight: 190,
    blend: 'screen',
    cells: [
      { shape: 'tableArch', x: '6%', y: '8%', size: '52%', opacity: 0.8 },
      { shape: 'plate', x: '42%', y: '28%', size: '46%', opacity: 0.75 },
      { shape: 'wovenDiamond', x: '18%', y: '58%', size: '30%', opacity: 0.7 },
      { shape: 'tableArch', x: '68%', y: '52%', size: '38%', opacity: 0.65, rotate: 180 },
    ],
  },
  celebration: {
    ground: girkiBrand.plum,
    cellWidth: 260,
    cellHeight: 240,
    blend: 'screen',
    cells: [
      { shape: 'cloche', x: '-8%', y: '20%', size: '62%', opacity: 0.7 },
      { shape: 'plate', x: '48%', y: '-12%', size: '55%', opacity: 0.65 },
      { shape: 'flameDrop', x: '72%', y: '48%', size: '28%', opacity: 0.8 },
      { shape: 'wovenDiamond', x: '22%', y: '68%', size: '26%', opacity: 0.55 },
      { shape: 'conversationArc', x: '58%', y: '62%', size: '42%', opacity: 0.5, rotate: 12 },
    ],
  },
}

function MotifTile({
  spec,
  width,
  height,
}: {
  spec: CompositionSpec
  width: number
  height: number
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{ width, height, mixBlendMode: spec.blend }}
      aria-hidden="true"
    >
      {spec.cells.map((cell, index) => (
        <div
          key={`${cell.shape}-${index}`}
          className="absolute"
          style={{
            left: cell.x,
            top: cell.y,
            width: cell.size,
            height: cell.size,
            opacity: cell.opacity ?? 0.8,
            transform: cell.rotate ? `rotate(${cell.rotate}deg)` : undefined,
          }}
        >
          <img
            src={girkiShapes[cell.shape]}
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
          />
          {cell.tint ? (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: cell.tint,
                mixBlendMode: 'color',
                opacity: 0.45,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  )
}

/**
 * Sparing, editorial Girki pattern field — shapes tiled into a true composition,
 * not standalone icons. Parent should set overflow/size.
 */
export default function GirkiComposition({
  composition = 'gathering',
  className = '',
  opacity = 1,
  scale = 1,
}: {
  composition?: GirkiCompositionId
  className?: string
  opacity?: number
  /** Scale the motif cell size (1 = default). */
  scale?: number
}) {
  const spec = girkiCompositionSpecs[composition]
  const cellW = Math.round(spec.cellWidth * scale)
  const cellH = Math.round(spec.cellHeight * scale)
  // Enough tiles to cover wide viewports without feeling sparse.
  const cols = 8
  const rows = 4
  const tiles = Array.from({ length: cols * rows }, (_, i) => i)

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ backgroundColor: spec.ground, opacity }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 flex flex-wrap content-start"
        style={{ width: cellW * cols, height: cellH * rows }}
      >
        {tiles.map((i) => (
          <MotifTile key={i} spec={spec} width={cellW} height={cellH} />
        ))}
      </div>
    </div>
  )
}
