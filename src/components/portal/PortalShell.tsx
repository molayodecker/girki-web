import { useEffect, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Bell, PanelLeft, Search } from 'lucide-react'
import GirkiMark from '../brand/GirkiMark'
import { initials } from './format'
import PortalIcon, { type PortalIconName } from './PortalIcon'

function PortalNavLink({
  to,
  params,
  search,
  hash,
  className,
  onClick,
  title,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
  children,
}: {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  hash?: string
  className?: string
  onClick?: () => void
  title?: string
  'aria-label'?: string
  'aria-current'?: 'page'
  children: ReactNode
}) {
  return (
    <Link
      to={to as never}
      params={params as never}
      search={search as never}
      hash={hash}
      className={className}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </Link>
  )
}

export type PortalRailItem = {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  hash?: string
  label: string
  icon: PortalIconName
  active?: boolean
  badge?: number | boolean
  mobile?: boolean
}

const COLLAPSE_KEY = 'girki-portal-nav-collapsed'

export default function PortalShell({
  title,
  subtitle,
  brandLabel,
  userName,
  userMeta,
  notificationCount = 0,
  railItems,
  searchPlaceholder = 'Search bookings, guests, menus',
  searchValue,
  onSearchChange,
  onSignOut,
  children,
}: {
  title: string
  subtitle?: string
  brandLabel: string
  userName: string
  userMeta?: string
  notificationCount?: number
  railItems: PortalRailItem[]
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onSignOut: () => void
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === '1')
  }, [])

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current
      window.localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      return next
    })
  }

  return (
    <div className="portal-app flex h-dvh bg-portal-bg text-portal-text">
      <Sidebar
        className="hidden lg:flex"
        brandLabel={brandLabel}
        items={railItems}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
      />

      {navOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
          />
          <Sidebar
            className="absolute inset-y-0 left-0 flex w-[17.5rem] shadow-lift"
            brandLabel={brandLabel}
            items={railItems}
            collapsed={false}
            onNavigate={() => setNavOpen(false)}
          />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-portal-border px-4 py-3 sm:px-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-portal-muted lg:hidden"
            aria-label="Open navigation"
            onClick={() => setNavOpen(true)}
          >
            <PanelLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
            {subtitle ? (
              <p className="mt-0.5 truncate text-sm text-portal-muted">{subtitle}</p>
            ) : null}
          </div>
          <label className="relative hidden min-w-48 max-w-sm flex-1 md:block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-portal-muted"
              aria-hidden="true"
            />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-full border border-portal-border bg-portal-surface pl-10 pr-4 text-sm outline-none placeholder:text-portal-muted/80 focus:border-portal-accent"
            />
          </label>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-portal-muted hover:bg-portal-surface hover:text-portal-text"
            aria-label={
              notificationCount > 0 ? `${notificationCount} notifications` : 'Notifications'
            }
          >
            <Bell size={18} aria-hidden="true" />
            {notificationCount > 0 ? (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-portal-accent" />
            ) : null}
          </button>
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 hover:bg-portal-surface"
              aria-label="Account menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-portal-accent text-sm font-medium text-white">
                {initials(userName)}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block max-w-40 truncate text-sm font-medium">{userName}</span>
                {userMeta ? (
                  <span className="block max-w-40 truncate text-xs text-portal-muted">{userMeta}</span>
                ) : null}
              </span>
            </button>
            {menuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-portal-border bg-portal-surface py-1 shadow-lift">
                <p className="truncate px-4 py-2.5 text-sm text-portal-muted">{userName}</p>
                <Link
                  to="/"
                  className="block px-4 py-2.5 text-sm hover:bg-portal-surface-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Marketing site
                </Link>
                <button
                  type="button"
                  className="block w-full px-4 py-2.5 text-left text-sm hover:bg-portal-surface-2"
                  onClick={() => {
                    setMenuOpen(false)
                    onSignOut()
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : null}
          </div>
        </header>

        <div className="border-b border-portal-border px-4 py-2 md:hidden">
          <label className="relative block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-portal-muted"
              aria-hidden="true"
            />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-full border border-portal-border bg-portal-surface pl-10 pr-4 text-sm outline-none placeholder:text-portal-muted/80 focus:border-portal-accent"
            />
          </label>
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-5 pb-24 sm:px-6 sm:py-6 lg:pb-8">{children}</div>
        </main>
      </div>

      <nav
        aria-label="Portal"
        className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-portal-border bg-portal-sidebar/95 px-1 py-1 shadow-lift backdrop-blur-xl lg:hidden"
      >
        {(railItems.filter((item) => item.mobile).length > 0
          ? railItems.filter((item) => item.mobile)
          : railItems
        )
          .slice(0, 5)
          .map((item) => (
            <PortalNavLink
              key={item.label}
              to={item.to}
              params={item.params}
              search={item.search}
              hash={item.hash}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[9px] font-medium uppercase tracking-[0.12em] ${
                item.active ? 'bg-portal-accent/15 text-portal-accent' : 'text-portal-muted'
              }`}
            >
              <PortalIcon name={item.icon} size={20} />
              <span className="max-w-[4.2rem] truncate">{item.label}</span>
            </PortalNavLink>
          ))}
      </nav>
    </div>
  )
}

function Sidebar({
  className,
  brandLabel,
  items,
  collapsed,
  onToggle,
  onNavigate,
}: {
  className?: string
  brandLabel: string
  items: PortalRailItem[]
  collapsed: boolean
  onToggle?: () => void
  onNavigate?: () => void
}) {
  return (
    <aside
      aria-label="Portal"
      className={`shrink-0 flex-col border-r border-portal-border bg-portal-sidebar ${
        collapsed ? 'w-[4.75rem]' : 'w-[16.5rem]'
      } ${className ?? ''}`}
    >
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? 'justify-center px-2' : ''}`}>
        <GirkiMark size={36} />
        {collapsed ? null : (
          <p className="truncate text-sm font-medium text-portal-text">{brandLabel}</p>
        )}
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {items.map((item) => (
          <PortalNavLink
            key={item.label}
            to={item.to}
            params={item.params}
            search={item.search}
            hash={item.hash}
            title={item.label}
            aria-label={item.label}
            aria-current={item.active ? 'page' : undefined}
            onClick={onNavigate}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              collapsed ? 'justify-center px-0' : ''
            } ${
              item.active
                ? 'bg-portal-accent/12 font-medium text-portal-text'
                : 'text-portal-muted hover:bg-white/4 hover:text-portal-text'
            }`}
          >
            {item.active ? (
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-portal-accent" />
            ) : null}
            <PortalIcon name={item.icon} size={22} />
            {collapsed ? null : <span className="flex-1 truncate">{item.label}</span>}
            {collapsed ? null : <NavBadge value={item.badge} />}
          </PortalNavLink>
        ))}
      </nav>
      {onToggle ? (
        <div className="border-t border-portal-border p-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-portal-muted hover:bg-white/4 hover:text-portal-text"
            onClick={onToggle}
          >
            <PanelLeft size={18} className={collapsed ? 'rotate-180' : ''} />
            {collapsed ? null : 'Collapse'}
          </button>
        </div>
      ) : null}
    </aside>
  )
}

function NavBadge({ value }: { value?: number | boolean }) {
  if (value === true) {
    return <span className="h-2 w-2 rounded-full bg-portal-accent" />
  }
  if (typeof value === 'number' && value > 0) {
    return (
      <span className="min-w-5 rounded-full bg-portal-accent px-1.5 py-0.5 text-center text-[10px] font-medium text-white">
        {value > 9 ? '9+' : value}
      </span>
    )
  }
  return null
}
