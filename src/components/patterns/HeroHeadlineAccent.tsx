import type { ReactNode } from 'react'
import { girkiBrand, girkiShapes } from '../../data/patterns'

/** Mobile-only plate rings + cutlery accent behind a headline word. */
export default function HeroHeadlineAccent({ children }: { children: ReactNode }) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <span
        className="pointer-events-none absolute left-1/2 top-[54%] z-0 h-[5.5em] w-[5.5em] -translate-x-1/2 -translate-y-1/2 sm:hidden"
        style={{
          maskImage: 'radial-gradient(circle, black 42%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle, black 42%, transparent 78%)',
        }}
        aria-hidden="true"
      >
        <span
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '5.2em',
            height: '5.2em',
            border: `3.5px solid ${girkiBrand.terracotta}`,
            opacity: 0.38,
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '3.6em',
            height: '3.6em',
            border: `3px solid ${girkiBrand.plum}`,
            opacity: 0.32,
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '2.2em',
            height: '2.2em',
            border: `2px solid ${girkiBrand.saffron}`,
            opacity: 0.28,
          }}
        />
        <img
          src={girkiShapes.cutleryBar}
          alt=""
          draggable={false}
          className="absolute left-[calc(50%+2.1em)] top-1/2 h-[3.2em] w-auto max-w-none -translate-y-1/2 opacity-35 mix-blend-screen blur-[0.4px]"
        />
        <img
          src={girkiShapes.cutleryBar}
          alt=""
          draggable={false}
          className="absolute right-[calc(50%+2.1em)] top-1/2 h-[3.2em] w-auto max-w-none -translate-y-1/2 opacity-25 mix-blend-screen blur-[0.4px] scale-x-[-1]"
        />
      </span>
      <span className="relative z-10">{children}</span>
    </span>
  )
}
