import { girkiPatternBackgroundStyle, girkiPatternMeta } from '../../data/patterns'

/** SweepSouth-style repeating icon strip between sections. */
export default function GirkiBorderStrip({
  className = '',
}: {
  className?: string
}) {
  const { tileHeight } = girkiPatternMeta.borderStrip

  return (
    <div
      className={`girki-border-strip w-full overflow-hidden leading-none ${className}`}
      style={{
        ...girkiPatternBackgroundStyle('borderStrip', 'repeat-x'),
        height: tileHeight,
      }}
      aria-hidden="true"
    />
  )
}
