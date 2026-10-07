import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { chefBenefits } from '../data/home'
import { images } from '../data/images'

export default function HomeBecomeChef() {
  return (
    <section id="become-a-chef" className="border-t-4 border-[#1c1418] bg-ploy-background-secondary">
      <div className="mx-auto max-w-7xl section-pad">
        <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/50">
          FOR CHEFS
        </p>

        <div className="relative mt-10 lg:mt-12">
          <div
            className="absolute inset-0 translate-x-3 translate-y-3 bg-girki-saffron"
            aria-hidden="true"
          />
          <div className="relative grid overflow-hidden border-4 border-[#1c1418] bg-[#2d1827] text-girki-cream lg:grid-cols-2">
            <div className="relative min-h-72 lg:min-h-[28rem]">
              <img
                src={images.opportunity}
                alt="Chef presenting a gourmet burger in a professional kitchen"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-[#2d1827]/80 via-transparent to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-[#2d1827]/40"
                aria-hidden="true"
              />
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-14">
              <h2
                className="font-display-heavy leading-[0.95]"
                style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)' }}
              >
                <span className="block">Turn your talent</span>
                <span className="block font-display-serif text-girki-saffron">
                  into opportunity.
                </span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-girki-cream/75 sm:text-lg">
                Join Girki and build a business creating meaningful food experiences for customers
                across Ghana.
              </p>

              <ul className="mt-8 grid gap-2 sm:grid-cols-2">
                {chefBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="border border-white/10 bg-white/5 px-3 py-3 font-heading text-sm leading-snug text-girki-cream/90"
                  >
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link
                to="/become-a-chef"
                className="group mt-10 inline-flex min-h-12 items-center justify-center gap-2 self-start bg-girki-saffron px-8 font-heading text-sm font-semibold text-[#1c1418] transition-transform hover:-translate-y-0.5"
              >
                Apply as a chef
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
