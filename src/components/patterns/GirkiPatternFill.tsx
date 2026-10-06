import type { GirkiPatternId } from '../../data/patterns'
import { girkiPatternMeta, girkiPatterns } from '../../data/patterns'

/** Full-bleed repeating pattern fill for cards, bands, and section grounds. */
export default function GirkiPatternFill({
  pattern = 'service',
  className = '',
  opacity = 1,
  scale = 1,
}: {
  pattern?: Exclude<GirkiPatternId, 'borderStrip'>
  className?: string
  opacity?: number
  /** Multiplier on tile size (1 = meta default). */
  scale?: number
}) {
  const meta = girkiPatternMeta[pattern]
  const w = Math.round(meta.tileWidth * scale)
  const h = Math.round(meta.tileHeight * scale)

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        backgroundColor: meta.ground,
        backgroundImage: `url(${girkiPatterns[pattern]})`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${w}px ${h}px`,
        backgroundPosition: 'center',
        opacity,
      }}
      aria-hidden="true"
    />
  )
}
