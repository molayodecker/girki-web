import type { ReactNode } from 'react'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'

export default function PageShell({
  children,
  overlay,
  tone = 'cream',
}: {
  children: ReactNode
  overlay?: boolean
  tone?: 'cream' | 'sand'
}) {
  return (
    <div
      className={`min-h-screen text-ploy-text-primary ${
        tone === 'sand' ? 'bg-ploy-background-secondary' : 'bg-ploy-background-primary'
      }`}
    >
      <SiteHeader overlay={overlay} />
      {children}
      <SiteFooter />
    </div>
  )
}

export function PageIntro({
  eyebrow,
  title,
  copy,
  action,
}: {
  eyebrow: string
  title: string
  copy?: string
  action?: ReactNode
}) {
  return (
    <div className="max-w-3xl">
      <p className="typography-eyebrow">{eyebrow}</p>
      <h1 className="display-title mt-5 text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
      {copy ? (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ploy-text-secondary">
          {copy}
        </p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}
