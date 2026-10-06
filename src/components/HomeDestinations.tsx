import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { cities } from '../data/marketplace'

export default function HomeDestinations() {
  return (
    <section
      id="destinations"
      className="border-t-4 border-[#1c1418] bg-ploy-background-secondary"
    >
      <div className="relative mx-auto max-w-7xl section-pad">
        <p
          className="pointer-events-none absolute right-4 top-8 select-none font-display-heavy leading-none text-[#1c1418]/[0.04] sm:right-8"
          style={{ fontSize: 'clamp(5rem, 22vw, 14rem)' }}
          aria-hidden="true"
        >
          GH
        </p>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <header className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/50">
              DESTINATIONS
            </p>
            <h2
              className="mt-6 font-display-heavy text-ploy-text-primary"
              style={{ fontSize: 'clamp(2.35rem, 6.5vw, 4rem)' }}
            >
              <span className="block">Private chefs</span>
              <span className="block font-display-serif text-ploy-accent-secondary">
                across Ghana.
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-base leading-relaxed text-ploy-text-secondary">
              Start in the city you&apos;re in. We&apos;re building coverage from Accra outward.
            </p>
          </header>

          <ul className="relative min-w-0 border-t-2 border-[#1c1418] lg:col-span-8">
            {cities.map((city) => (
              <li key={city.slug} className="border-b-2 border-[#1c1418]">
                <Link
                  to="/request"
                  search={{ city: city.name }}
                  className="group flex items-center gap-4 px-1 py-6 transition-colors hover:bg-white/70 sm:gap-6 sm:py-7"
                >
                  <span
                    className="min-w-0 flex-1 font-display-heavy leading-none text-ploy-text-primary"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
                  >
                    {city.name}
                  </span>
                  <span className="hidden font-heading text-sm tracking-[0.12em] text-ploy-text-secondary uppercase sm:block">
                    {city.country}
                  </span>
                  <span
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#1c1418]/25 text-ploy-text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-[#1c1418] group-hover:bg-[#1c1418] group-hover:text-girki-cream"
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
