import { useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { chefs } from '../data/marketplace'
import {
  getChefInstagramUrl,
  getShowcaseChefLabel,
  isShowcaseChef,
} from '../lib/feature-flags'

const roster = chefs.slice(0, 3)

function ChefStageLink({
  chef,
  children,
  className,
}: {
  chef: (typeof roster)[number]
  children: ReactNode
  className?: string
}) {
  const showcase = isShowcaseChef(chef.id)
  const instagramUrl = getChefInstagramUrl(chef.id)

  if (showcase && instagramUrl) {
    return (
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`${chef.name} on Instagram`}
      >
        {children}
      </a>
    )
  }

  return (
    <Link to="/chefs/$chefId" params={{ chefId: chef.id }} className={className}>
      {children}
    </Link>
  )
}

export default function HomeFeaturedChefs() {
  const [active, setActive] = useState(0)
  const chef = roster[active]
  const showcaseLabel = getShowcaseChefLabel(chef.id)

  return (
    <section
      id="featured-chefs"
      className="relative overflow-hidden border-t-4 border-girki-saffron bg-girki-charcoal text-girki-cream"
    >
      <div
        className="pointer-events-none absolute -left-16 top-32 h-64 w-[140%] rotate-[-2deg] bg-girki-saffron/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl section-pad">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-14 xl:grid-cols-[minmax(0,22rem)_1fr] xl:gap-20">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-girki-cream/45">
              THE CHEFS
            </p>
            <h2
              className="mt-6 font-display-heavy text-girki-cream"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)' }}
            >
              <span className="block">Professional</span>
              <span className="block">chefs behind</span>
              <span className="mt-1 block font-display-serif text-girki-saffron">
                every experience.
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-girki-cream/70 sm:text-lg">
              Talented private chefs, vetted for your kitchen. Browse stories and sample menus, then
              book when you&apos;re ready.
            </p>
            <Link
              to="/chefs"
              className="group mt-10 inline-flex items-center gap-3 font-heading text-base font-semibold tracking-tight text-girki-cream"
            >
              <span className="border-b-2 border-girki-saffron pb-0.5">All chefs</span>
              <ArrowUpRight
                size={20}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </header>

          <div className="relative min-w-0">
            <ChefStageLink chef={chef} className="group relative block">
              <div
                className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-girki-saffron"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden border-4 border-[#1c1418] bg-[#1c1418]">
                <div className="relative aspect-[5/6] sm:aspect-[16/11] lg:aspect-[16/10]">
                  <img
                    key={chef.id}
                    src={chef.image}
                    alt={chef.alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1c1418]/95 via-[#1c1418]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-girki-saffron">
                      On the roster
                    </p>
                    <h3
                      className="mt-2 font-display-heavy text-girki-cream"
                      style={{ fontSize: 'clamp(1.85rem, 5vw, 3rem)' }}
                    >
                      {chef.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-girki-cream/75 sm:text-base">
                      <MapPin size={16} aria-hidden="true" />
                      {chef.location}
                    </p>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-girki-cream/80 sm:text-base">
                      {chef.specialties}
                    </p>
                    {showcaseLabel ? (
                      <p className="mt-4 font-heading text-xs font-semibold tracking-[0.2em] text-girki-saffron uppercase">
                        {showcaseLabel}
                      </p>
                    ) : (
                      <p className="mt-4 font-heading text-sm font-semibold text-girki-cream/90">
                        {chef.pricing}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </ChefStageLink>

            <div
              className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3 lg:-mt-10 lg:px-6"
              role="tablist"
              aria-label="Featured chefs"
            >
              {roster.map((item, index) => {
                const isActive = index === active
                const label = getShowcaseChefLabel(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(index)}
                    className={`group/text-left relative border-2 px-4 py-4 text-left transition-colors sm:py-5 ${
                      isActive
                        ? 'border-girki-saffron bg-girki-saffron text-[#1c1418]'
                        : 'border-white/15 bg-white/5 text-girki-cream hover:border-white/30 hover:bg-white/8'
                    } ${index === 1 ? 'sm:translate-y-3 lg:translate-y-6' : ''}`}
                  >
                    <p className="font-heading text-base font-semibold tracking-tight sm:text-lg">
                      {item.name.replace(/^Chef\s/, '')}
                    </p>
                    <p
                      className={`mt-1 line-clamp-2 text-xs leading-snug sm:text-sm ${
                        isActive ? 'text-[#1c1418]/70' : 'text-girki-cream/60'
                      }`}
                    >
                      {item.specialties}
                    </p>
                    {label ? (
                      <p
                        className={`mt-2 text-[0.65rem] font-semibold tracking-[0.16em] uppercase ${
                          isActive ? 'text-[#1c1418]/80' : 'text-girki-saffron/90'
                        }`}
                      >
                        {label}
                      </p>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
