import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import GirkiMark from '../brand/GirkiMark'

const links = [
  { to: '/', hash: 'how-it-works', label: 'How it works' },
  { to: '/chefs', label: 'Chefs' },
  { to: '/', hash: 'experiences', label: 'Experiences' },
  { to: '/', hash: 'menus', label: 'Menus' },
  { to: '/account', label: 'My table' },
  { to: '/chef-dashboard', label: 'Chef portal' },
] as const

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!overlay) return
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overlay])

  const onHero = overlay && !menuOpen && !scrolled
  const onDark = overlay && scrolled

  return (
    <header
      className={`z-40 border-b transition-[background-color,border-color,color] duration-500 ease-out motion-reduce:transition-none ${
        overlay ? 'fixed inset-x-0 top-0' : 'sticky top-0'
      } ${
        onHero
          ? 'border-transparent bg-transparent text-white'
          : onDark
            ? 'border-white/10 bg-black text-white'
            : 'border-ploy-border-primary bg-ploy-background-primary/80 text-ploy-text-primary backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-[4.25rem] min-w-0 items-center justify-between gap-3 px-4 sm:h-20 sm:gap-4 sm:px-5 lg:px-8">
        <Link
          to="/"
          aria-label="Girki home"
          className="flex shrink-0 items-center"
        >
          <GirkiMark size={48} />
        </Link>

        <nav
          className="hidden min-w-0 items-center gap-4 text-sm font-semibold tracking-[0.08em] uppercase xl:flex xl:gap-5 xl:text-[0.95rem]"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={'hash' in link ? link.hash : undefined}
              className={`shrink-0 whitespace-nowrap ${
                onHero || onDark
                  ? 'text-white/75 transition-colors hover:text-white'
                  : 'text-ploy-text-secondary transition-colors hover:text-ploy-text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Link
            className="btn hidden min-h-11 shrink-0 whitespace-nowrap border border-transparent bg-[#FFE394] px-5 text-[0.72rem] text-[#1c1418] hover:bg-[#f3d67a] lg:inline-flex lg:min-h-12 lg:px-6 lg:text-[0.78rem]"
            to="/become-a-chef"
          >
            Become a chef
          </Link>
          <Link
            className="btn hidden min-h-11 shrink-0 whitespace-nowrap border border-transparent bg-[#FFE394] px-5 text-[0.72rem] text-[#1c1418] hover:bg-[#f3d67a] md:inline-flex md:min-h-12 md:px-6 md:text-[0.78rem]"
            to="/sign-in"
          >
            Sign in
          </Link>
          <Link
            className="btn btn-primary min-h-11 shrink-0 whitespace-nowrap px-4 text-[0.72rem] sm:min-h-12 sm:px-6 sm:text-[0.78rem] lg:px-7"
            to="/request"
          >
            Find a chef
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full xl:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className={`border-t px-5 py-5 xl:hidden ${
            onDark
              ? 'border-white/10 bg-black text-white'
              : 'border-ploy-border-primary bg-ploy-background-primary text-ploy-text-primary'
          }`}
          aria-label="Mobile menu"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={'hash' in link ? link.hash : undefined}
                className="rounded-xl px-3 py-3 text-base font-semibold tracking-[0.08em] uppercase"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
