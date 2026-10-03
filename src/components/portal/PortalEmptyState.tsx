import type { ReactNode } from 'react'

export default function PortalEmptyState({
  title = 'Nothing here yet',
  copy,
  action,
}: {
  title?: string
  copy?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-portal-surface">
        <DiningIllustration />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-tight">{title}</h2>
      {copy ? <p className="mt-2 max-w-sm text-sm leading-relaxed text-portal-muted">{copy}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function PortalError({ message }: { message: string }) {
  if (!message) return null
  return (
    <p className="mb-5 rounded-2xl border border-portal-accent/25 bg-portal-accent/10 px-5 py-4 text-sm text-portal-accent">
      {message}
    </p>
  )
}

function DiningIllustration() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="h-14 w-auto text-portal-accent"
      fill="none"
      aria-hidden="true"
    >
      <rect x="18" y="78" width="72" height="44" rx="6" stroke="currentColor" strokeWidth="2" />
      <rect x="26" y="86" width="56" height="10" rx="2" fill="currentColor" opacity="0.35" />
      <rect x="26" y="100" width="56" height="10" rx="2" fill="currentColor" opacity="0.2" />
      <path
        d="M118 96c0-18 14-32 32-32s32 14 32 32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <ellipse cx="150" cy="100" rx="38" ry="10" stroke="currentColor" strokeWidth="2" />
      <rect x="142" y="62" width="16" height="10" rx="3" fill="currentColor" />
      <path d="M210 46v54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="210" cy="40" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M210 50c12 4 18 14 18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 128h244" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
    </svg>
  )
}
