import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { experiences } from '../data/home'
import { girkiBrand } from '../data/patterns'
import GirkiGestureAccent from './patterns/GirkiGestureAccent'

type StrokeAccent = {
  shape: 'conversationArc' | 'plate' | 'tableArch' | 'wovenDiamond' | 'cloche'
  anchor: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  color: string
  size: string
  opacity: number
  pushX?: string
  pushY?: string
  rotate?: number
}

const layout = [
  'md:col-span-2 md:row-span-2 md:min-h-[28rem]',
  'md:col-span-1 md:min-h-[14rem]',
  'md:col-span-1 md:min-h-[14rem]',
  'md:col-span-2 md:min-h-[14rem]',
  'md:col-span-1 md:min-h-[14rem]',
  'md:col-span-1 md:min-h-[14rem]',
] as const

/**
 * Photo-first cards with two Girki strokes each (primary + secondary).
 * Diagonal corner pairs — cropped at edges, clear of titles and faces.
 */
const cardStrokes: StrokeAccent[][] = [
  [
    {
      shape: 'conversationArc',
      anchor: 'bottom-right',
      color: girkiBrand.terracotta,
      size: '17rem',
      opacity: 0.72,
      pushX: '12%',
      pushY: '14%',
    },
    {
      shape: 'plate',
      anchor: 'top-left',
      color: girkiBrand.saffron,
      size: '9rem',
      opacity: 0.52,
      pushX: '-14%',
      pushY: '-12%',
    },
  ],
  [
    {
      shape: 'wovenDiamond',
      anchor: 'top-right',
      color: girkiBrand.saffron,
      size: '10rem',
      opacity: 0.62,
      pushX: '10%',
      pushY: '-8%',
    },
    {
      shape: 'conversationArc',
      anchor: 'bottom-left',
      color: girkiBrand.cream,
      size: '8rem',
      opacity: 0.5,
      pushX: '-12%',
      pushY: '14%',
      rotate: 90,
    },
  ],
  [
    {
      shape: 'conversationArc',
      anchor: 'top-right',
      color: girkiBrand.cream,
      size: '13rem',
      opacity: 0.68,
      pushX: '8%',
      pushY: '-10%',
      rotate: 180,
    },
    {
      shape: 'plate',
      anchor: 'bottom-left',
      color: girkiBrand.plum,
      size: '8rem',
      opacity: 0.55,
      pushX: '-14%',
      pushY: '16%',
    },
  ],
  [
    {
      shape: 'plate',
      anchor: 'bottom-right',
      color: girkiBrand.saffron,
      size: '12rem',
      opacity: 0.65,
      pushX: '10%',
      pushY: '12%',
    },
    {
      shape: 'conversationArc',
      anchor: 'top-left',
      color: girkiBrand.terracotta,
      size: '11rem',
      opacity: 0.58,
      pushX: '-16%',
      pushY: '-14%',
    },
  ],
  [
    {
      shape: 'tableArch',
      anchor: 'bottom-left',
      color: girkiBrand.saffron,
      size: '11rem',
      opacity: 0.6,
      pushX: '-8%',
      pushY: '10%',
    },
    {
      shape: 'wovenDiamond',
      anchor: 'top-right',
      color: girkiBrand.cream,
      size: '7rem',
      opacity: 0.48,
      pushX: '12%',
      pushY: '-10%',
    },
  ],
  [
    {
      shape: 'conversationArc',
      anchor: 'bottom-left',
      color: girkiBrand.terracotta,
      size: '15rem',
      opacity: 0.7,
      pushX: '-12%',
      pushY: '15%',
    },
    {
      shape: 'cloche',
      anchor: 'top-right',
      color: girkiBrand.saffron,
      size: '9rem',
      opacity: 0.52,
      pushX: '10%',
      pushY: '-8%',
    },
  ],
]

export default function ExperiencesGrid() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-fr">
      {experiences.map((experience, index) => {
        const strokes = cardStrokes[index] ?? []

        return (
          <Link
            key={experience.title}
            to="/request"
            className={`group relative min-h-80 overflow-hidden rounded-[1.4rem] ${layout[index]}`}
          >
            <img
              src={experience.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/28 to-black/5" />

            {strokes.map((stroke, strokeIndex) => (
              <GirkiGestureAccent
                key={`${stroke.shape}-${stroke.anchor}-${strokeIndex}`}
                shape={stroke.shape}
                anchor={stroke.anchor}
                color={stroke.color}
                size={stroke.size}
                opacity={stroke.opacity}
                pushX={stroke.pushX}
                pushY={stroke.pushY}
                rotate={stroke.rotate}
              />
            ))}

            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5 md:p-6">
              <span className="typography-eyebrow text-white/55">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                <ArrowUpRight size={18} />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <h3 className="font-heading text-2xl tracking-tight text-white md:text-3xl">
                {experience.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                {experience.copy}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
