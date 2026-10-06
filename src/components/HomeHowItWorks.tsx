import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { images } from '../data/images'

const steps = [
  {
    title: 'Tell us the table',
    copy: 'City, date, guests, diet notes, kitchen. The chef plans from there.',
  },
  {
    title: 'Chefs work their magic',
    copy: 'They send a menu and a price in the open. You approve before anyone shops.',
  },
  {
    title: 'Eat. That’s it.',
    copy: 'They arrive, cook, serve, and leave the kitchen clean. You keep the table.',
  },
] as const

export default function HomeHowItWorks() {
  const [active, setActive] = useState(0)
  const current = steps[active]

  return (
    <section id="how-it-works" className="relative bg-girki-charcoal text-girki-cream">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_min(38vw,26rem)] xl:grid-cols-[minmax(0,1fr)_min(40vw,28rem)]">
        <div className="relative order-2 overflow-hidden section-pad lg:order-1 lg:pr-8 xl:pr-12">
          <p className="relative z-10 font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-girki-cream/45">
            HOW IT WORKS
          </p>

          <h2
            className="relative z-10 mt-6 max-w-xl font-display-heavy text-girki-cream"
            style={{ fontSize: 'clamp(2.35rem, 5.5vw, 4.25rem)' }}
          >
            <span className="block">How we bring</span>
            <span className="block">the best chefs</span>
            <span className="mt-1 block font-display-serif text-girki-saffron">
              to your table.
            </span>
          </h2>

          <div className="relative z-10 mt-12 min-h-[11rem] lg:mt-14 lg:min-h-[13rem]">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-girki-saffron">Current step</p>
            <h3
              key={current.title}
              className="mt-3 font-display-heavy text-girki-cream"
              style={{ fontSize: 'clamp(1.85rem, 4.5vw, 2.75rem)' }}
            >
              {current.title}
            </h3>
            <p
              key={`${current.title}-copy`}
              className="mt-4 max-w-lg text-base leading-relaxed text-girki-cream/75 sm:text-lg"
            >
              {current.copy}
            </p>
          </div>

          <div
            className="relative z-10 mt-8 flex flex-wrap gap-2 sm:gap-3 lg:hidden"
            role="tablist"
            aria-label="How it works steps"
          >
            {steps.map((step, index) => {
              const isActive = index === active
              return (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(index)}
                  className={`group max-w-full rounded-full border px-4 py-2.5 text-left transition-all sm:px-5 ${
                    isActive
                      ? 'border-girki-saffron bg-girki-saffron text-[#1c1418]'
                      : 'border-girki-cream/20 bg-transparent text-girki-cream/70 hover:border-girki-cream/40 hover:text-girki-cream'
                  }`}
                >
                  <span className="block font-heading text-sm font-semibold tracking-tight sm:text-[15px]">
                    {step.title}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="relative z-10 mt-10 hidden gap-0 border-t border-girki-cream/15 lg:grid lg:grid-cols-3">
            {steps.map((step, index) => (
              <button
                key={`${step.title}-col`}
                type="button"
                onClick={() => setActive(index)}
                className={`border-r border-girki-cream/15 px-4 py-6 text-left transition-colors last:border-r-0 ${
                  index === active ? 'bg-white/6' : 'hover:bg-white/4'
                }`}
              >
                <p
                  className={`font-heading text-sm leading-snug tracking-tight ${
                    index === active ? 'text-girki-cream' : 'text-girki-cream/45'
                  }`}
                >
                  {step.title}
                </p>
                <ArrowUpRight
                  size={16}
                  className={`mt-4 transition-opacity ${
                    index === active ? 'text-girki-saffron opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <Link
            to="/request"
            className="relative z-10 mt-10 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-girki-saffron px-8 font-heading text-base font-semibold tracking-tight text-[#1c1418] transition-transform hover:scale-[1.02] sm:w-auto lg:mt-12"
          >
            Start a request
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="relative order-1 min-h-[min(52vh,28rem)] lg:order-2 lg:min-h-[calc(100%+1px)]">
          <div
            className="absolute inset-0 bg-girki-saffron lg:left-3 lg:top-3"
            aria-hidden="true"
          />
          <div className="relative h-full min-h-[inherit] overflow-hidden border-b-4 border-girki-saffron lg:border-b-0 lg:border-l-4">
            <img
              src={images.howItWorksKitchen}
              alt=""
              className="h-full min-h-[inherit] w-full object-cover object-[42%_center]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-girki-charcoal/80 via-transparent to-girki-charcoal/20 lg:bg-linear-to-l lg:from-girki-charcoal/90 lg:via-girki-charcoal/20 lg:to-transparent" />
            <p
              className="pointer-events-none absolute bottom-6 left-6 hidden font-display-heavy text-[clamp(3rem,8vw,5.5rem)] leading-none text-white/10 lg:block"
              aria-hidden="true"
            >
              Kitchen
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
