import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'
import { images } from '../data/images'

const ticker = ['Order', 'Approve', 'Cook', 'Eat', 'Repeat'] as const

export default function HomeAppOrder() {
  return (
    <section id="order-food" className="relative isolate overflow-hidden">
      <div className="relative bg-ploy-accent-secondary px-5 pb-28 pt-14 sm:px-8 sm:pb-36 sm:pt-16 md:px-10 lg:px-12 lg:pb-44 lg:pt-20">
        <GirkiCroppedShape
          shape="wovenDiamond"
          anchor="top-right"
          size="22rem"
          opacity={0.2}
          fill="#1c1418"
        />
        <p className="relative z-10 font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/50">
          THE GIRKI APP
        </p>
        <h2
          className="relative z-10 mt-8 font-display-heavy text-[#1c1418]"
          style={{ fontSize: 'clamp(2.85rem, 11vw, 6.25rem)' }}
        >
          <span className="block">Chef-crafted</span>
          <span className="block">meals.</span>
          <span className="mt-2 block indent-[min(14vw,5.5rem)] font-display-serif text-[1.05em] leading-[0.92] opacity-95">
            Private chefs
          </span>
          <span className="block indent-[min(26vw,9.5rem)]">at home.</span>
        </h2>
      </div>

      <div className="relative bg-girki-charcoal text-girki-cream">
        <div
          className="pointer-events-none absolute -left-8 top-0 hidden h-40 w-[120%] -translate-y-1/2 rotate-[-1.5deg] bg-girki-charcoal lg:block"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="relative z-20 -mt-[min(32vw,15rem)] mx-auto w-full max-w-[min(100%,17.5rem)] sm:max-w-[20rem] md:max-w-[22rem] lg:-mt-52 lg:mx-0 lg:max-w-[24rem] xl:max-w-[26rem]">
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] bg-girki-saffron"
                aria-hidden="true"
              />
              <div className="relative rotate-[-2.5deg] transition-transform duration-500 hover:rotate-0">
                <div className="overflow-hidden rounded-[2rem] border-4 border-[#1c1418] bg-white shadow-[12px_12px_0_#1c1418]">
                  <img
                    src={images.appOrderUi}
                    alt="Girki app home screen"
                    className="block w-full object-cover object-top"
                    width={390}
                    height={844}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="relative z-10 pb-14 pt-4 lg:max-w-md lg:pb-20 lg:pt-10 xl:max-w-lg">
              <p className="text-lg leading-relaxed text-girki-cream/80 sm:text-xl">
                One app for food from professional chefs and nights with someone cooking in your
                kitchen. Menus you approve. One total you agree to before anyone shops.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/request"
                  className="group flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-white/12 bg-white/5 p-4 transition-colors hover:border-girki-saffron/40 hover:bg-white/8"
                >
                  <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-girki-saffron uppercase">
                    Delivered
                  </span>
                  <span className="font-heading text-xl tracking-tight">Chef-crafted meals</span>
                  <ArrowUpRight
                    size={18}
                    className="self-end text-girki-cream/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-girki-saffron"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  to="/request"
                  className="group flex min-h-[5.5rem] flex-col justify-between rounded-2xl border border-white/12 bg-white/5 p-4 transition-colors hover:border-girki-saffron/40 hover:bg-white/8"
                >
                  <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-girki-saffron uppercase">
                    At your place
                  </span>
                  <span className="font-heading text-xl tracking-tight">Private chef</span>
                  <ArrowUpRight
                    size={18}
                    className="self-end text-girki-cream/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-girki-saffron"
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <Link
                to="/request"
                className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-girki-saffron px-8 font-heading text-base font-semibold tracking-tight text-[#1c1418] transition-transform hover:scale-[1.02] sm:w-auto"
              >
                Start an order
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <p className="mt-4 text-center text-xs tracking-[0.12em] text-girki-cream/45 uppercase lg:text-left">
                App stores soon · Web works today
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5">
          <div className="flex overflow-hidden">
            <div className="animate-girki-marquee flex min-w-max items-center gap-16 pr-16">
              {[...ticker, ...ticker, ...ticker, ...ticker].map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="font-display-serif text-4xl text-white/15 sm:text-5xl"
                >
                  {word}
                  <span className="mx-8 text-girki-saffron/60">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
