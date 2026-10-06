import { useState } from 'react'
import { reviewStats, reviews } from '../data/marketplace'

function formatRating(value: number) {
  return value % 1 === 0 ? value.toFixed(1) : value.toString()
}

export default function HomeGuestNotes() {
  const [active, setActive] = useState(0)
  const review = reviews[active]

  return (
    <section
      id="reviews"
      className="relative overflow-hidden border-t-4 border-girki-saffron bg-girki-charcoal text-girki-cream"
    >
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[min(42vw,22rem)] bg-girki-saffron/[0.06]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <header className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28 lg:self-start">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-girki-cream/45">
              GUEST NOTES
            </p>
            <h2
              className="mt-6 font-display-heavy text-girki-cream"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 3.65rem)' }}
            >
              <span className="block">The table</span>
              <span className="block font-display-serif text-girki-saffron">
                is the review.
              </span>
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3">
              {reviewStats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-2 border-white/12 bg-white/5 px-3 py-4 sm:px-4 sm:py-5"
                >
                  <p className="font-display-heavy text-3xl text-girki-saffron tabular-nums sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-heading text-[0.65rem] font-semibold tracking-[0.14em] text-girki-cream/50 uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </header>

          <div className="relative min-w-0 lg:col-span-8 xl:col-span-9">
            <p
              className="pointer-events-none absolute -left-2 top-0 select-none font-display-heavy text-[8rem] leading-none text-girki-saffron/15 sm:text-[10rem] lg:-left-6"
              aria-hidden="true"
            >
              &ldquo;
            </p>

            <div className="relative border-4 border-girki-saffron bg-[#1c1418]">
              <div className="border-b-2 border-girki-saffron/40 px-6 py-4 sm:px-8 sm:py-5">
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-girki-saffron">
                  Table talk
                </p>
                <p className="mt-1 font-heading text-sm text-girki-cream/55">{review.date}</p>
              </div>

              <blockquote className="px-6 py-8 sm:px-10 sm:py-12 lg:py-14">
                <p
                  key={review.id}
                  className="font-display-heavy leading-[1.08] text-girki-cream"
                  style={{ fontSize: 'clamp(1.65rem, 4.2vw, 2.85rem)' }}
                >
                  {review.copy}
                </p>
                <footer className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
                  <div>
                    <p className="font-heading text-lg font-semibold tracking-tight">{review.name}</p>
                    <p className="mt-1 text-sm text-girki-cream/50">{review.city}</p>
                  </div>
                  <p className="font-display-heavy text-4xl text-girki-saffron tabular-nums sm:text-5xl">
                    {formatRating(review.rating)}
                  </p>
                </footer>
              </blockquote>
            </div>

            <div
              className="mt-6 grid gap-2 sm:grid-cols-2"
              role="tablist"
              aria-label="Guest reviews"
            >
              {reviews.map((item, index) => {
                const isActive = index === active
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(index)}
                    className={`group border-2 px-4 py-4 text-left transition-colors sm:py-5 ${
                      isActive
                        ? 'border-girki-saffron bg-girki-saffron text-[#1c1418]'
                        : 'border-white/15 bg-white/5 text-girki-cream hover:border-white/30 hover:bg-white/8'
                    }`}
                  >
                    <p
                      className={`font-display-heavy text-lg tabular-nums ${
                        isActive ? 'text-[#1c1418]' : 'text-girki-saffron'
                      }`}
                    >
                      {formatRating(item.rating)}
                    </p>
                    <p
                      className={`mt-2 line-clamp-2 font-heading text-sm leading-snug ${
                        isActive ? 'text-[#1c1418]/80' : 'text-girki-cream/70'
                      }`}
                    >
                      {item.copy}
                    </p>
                    <p
                      className={`mt-2 text-xs font-semibold tracking-[0.12em] uppercase ${
                        isActive ? 'text-[#1c1418]/60' : 'text-girki-cream/45'
                      }`}
                    >
                      {item.name}
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
