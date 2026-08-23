import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', hash: 'how-it-works', label: 'How it works' },
  { to: '/chefs', label: 'Chefs' },
  { to: '/', hash: 'experiences', label: 'Experiences' },
  { to: '/', hash: 'menus', label: 'Menus' },
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

  const light = overlay && !menuOpen && !scrolled

  return (
    <header
      className={`z-40 ${
        overlay ? 'fixed inset-x-0 top-0' : 'sticky top-0'
      } ${
        light
          ? 'text-ploy-text-inverse'
          : 'border-b border-ploy-border-primary bg-ploy-background-primary/80 text-ploy-text-primary backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          to="/"
          aria-label="Girki home"
          className="font-heading text-[1.7rem] tracking-tight"
        >
          Girki
        </Link>

        <nav
          className="hidden items-center gap-8 text-[0.8rem] tracking-[0.12em] uppercase lg:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              hash={'hash' in link ? link.hash : undefined}
              className={
                light
                  ? 'text-white/75 transition-colors hover:text-white'
                  : 'text-ploy-text-secondary transition-colors hover:text-ploy-text-primary'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className={`btn btn-outline hidden sm:inline-flex ${
              light ? 'border-white/30 text-white hover:bg-white/10' : ''
            }`}
            to="/become-a-chef"
          >
            Become a chef
          </Link>
          <Link
            className={`btn btn-outline hidden md:inline-flex ${
              light ? 'border-white/30 text-white hover:bg-white/10' : ''
            }`}
            to="/sign-in"
          >
            Sign in
          </Link>
          <Link className="btn btn-primary" to="/request">
            Find a chef
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
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
          className="border-t border-ploy-border-primary bg-ploy-background-primary px-5 py-5 text-ploy-text-primary lg:hidden"
          aria-label="Mobile menu"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                hash={'hash' in link ? link.hash : undefined}
                className="rounded-xl px-3 py-3 text-sm tracking-[0.08em] uppercase"
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
