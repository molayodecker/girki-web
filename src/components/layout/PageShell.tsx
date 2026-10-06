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
      className={`min-h-screen overflow-x-clip text-ploy-text-primary ${
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
  align = 'left',
}: {
  eyebrow: string
  title: string
  copy?: string
  action?: ReactNode
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'
  return (
    <div
      className={`max-w-3xl border-b-4 border-[#1c1418] pb-10 ${
        centered ? 'mx-auto text-center' : ''
      }`}
    >
      <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/55 uppercase">
        {eyebrow}
      </p>
      <h1
        className="mt-6 font-display-heavy text-ploy-text-primary"
        style={{ fontSize: 'clamp(2.25rem, 5.5vw, 3.75rem)' }}
      >
        {title}
      </h1>
      {copy ? (
        <p
          className={`mt-6 max-w-2xl text-base leading-relaxed text-ploy-text-secondary sm:text-lg ${
            centered ? 'mx-auto' : ''
          }`}
        >
          {copy}
        </p>
      ) : null}
      {action ? (
        <div className={`mt-8 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>
          {action}
        </div>
      ) : null}
    </div>
  )
}
