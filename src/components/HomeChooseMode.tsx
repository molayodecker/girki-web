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

const pathAccentBase = 'font-display-serif text-[1.45em] leading-none'

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
        <p className="mt-3 max-w-md text-lg text-[#1c1418]/85">
          <span className="font-heading font-semibold">
            <span className={`${pathAccentBase} text-ploy-accent-secondary`}>Two</span> ways to
            eat well.
          </span>{' '}
          <span className="font-heading font-medium">
            Same{' '}
            <span className={`${pathAccentBase} text-ploy-accent-primary`}>chefs</span>.{' '}
            <span className={`${pathAccentBase} text-girki-saffron`}>Different</span>{' '}
            <span className={`${pathAccentBase} text-[#1e4d3a]`}>nights</span>.
          </span>
        </p>

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
