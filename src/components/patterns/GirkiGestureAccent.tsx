import type { CSSProperties, ReactNode } from 'react'
import type { GirkiShapeId } from '../../data/patterns'
import { girkiBrand } from '../../data/patterns'

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

export const girkiGestureColor = girkiBrand.plum

const stroke = '5px'

/**
 * Solid plum CSS gestures — readable on photography without PNG mask artifacts.
 * One per card: arc, circle, drop, or cloche silhouette.
 */
export default function GirkiGestureAccent({
  shape,
  size = '12rem',
  anchor = 'bottom-right',
  color = girkiGestureColor,
  opacity = 0.62,
  rotate = 0,
  pushX = '0%',
  pushY = '0%',
  className = '',
}: {
  shape: GirkiShapeId
  size?: string
  anchor?: CropAnchor
  color?: string
  opacity?: number
  rotate?: number
  pushX?: string
  pushY?: string
  className?: string
}) {
  const transform = `${anchorTransform[anchor]} translate(${pushX}, ${pushY})${rotate ? ` rotate(${rotate}deg)` : ''}`

  const wrapperStyle: CSSProperties = {
    width: size,
    height: size,
    opacity,
    transform,
  }

  const shell = (children: ReactNode, aspect?: string) => (
    <div
      className={`pointer-events-none absolute z-[1] flex items-center justify-center ${anchorPosition[anchor]} ${className}`}
      style={{
        ...wrapperStyle,
        aspectRatio: aspect,
        height: aspect ? undefined : size,
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  )

  if (shape === 'conversationArc') {
    return shell(
      <div
        className="h-full w-full rounded-t-full"
        style={{ borderTop: `${stroke} solid ${color}` }}
      />,
      '2.2 / 1',
    )
  }

  if (shape === 'plate') {
    return shell(
      <div
        className="h-full w-full rounded-full"
        style={{ border: `${stroke} solid ${color}` }}
      />,
    )
  }

  if (shape === 'flameDrop') {
    return shell(
      <div
        className="h-[88%] w-[62%]"
        style={{
          backgroundColor: color,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        }}
      />,
    )
  }

  if (shape === 'cloche') {
    return shell(
      <div className="flex h-full w-full flex-col items-center justify-end pb-[6%]">
        <div
          className="mb-[3%] rounded-full"
          style={{
            width: '14%',
            height: '14%',
            backgroundColor: color,
          }}
        />
        <div
          className="w-[78%] rounded-t-full"
          style={{
            height: '58%',
            backgroundColor: color,
          }}
        />
        <div
          className="mt-[2%] rounded-full"
          style={{
            width: '86%',
            height: stroke,
            backgroundColor: color,
          }}
        />
      </div>,
    )
  }

  // Fallback: simple circle ring
  return shell(
    <div
      className="h-full w-full rounded-full"
      style={{ border: `${stroke} solid ${color}` }}
    />,
  )
}
