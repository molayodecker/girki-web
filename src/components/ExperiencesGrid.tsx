import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { experiences } from '../data/home'
import type { GirkiShapeId } from '../data/patterns'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'
import GirkiPatternFill from './patterns/GirkiPatternFill'

type Accent = {
  shape: GirkiShapeId
  anchor: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center-right'
  size: string
  /** Keep accents secondary — typically 0.18–0.35 over photography. */
  opacity: number
  /** Optional narrow pattern edge band (never a full-card fill). */
  edge?: 'top' | 'bottom' | 'left' | 'right'
  edgePattern?: 'woven' | 'gathering' | 'service' | 'flavor'
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
 * Photo-first occasion cards. Patterns are secondary accents only (~20% visual weight).
 * Never replace photography with full-card pattern fills.
 */
const accents: Accent[] = [
  {
    shape: 'plate',
    anchor: 'bottom-right',
    size: '18rem',
    opacity: 0.28,
  },
  {
    shape: 'wovenDiamond',
    anchor: 'top-right',
    size: '11rem',
    opacity: 0.22,
    edge: 'top',
    edgePattern: 'woven',
  },
  {
    shape: 'conversationArc',
    anchor: 'center-right',
    size: '14rem',
    opacity: 0.26,
  },
  {
    shape: 'flameDrop',
    anchor: 'top-right',
    size: '10rem',
    opacity: 0.24,
  },
  {
    shape: 'tableArch',
    anchor: 'bottom-left',
    size: '12rem',
    opacity: 0.22,
    edge: 'left',
    edgePattern: 'service',
  },
  {
    shape: 'cloche',
    anchor: 'bottom-left',
    size: '14rem',
    opacity: 0.26,
  },
]

const edgeClass = {
  top: 'inset-x-0 top-0 h-10',
  bottom: 'inset-x-0 bottom-0 h-10',
  left: 'inset-y-0 left-0 w-10',
  right: 'inset-y-0 right-0 w-10',
} as const

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

            {accent?.edge && accent.edgePattern ? (
              <div
                className={`absolute z-[1] overflow-hidden opacity-55 ${edgeClass[accent.edge]}`}
                aria-hidden="true"
              >
                <GirkiPatternFill pattern={accent.edgePattern} scale={0.55} />
                <div
                  className={`absolute inset-0 ${
                    accent.edge === 'top'
                      ? 'bg-linear-to-b from-transparent to-black/40'
                      : accent.edge === 'bottom'
                        ? 'bg-linear-to-t from-transparent to-black/40'
                        : accent.edge === 'left'
                          ? 'bg-linear-to-r from-transparent to-black/50'
                          : 'bg-linear-to-l from-transparent to-black/50'
                  }`}
                />
              </div>
            ) : null}

            {accent ? (
              <GirkiCroppedShape
                shape={accent.shape}
                anchor={accent.anchor}
                size={accent.size}
                opacity={accent.opacity}
                blend="screen"
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
