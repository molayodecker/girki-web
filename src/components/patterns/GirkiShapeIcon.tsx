import type { GirkiShapeId } from '../../data/patterns'
import { girkiBrand, girkiShapes } from '../../data/patterns'

export default function GirkiShapeIcon({
  shape,
  alt = '',
  size = 72,
  className = '',
  well = true,
  wellColor = girkiBrand.charcoal,
}: {
  shape: GirkiShapeId
  alt?: string
  size?: number
  className?: string
  /** Dark well so PNG black backgrounds blend and colors read rich. */
  well?: boolean
  wellColor?: string
}) {
  const icon = (
    <img
      src={girkiShapes[shape]}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )

  if (!well) return icon

  const pad = Math.round(size * 0.22)
  return (
    <div
      className="inline-flex items-center justify-center rounded-[1.15rem] shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.06)]"
      style={{
        width: size + pad * 2,
        height: size + pad * 2,
        backgroundColor: wellColor,
      }}
    >
      {icon}
    </div>
  )
}
