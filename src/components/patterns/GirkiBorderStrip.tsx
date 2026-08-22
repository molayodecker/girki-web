import { girkiPatterns } from '../../data/patterns'

/** SweepSouth-style repeating icon strip between sections. */
export default function GirkiBorderStrip({
  className = '',
  tone = 'light',
}: {
  className?: string
  /** light = cream page edge; dark = charcoal edge */
  tone?: 'light' | 'dark'
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${className}`}
      aria-hidden="true"
    >
      <img
        src={girkiPatterns.borderStrip}
        alt=""
        className={`block h-10 w-full min-w-full object-cover object-center sm:h-12 ${
          tone === 'dark' ? 'opacity-95' : 'opacity-100'
        }`}
      />
    </div>
  )
}
