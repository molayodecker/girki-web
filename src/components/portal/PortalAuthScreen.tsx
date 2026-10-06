import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import GirkiMark from '../brand/GirkiMark'

export default function PortalAuthScreen({
  eyebrow,
  title,
  copy,
  error,
  children,
  footer,
}: {
  eyebrow: string
  title: string
  copy: string
  error?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="portal-app relative flex min-h-dvh items-center justify-center overflow-hidden bg-portal-bg px-4 py-12 text-portal-text sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(196_92_61/0.14),transparent_55%)]"
      />

      <div className="relative w-full max-w-[26rem]">
        <div className="portal-card overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="transition hover:brightness-110" aria-label="Girki home">
              <GirkiMark size={52} className="shadow-[0_0_0_6px_rgb(196_92_61/0.18)]" />
            </Link>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-portal-muted">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-[2rem]">
              {title}
            </h1>
            <p className="mt-3 max-w-[22rem] text-pretty text-sm leading-relaxed text-portal-muted">
              {copy}
            </p>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-6 rounded-xl border border-portal-accent/30 bg-portal-accent/10 px-4 py-3 text-center text-sm text-portal-accent"
            >
              {error}
            </p>
          ) : null}

          <div className="portal-auth-form mt-8 border-t border-portal-border pt-7 text-left">
            {children}
          </div>
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-portal-muted [&_a]:font-medium [&_a]:text-portal-text [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-portal-accent">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
