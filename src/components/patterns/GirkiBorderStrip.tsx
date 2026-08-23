import { girkiPatternMeta, girkiPatterns } from '../../data/patterns'

/** SweepSouth-style repeating icon strip between sections. */
export default function GirkiBorderStrip({
  className = '',
}: {
  className?: string
}) {
  const meta = girkiPatternMeta.borderStrip

  return (
    <div
      className={`girki-border-strip w-full overflow-hidden leading-none ${className}`}
      style={{
        height: meta.tileHeight,
        backgroundColor: meta.ground,
        backgroundImage: `url(${girkiPatterns.borderStrip})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: `${meta.tileWidth}px 100%`,
        backgroundPosition: 'center',
      }}
      aria-hidden="true"
    />
  )
}
