export type GirkiMarkTone = 'terracotta' | 'dark' | 'charcoal'

const src: Record<GirkiMarkTone, string> = {
  terracotta: '/brand/girki-mark-terracotta.png',
  dark: '/brand/girki-mark-dark.jpg',
  charcoal: '/brand/girki-mark-charcoal.jpg',
}

export default function GirkiMark({
  tone = 'terracotta',
  size = 36,
  className = '',
}: {
  tone?: GirkiMarkTone
  size?: number
  className?: string
}) {
  return (
    <img
      src={src[tone]}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`}
      decoding="async"
    />
  )
}
