import type { GirkiPatternId } from '../../data/patterns'
import { girkiPatternMeta, girkiPatterns } from '../../data/patterns'

/** Full-width decorative pattern field (hero bands, footer lead-in). */
export default function GirkiPatternBand({
  pattern = 'service',
  height = 'md',
  className = '',
  bleed = false,
}: {
  pattern?: Exclude<GirkiPatternId, 'borderStrip'>
  height?: 'sm' | 'md' | 'lg' | 'fill'
  className?: string
  /** Edge-to-edge band without rounding (footer, section caps). */
  bleed?: boolean
}) {
  const meta = girkiPatternMeta[pattern]
  const heightClass =
    height === 'sm'
      ? 'h-44 sm:h-52'
      : height === 'lg'
        ? 'h-60 sm:h-72'
        : height === 'fill'
          ? 'min-h-full'
          : 'h-52 sm:h-60'

  return (
    <div
      className={`girki-pattern-band ${bleed ? '' : ''} ${heightClass} ${className}`}
      style={{
        backgroundColor: meta.ground,
        backgroundImage: `url(${girkiPatterns[pattern]})`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${meta.tileWidth}px ${meta.tileHeight}px`,
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}
