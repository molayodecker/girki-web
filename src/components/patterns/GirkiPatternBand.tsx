import type { GirkiPatternId } from '../../data/patterns'
import { girkiPatternBackgroundStyle, girkiPatternMeta } from '../../data/patterns'

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
  const tileRows =
    height === 'sm' ? 1 : height === 'lg' ? 3 : height === 'fill' ? 1 : 2
  const bandHeight =
    height === 'fill' ? undefined : meta.tileHeight * tileRows

  return (
    <div
      className={`girki-pattern-band w-full overflow-hidden ${bleed ? '' : ''} ${className}`}
      style={{
        ...girkiPatternBackgroundStyle(pattern, 'repeat'),
        height: bandHeight,
        minHeight: height === 'fill' ? meta.tileHeight * 2 : undefined,
      }}
      aria-hidden="true"
    />
  )
}
