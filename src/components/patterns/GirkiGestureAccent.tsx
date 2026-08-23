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

/** Editorial stroke weight — visible on photography without becoming illustration. */
const stroke = '3.5px'

/**
 * CSS stroke gestures derived from Girki shapes. One per photo card:
 * thin, low-opacity, cropped at edges — never over faces or copy.
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
      '2.4 / 1',
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

  if (shape === 'tableArch') {
    return shell(
      <div className="flex h-full w-full flex-col items-center justify-end pb-[2%]">
        <div
          className="w-[88%] rounded-t-full"
          style={{
            height: '72%',
            borderTop: `${stroke} solid ${color}`,
            borderLeft: `${stroke} solid transparent`,
            borderRight: `${stroke} solid transparent`,
          }}
        />
        <div
          className="w-full rounded-full"
          style={{ height: stroke, backgroundColor: color }}
        />
      </div>,
    )
  }

  if (shape === 'wovenDiamond') {
    return shell(
      <div
        className="h-[58%] w-[58%] rotate-45"
        style={{ border: `${stroke} solid ${color}` }}
      />,
    )
  }

  if (shape === 'flameDrop') {
    return shell(
      <div
        className="h-[80%] w-[50%]"
        style={{
          border: `${stroke} solid ${color}`,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          backgroundColor: 'transparent',
        }}
      />,
      '3 / 4',
    )
  }

  if (shape === 'cloche') {
    return shell(
      <div className="flex h-full w-full flex-col items-center justify-end pb-[4%]">
        <div
          className="mb-[2%] rounded-full"
          style={{
            width: '12%',
            height: '12%',
            border: `${stroke} solid ${color}`,
            backgroundColor: 'transparent',
          }}
        />
        <div
          className="w-[76%] rounded-t-full"
          style={{
            height: '56%',
            borderTop: `${stroke} solid ${color}`,
            borderLeft: `${stroke} solid transparent`,
            borderRight: `${stroke} solid transparent`,
          }}
        />
        <div
          className="mt-[3%] w-[84%] rounded-full"
          style={{ height: stroke, backgroundColor: color }}
        />
      </div>,
    )
  }

  return shell(
    <div
      className="h-full w-full rounded-full"
      style={{ border: `${stroke} solid ${color}` }}
    />,
  )
}
