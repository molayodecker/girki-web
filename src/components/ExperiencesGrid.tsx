import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { experiences } from '../data/home'
import type { GirkiShapeId } from '../data/patterns'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'

type Accent = {
  shape: GirkiShapeId
  anchor: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center-right'
  size: string
  opacity: number
  pushX?: string
  pushY?: string
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
 * Photo-first occasion cards — one geometric gesture max per card (~20% visual weight).
 * Patterns frame the experience; they do not become the experience.
 */
const accents: (Accent | null)[] = [
  {
    shape: 'plate',
    anchor: 'bottom-right',
    size: '24rem',
    opacity: 0.17,
    pushX: '20%',
    pushY: '24%',
  },
  null,
  {
    shape: 'conversationArc',
    anchor: 'bottom-right',
    size: '13rem',
    opacity: 0.19,
    pushX: '14%',
    pushY: '16%',
  },
  {
    shape: 'flameDrop',
    anchor: 'bottom-right',
    size: '9rem',
    opacity: 0.18,
    pushX: '12%',
    pushY: '14%',
  },
  null,
  {
    shape: 'cloche',
    anchor: 'bottom-left',
    size: '13rem',
    opacity: 0.2,
    pushX: '-10%',
    pushY: '20%',
  },
]

export default function ExperiencesGrid() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-fr">
      {experiences.map((experience, index) => {
        const accent = accents[index]

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

            {accent ? (
              <GirkiCroppedShape
                shape={accent.shape}
                anchor={accent.anchor}
                size={accent.size}
                opacity={accent.opacity}
                blend="screen"
                pushX={accent.pushX}
                pushY={accent.pushY}
              />
            ) : null}

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
