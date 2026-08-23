import type { CSSProperties } from 'react'
import type { GirkiShapeId } from '../../data/patterns'
import { girkiBrand, girkiShapes } from '../../data/patterns'

type CropAnchor =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-center'
  | 'top-center'

const anchorTransform: Record<CropAnchor, string> = {
  'top-left': 'translate(-28%, -32%)',
  'top-right': 'translate(28%, -32%)',
  'bottom-left': 'translate(-28%, 32%)',
  'bottom-right': 'translate(28%, 32%)',
  'center-left': 'translate(-40%, -50%)',
  'center-right': 'translate(40%, -50%)',
  'bottom-center': 'translate(-50%, 42%)',
  'top-center': 'translate(-50%, -42%)',
}

const anchorPosition: Record<CropAnchor, string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0',
  'center-left': 'top-1/2 left-0',
  'center-right': 'top-1/2 right-0',
  'bottom-center': 'bottom-0 left-1/2',
  'top-center': 'top-0 left-1/2',
}

/**
 * Oversized Girki shape meant to be cropped by its parent overflow.
 * With `fill`, the PNG alpha masks a solid brand color (plum on photo cards).
 */
export default function GirkiCroppedShape({
  shape,
  size = '42rem',
  anchor = 'bottom-right',
  opacity = 0.55,
  rotate = 0,
  blend = 'screen',
  fill,
  pushX = '0%',
  pushY = '0%',
  className = '',
}: {
  shape: GirkiShapeId
  size?: string
  anchor?: CropAnchor
  opacity?: number
  rotate?: number
  blend?: 'screen' | 'normal' | 'lighten' | 'multiply'
  /** Solid brand color — shape silhouette from PNG mask. */
  fill?: string
  pushX?: string
  pushY?: string
  className?: string
}) {
  const transform = `${anchorTransform[anchor]} translate(${pushX}, ${pushY})${rotate ? ` rotate(${rotate}deg)` : ''}`

  if (fill) {
    const maskStyle = {
      width: size,
      height: size,
      opacity,
      backgroundColor: fill,
      transform,
      maskImage: `url(${girkiShapes[shape]})`,
      WebkitMaskImage: `url(${girkiShapes[shape]})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    } as CSSProperties

    return (
      <div
        className={`pointer-events-none absolute z-0 ${anchorPosition[anchor]} ${className}`}
        style={maskStyle}
        aria-hidden="true"
      />
    )
  }

  const style = {
    width: size,
    height: size,
    opacity,
    mixBlendMode: blend,
    transform,
  } as CSSProperties

  return (
    <img
      src={girkiShapes[shape]}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none absolute z-0 max-w-none select-none object-contain ${anchorPosition[anchor]} ${className}`}
      style={style}
    />
  )
}

export const girkiGestureColor = girkiBrand.plum
