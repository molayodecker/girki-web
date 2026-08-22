import type { GirkiShapeId } from '../../data/patterns'
import { girkiShapes } from '../../data/patterns'

export default function GirkiShapeIcon({
  shape,
  alt = '',
  size = 72,
  className = '',
}: {
  shape: GirkiShapeId
  alt?: string
  size?: number
  className?: string
}) {
  return (
    <img
      src={girkiShapes[shape]}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
