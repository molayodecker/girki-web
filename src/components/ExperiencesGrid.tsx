import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { experiences } from '../data/home'
import type { GirkiPatternId, GirkiShapeId } from '../data/patterns'
import { girkiBrand } from '../data/patterns'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'
import GirkiPatternFill from './patterns/GirkiPatternFill'

type ExperienceTreatment =
  | {
      kind: 'photo'
      shape?: GirkiShapeId
      shapeAnchor?: 'bottom-right' | 'bottom-left' | 'top-right' | 'center-right'
      shapeSize?: string
    }
  | {
      kind: 'pattern'
      pattern: Exclude<GirkiPatternId, 'borderStrip'>
      ground?: string
      shape?: GirkiShapeId
      shapeAnchor?: 'bottom-right' | 'bottom-left' | 'top-right' | 'center-right' | 'bottom-center'
      shapeSize?: string
      blend?: 'screen' | 'normal' | 'multiply'
      light?: boolean
    }
  | {
      kind: 'quiet'
      shape?: GirkiShapeId
    }

const layout = [
  'md:col-span-2 md:row-span-2 md:min-h-[28rem]',
  'md:col-span-1 md:min-h-[14rem]',
  'md:col-span-1 md:min-h-[14rem]',
  'md:col-span-2 md:min-h-[14rem]',
  'md:col-span-1 md:min-h-[14rem]',
  'md:col-span-1 md:min-h-[14rem]',
] as const

/** Alternating photo-led and pattern-led treatments for rhythm. */
const treatments: ExperienceTreatment[] = [
  {
    kind: 'photo',
    shape: 'plate',
    shapeAnchor: 'bottom-right',
    shapeSize: '22rem',
  },
  {
    kind: 'pattern',
    pattern: 'woven',
    ground: girkiBrand.cream,
    shape: 'wovenDiamond',
    shapeAnchor: 'bottom-right',
    shapeSize: '16rem',
    blend: 'multiply',
    light: true,
  },
  {
    kind: 'pattern',
    pattern: 'gathering',
    shape: 'conversationArc',
    shapeAnchor: 'center-right',
    shapeSize: '20rem',
    blend: 'screen',
  },
  {
    kind: 'photo',
    shape: 'flameDrop',
    shapeAnchor: 'top-right',
    shapeSize: '14rem',
  },
  {
    kind: 'quiet',
    shape: 'tableArch',
  },
  {
    kind: 'photo',
    shape: 'cloche',
    shapeAnchor: 'bottom-left',
    shapeSize: '18rem',
  },
]

export default function ExperiencesGrid() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-fr">
      {experiences.map((experience, index) => {
        const treatment = treatments[index] ?? { kind: 'photo' as const }
        const lightText =
          treatment.kind === 'pattern'
            ? !treatment.light
            : treatment.kind !== 'quiet'
              ? true
              : false

        return (
          <Link
            key={experience.title}
            to="/request"
            className={`group relative min-h-80 overflow-hidden rounded-[1.4rem] ${layout[index]}`}
          >
            {treatment.kind === 'photo' ? (
              <>
                <img
                  src={experience.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />
                {treatment.shape ? (
                  <GirkiCroppedShape
                    shape={treatment.shape}
                    anchor={treatment.shapeAnchor}
                    size={treatment.shapeSize}
                    opacity={0.72}
                    blend="screen"
                  />
                ) : null}
              </>
            ) : null}

            {treatment.kind === 'pattern' ? (
              <>
                <GirkiPatternFill
                  pattern={treatment.pattern}
                  scale={0.85}
                  className="transition-transform duration-700 group-hover:scale-[1.04]"
                />
                {treatment.light ? (
                  <div
                    className="absolute inset-0 bg-girki-cream/88"
                    aria-hidden="true"
                  />
                ) : null}
                {treatment.light ? (
                  <div className="absolute inset-x-0 top-0 h-20 overflow-hidden border-b border-ploy-border-primary">
                    <GirkiPatternFill pattern="woven" scale={0.5} />
                  </div>
                ) : null}
                {treatment.shape ? (
                  <GirkiCroppedShape
                    shape={treatment.shape}
                    anchor={treatment.shapeAnchor}
                    size={treatment.shapeSize}
                    opacity={treatment.light ? 0.28 : 0.7}
                    blend={treatment.blend ?? 'screen'}
                  />
                ) : null}
              </>
            ) : null}

            {treatment.kind === 'quiet' ? (
              <>
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: girkiBrand.charcoal }}
                  aria-hidden="true"
                />
                <GirkiPatternFill pattern="service" scale={0.7} opacity={0.45} />
                {treatment.shape ? (
                  <GirkiCroppedShape
                    shape={treatment.shape}
                    anchor="bottom-right"
                    size="15rem"
                    opacity={0.5}
                    blend="screen"
                  />
                ) : null}
              </>
            ) : null}

            <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between p-5 md:p-6">
              <span
                className={`typography-eyebrow ${lightText ? 'text-white/55' : 'text-ploy-text-secondary'}`}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 ${
                  lightText
                    ? 'border-white/20 bg-white/10 text-white opacity-0'
                    : 'border-ploy-border-primary bg-white/70 text-ploy-text-primary opacity-0'
                }`}
                aria-hidden="true"
              >
                <ArrowUpRight size={18} />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-6">
              <h3
                className={`font-heading text-2xl tracking-tight md:text-3xl ${
                  lightText ? 'text-white' : 'text-ploy-text-primary'
                }`}
              >
                {experience.title}
              </h3>
              <p
                className={`mt-2 max-w-sm text-sm leading-relaxed ${
                  lightText ? 'text-white/70' : 'text-ploy-text-secondary'
                }`}
              >
                {experience.copy}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
