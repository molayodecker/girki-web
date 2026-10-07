import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'
import { cuisines, cuisineSpotlightImages } from '../data/home'

const focusByCuisine: Record<(typeof cuisines)[number], string> = {
  Ghanaian: 'object-[42%_center]',
  'West African': 'object-center',
  'Coastal & seafood': 'object-center',
  Continental: 'object-center',
  'Vegan & vegetarian': 'object-center',
  'Chef’s tasting menus': 'object-center',
}

export default function HomeCuisine() {
  const [active, setActive] = useState(0)
  const activeCuisine = cuisines[active]

  return (
    <section
      id="cuisine"
      className="relative overflow-hidden border-t-4 border-[#1c1418] bg-ploy-background-secondary"
    >
      <GirkiCroppedShape
        shape="plate"
        anchor="top-right"
        size="24rem"
        opacity={0.08}
        fill="#1c1418"
      />

      <div className="relative mx-auto max-w-7xl section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-5 xl:col-span-4">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/50">
              CUISINE
            </p>
            <h2
              className="mt-6 font-display-heavy text-ploy-text-primary"
              style={{ fontSize: 'clamp(2.35rem, 6.5vw, 4rem)' }}
            >
              <span className="block">What you&apos;d cook</span>
              <span className="block font-display-serif text-ploy-accent-secondary">
                if you had time.
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-ploy-text-secondary sm:text-lg">
              Restaurant-quality food from professional chefs, delivered fresh or cooked in your
              kitchen. Pick a lane and make it yours.
            </p>

            <div className="relative mt-10 lg:sticky lg:top-28">
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-[#1c1418]"
                aria-hidden="true"
              />
              <div className="relative -rotate-2 overflow-hidden border-4 border-[#1c1418] bg-[#1c1418] transition-transform duration-500 hover:rotate-0">
                <div className="relative aspect-[4/5] sm:aspect-[5/6]">
                  <img
                    key={activeCuisine}
                    src={cuisineSpotlightImages[activeCuisine]}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${focusByCuisine[activeCuisine]}`}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1c1418]/80 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-girki-saffron">Now craving</p>
                    <p className="mt-1 font-display-heavy text-2xl text-girki-cream sm:text-3xl">
                      {activeCuisine}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center lg:col-span-7 xl:col-span-8">
            <p className="mb-4 font-heading text-xs font-semibold tracking-[0.28em] text-ploy-text-secondary uppercase">
              Choose a starting point
            </p>
            <ul className="border-t-2 border-[#1c1418]">
              {cuisines.map((cuisine, index) => {
                const isActive = index === active
                return (
                  <li key={cuisine} className="border-b-2 border-[#1c1418]">
                    <Link
                      to="/request"
                      search={{ cuisine }}
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      className={`group flex items-center gap-4 px-1 py-5 transition-colors sm:gap-6 sm:py-6 ${
                        isActive ? 'bg-ploy-accent-secondary' : 'bg-transparent hover:bg-white/60'
                      }`}
                    >
                      <span
                        className={`min-w-0 flex-1 font-display-heavy leading-tight ${
                          isActive ? 'text-[#1c1418]' : 'text-ploy-text-primary'
                        }`}
                        style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2.15rem)' }}
                      >
                        {cuisine}
                      </span>
                      <span
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                          isActive
                            ? 'border-[#1c1418] bg-[#1c1418] text-girki-cream'
                            : 'border-[#1c1418]/25 text-ploy-text-primary'
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowUpRight size={18} />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            <Link
              to="/request"
              className="group mt-10 inline-flex items-center gap-3 self-start font-heading text-base font-semibold tracking-tight text-ploy-text-primary"
            >
              <span className="border-b-2 border-ploy-accent-secondary pb-0.5">
                Start with any cuisine
              </span>
              <ArrowUpRight
                size={20}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
