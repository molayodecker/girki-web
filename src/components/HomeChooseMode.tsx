import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { images } from '../data/home'

const modes = [
  {
    title: 'Chef-crafted meals',
    subtitle: 'Delivered fresh',
    to: '/request',
    image: images.onboardingJollof,
    panelClass: 'bg-ploy-accent-secondary text-[#1c1418]',
    shadowClass: 'bg-girki-saffron',
    imageFirst: false,
    rotate: '-rotate-1 lg:-rotate-2',
    overlapClass: '',
  },
  {
    title: 'Private chef',
    subtitle: 'Cooks at your place',
    to: '/request',
    image: images.onboardingPrivateChef,
    panelClass: 'bg-girki-charcoal text-girki-cream',
    shadowClass: 'bg-[#1c1418]',
    imageFirst: true,
    rotate: 'rotate-1 lg:rotate-2',
    overlapClass: '-mt-8 sm:-mt-10 lg:-mt-28 lg:translate-x-4 xl:-mt-36',
  },
] as const

const pathTones = {
  terracotta: 'path-word--terracotta',
  plum: 'path-word--plum',
  palm: 'path-word--palm',
  amber: 'path-word--amber',
  wine: 'path-word--wine',
  forest: 'path-word--forest',
  teal: 'path-word--teal',
  navy: 'path-word--navy',
} as const

function PathWord({
  children,
  tone,
  index,
  italic = false,
}: {
  children: string
  tone: keyof typeof pathTones
  index: number
  italic?: boolean
}) {
  return (
    <span
      className={`path-word ${pathTones[tone]}${italic ? ' path-word--italic' : ''}`}
      style={{ '--path-i': index } as CSSProperties}
    >
      {children}
    </span>
  )
}

function PathLine() {
  const lineRef = useRef<HTMLParagraphElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const line = lineRef.current
    if (!line) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setReady(true)
        observer.disconnect()
      },
      { threshold: 0.55 },
    )
    observer.observe(line)
    return () => observer.disconnect()
  }, [])

  return (
    <p ref={lineRef} className={`path-line${ready ? ' is-ready' : ''}`}>
      <span className="path-sentence">
        <PathWord tone="terracotta" index={0}>
          Two
        </PathWord>{' '}
        <PathWord tone="plum" index={1}>
          ways
        </PathWord>{' '}
        <span className="path-plain">to</span>{' '}
        <PathWord tone="palm" index={2}>
          eat
        </PathWord>{' '}
        <PathWord tone="forest" index={3} italic>
          well
        </PathWord>
        <span className="path-plain">.</span>
      </span>
      <span className="path-sentence">
        <PathWord tone="wine" index={4}>
          Same
        </PathWord>{' '}
        <PathWord tone="amber" index={5}>
          chefs
        </PathWord>
        <span className="path-plain">.</span>{' '}
        <PathWord tone="teal" index={6}>
          Different
        </PathWord>{' '}
        <PathWord tone="navy" index={7} italic>
          nights
        </PathWord>
        <span className="path-plain">.</span>
      </span>
    </p>
  )
}

export default function HomeChooseMode() {
  return (
    <section
      id="choose-mode"
      className="border-b-4 border-[#1c1418] bg-ploy-background-primary"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 lg:py-14">
        <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/55">
          PICK YOUR PATH
        </p>
        <PathLine />

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-0">
          {modes.map((mode, modeIndex) => (
            <Link
              key={mode.title}
              to={mode.to}
              className={`group relative w-full transition-transform duration-500 hover:scale-[1.01] ${mode.rotate} ${mode.overlapClass}`}
            >
              <div
                className={`absolute inset-0 translate-x-2.5 translate-y-2.5 ${mode.shadowClass}`}
                aria-hidden="true"
              />
              <div
                className={`relative grid overflow-hidden border-4 border-[#1c1418] bg-[#1c1418] ${
                  mode.imageFirst
                    ? 'grid-rows-[minmax(11rem,1fr)_auto] sm:grid-cols-2 sm:grid-rows-1'
                    : 'grid-rows-[auto_minmax(11rem,1fr)] sm:grid-cols-2 sm:grid-rows-1'
                }`}
              >
                <div
                  className={`relative min-h-44 sm:min-h-60 ${
                    mode.imageFirst ? 'sm:order-1' : 'sm:order-2'
                  }`}
                >
                  <img
                    src={mode.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>

                <div
                  className={`flex min-h-[11.5rem] flex-col justify-between p-6 sm:p-7 lg:p-8 ${mode.panelClass} ${
                    mode.imageFirst ? 'sm:order-2' : 'sm:order-1'
                  }`}
                >
                  <div>
                    <h2
                      className="font-display-heavy leading-[0.95]"
                      style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)' }}
                    >
                      {mode.title}
                    </h2>
                    <p className="mt-2 font-heading text-sm font-medium opacity-80">{mode.subtitle}</p>
                  </div>
                  <span
                    className={`mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-current transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                      modeIndex === 0 ? 'bg-[#1c1418] text-girki-cream' : 'bg-girki-saffron text-[#1c1418]'
                    }`}
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
