import { Link } from '@tanstack/react-router'
import { CalendarDays, House, Search, UserRound, Utensils } from 'lucide-react'

const columns = [
  {
    title: 'Girki',
    links: [
      { label: 'How it works', to: '/', hash: 'how-it-works' },
      { label: 'Our chefs', to: '/chefs' },
      { label: 'Menus', to: '/', hash: 'menus' },
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
    links: [{ label: 'Become a chef', to: '/', hash: 'become-a-chef' }],
  },
  {
    title: 'Company',
    links: [
      { label: 'Terms', to: '/' },
      { label: 'Privacy', to: '/' },
    ],
  },
] as const

export default function SiteFooter() {
  return (
    <>
      <footer className="bg-ploy-neutral-inverse px-5 pb-28 pt-20 text-ploy-text-inverse lg:px-8 lg:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_2.2fr]">
            <div>
              <Link to="/" className="font-heading text-5xl tracking-tight">
                Girki
              </Link>
              <p className="mt-6 max-w-xs text-[0.95rem] leading-relaxed text-white/55">
                Private chefs for the tables that matter, at home, on holiday,
                and everywhere in between.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3 className="typography-eyebrow text-ploy-accent-tertiary">
                    {column.title}
                  </h3>
                  <ul className="mt-5 space-y-3 text-sm text-white/55">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          hash={'hash' in link ? link.hash : undefined}
                          className="transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-8 text-xs tracking-[0.12em] uppercase text-white/40 sm:flex-row sm:items-center sm:justify-between">
            <p>Made in Africa, for unforgettable tables</p>
            <p>© 2026 Girki</p>
          </div>
        </div>
      </footer>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-5 rounded-full border border-white/10 bg-ploy-neutral-inverse/90 px-2 py-2 text-white shadow-[var(--shadow-lift)] backdrop-blur-xl md:hidden"
      >
        {[
          { to: '/', label: 'Home', Icon: House },
          { to: '/', hash: 'experiences', label: 'Explore', Icon: Search },
          { to: '/request', label: 'Request', Icon: CalendarDays },
          { to: '/chefs', label: 'Chefs', Icon: Utensils },
          { to: '/', hash: 'become-a-chef', label: 'Join', Icon: UserRound },
        ].map(({ to, hash, label, Icon }) => (
          <Link
            key={label}
            to={to}
            hash={hash}
            className="flex flex-col items-center gap-1 rounded-full py-2 text-[9px] tracking-[0.14em] uppercase text-white/55 hover:text-white"
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
