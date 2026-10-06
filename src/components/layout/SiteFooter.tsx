import { Link } from '@tanstack/react-router'
import { ArrowUpRight, CalendarDays, House, Search, UserRound, Utensils } from 'lucide-react'
import GirkiMark from '../brand/GirkiMark'

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'How it works', to: '/', hash: 'how-it-works' },
      { label: 'Our chefs', to: '/chefs' },
      { label: 'Menus', to: '/', hash: 'menus' },
      { label: 'Become a chef', to: '/become-a-chef' },
    ],
  },
  {
    title: 'Guests',
    links: [
      { label: 'Find a chef', to: '/request' },
      { label: 'Experiences', to: '/', hash: 'experiences' },
      { label: 'Trust & safety', to: '/', hash: 'trust' },
    ],
  },
  {
    title: 'Chefs',
    links: [{ label: 'Chef portal', to: '/chef-dashboard' }],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms & Conditions', to: '/' },
    ],
  },
] as const

export default function SiteFooter() {
  return (
    <>
      <footer className="border-t-4 border-girki-saffron bg-girki-charcoal pb-24 text-girki-cream md:pb-0">
        <div className="border-b-2 border-girki-saffron/35 bg-girki-saffron px-5 py-3 sm:px-8">
          <p className="text-center font-heading text-[0.65rem] font-semibold tracking-[0.38em] text-[#1c1418] uppercase">
            Made in Ghana · For unforgettable tables
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-16 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4 xl:col-span-3">
              <Link to="/" aria-label="Girki home" className="group inline-flex flex-col gap-4">
                <GirkiMark size={52} />
                <span
                  className="font-display-heavy leading-none text-girki-cream"
                  style={{ fontSize: 'clamp(3rem, 10vw, 4.5rem)' }}
                >
                  Girki
                </span>
              </Link>
              <p className="mt-4 max-w-xs font-heading text-base font-medium leading-relaxed text-girki-cream/85">
                Private chefs, at your table.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4 xl:col-span-9">
              {columns.map((column) => (
                <div key={column.title} className="min-w-0">
                  <p className="font-heading text-[0.65rem] font-semibold tracking-[0.32em] text-girki-saffron uppercase">
                    {column.title}
                  </p>
                  <ul className="mt-4 border-t-2 border-white/15">
                    {column.links.map((link) => (
                      <li key={link.label} className="border-b border-white/10">
                        <Link
                          to={link.to}
                          hash={'hash' in link ? link.hash : undefined}
                          className="group flex items-center justify-between gap-3 py-3.5 text-[15px] text-girki-cream/75 transition-colors hover:text-girki-cream"
                        >
                          <span className="font-heading font-medium">{link.label}</span>
                          <ArrowUpRight
                            size={16}
                            className="shrink-0 text-girki-saffron/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-girki-saffron"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-white/10 px-5 py-6 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-heading text-sm text-girki-cream/55">
              © Girki 2026. All rights reserved.
            </p>
            <p className="font-heading text-sm text-girki-cream/55">
              Accra and across Ghana
            </p>
          </div>
        </div>
      </footer>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 border-4 border-girki-saffron bg-girki-charcoal/95 px-1 py-1.5 text-girki-cream shadow-[8px_8px_0_#1c1418] backdrop-blur-md md:hidden"
      >
        {[
          { to: '/', label: 'Home', Icon: House },
          { to: '/', hash: 'experiences', label: 'Explore', Icon: Search },
          { to: '/request', label: 'Request', Icon: CalendarDays },
          { to: '/chefs', label: 'Chefs', Icon: Utensils },
          { to: '/become-a-chef', label: 'Join', Icon: UserRound },
        ].map(({ to, hash, label, Icon }) => (
          <Link
            key={label}
            to={to}
            hash={hash}
            className="flex flex-col items-center gap-1 py-2 text-[9px] font-semibold tracking-[0.12em] uppercase text-girki-cream/55 hover:bg-white/5 hover:text-girki-saffron"
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
