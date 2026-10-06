import { useState } from 'react'
import { trustItems } from '../data/home'

export default function HomeTrust() {
  const [active, setActive] = useState(0)
  const item = trustItems[active]

  return (
    <section
      id="trust"
      className="border-t-4 border-girki-saffron bg-ploy-background-primary"
    >
      <div className="mx-auto max-w-7xl section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <header className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 lg:self-start">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/50">
              TRUST
            </p>
            <h2
              className="mt-6 font-display-heavy text-ploy-text-primary"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 3.65rem)' }}
            >
              <span className="block">Good food starts</span>
              <span className="block font-display-serif text-ploy-accent-secondary">
                with trust.
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ploy-text-secondary sm:text-lg">
              Chef discovery should feel personal. Booking standards should stay clear from the
              first message to cleanup.
            </p>
          </header>

          <div className="min-w-0 lg:col-span-8 xl:col-span-9">
            <div className="relative border-4 border-[#1c1418] bg-[#1c1418]">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <div className="flex items-center justify-center border-b-4 border-[#1c1418] bg-girki-cream p-10 sm:p-12 lg:border-b-0 lg:border-r-4">
                  <img
                    key={item.title}
                    src={item.icon}
                    alt=""
                    className="max-h-40 w-auto object-contain sm:max-h-48"
                  />
                </div>
                <div className="bg-girki-charcoal p-8 sm:p-10 lg:p-12">
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-girki-saffron">
                    Pillar
                  </p>
                  <h3
                    key={item.title}
                    className="mt-4 font-display-heavy text-girki-cream"
                    style={{ fontSize: 'clamp(1.65rem, 4vw, 2.35rem)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-girki-cream/75">
                    {item.copy}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
              role="tablist"
              aria-label="Trust pillars"
            >
              {trustItems.map((pillar, index) => {
                const isActive = index === active
                return (
                  <button
                    key={pillar.title}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(index)}
                    className={`border-2 px-4 py-4 text-left transition-colors ${
                      isActive
                        ? 'border-girki-saffron bg-girki-saffron text-[#1c1418]'
                        : 'border-[#1c1418]/15 bg-white/50 hover:border-[#1c1418]/30'
                    }`}
                  >
                    <p
                      className={`font-heading text-sm font-semibold leading-snug ${
                        isActive ? 'text-[#1c1418]' : 'text-ploy-text-primary'
                      }`}
                    >
                      {pillar.title}
                    </p>
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
