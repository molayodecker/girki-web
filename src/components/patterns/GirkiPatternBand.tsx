import type { GirkiPatternId } from '../../data/patterns'
import { girkiPatterns } from '../../data/patterns'

/** Full-width decorative pattern field (hero bands, footer lead-in). */
export default function GirkiPatternBand({
  pattern = 'service',
  height = 'md',
  className = '',
  overlay = false,
}: {
  pattern?: GirkiPatternId
  height?: 'sm' | 'md' | 'lg'
  className?: string
  overlay?: boolean
}) {
  const heightClass =
    height === 'sm' ? 'h-24 sm:h-28' : height === 'lg' ? 'h-40 sm:h-48' : 'h-32 sm:h-36'

  return (
    <div
      className={`relative w-full overflow-hidden ${heightClass} ${className}`}
      aria-hidden="true"
    >
      <img
        src={girkiPatterns[pattern]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {overlay ? <div className="absolute inset-0 bg-ploy-neutral-inverse/25" /> : null}
    </div>
  )
}
