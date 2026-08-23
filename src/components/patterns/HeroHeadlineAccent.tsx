import type { ReactNode } from 'react'
import { girkiBrand, girkiShapes } from '../../data/patterns'

/** Mobile-only plate rings + cutlery accent behind a headline word. */
export default function HeroHeadlineAccent({ children }: { children: ReactNode }) {
  return (
    <span className="relative isolate inline-block whitespace-nowrap">
      <span
        className="pointer-events-none absolute left-1/2 top-[54%] z-0 h-[3.6em] w-[3.6em] -translate-x-1/2 -translate-y-1/2 sm:hidden"
        aria-hidden="true"
      >
        <span
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '3.35em',
            height: '3.35em',
            border: `3px solid ${girkiBrand.terracotta}`,
            opacity: 0.82,
          }}
        />
        <span
          className="absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '2.15em',
            height: '2.15em',
            border: `2.5px solid ${girkiBrand.plum}`,
            opacity: 0.72,
          }}
        />
        <img
          src={girkiShapes.cutleryBar}
          alt=""
          draggable={false}
          className="absolute left-[calc(50%+1.55em)] top-1/2 h-[2.5em] w-auto max-w-none -translate-y-1/2 opacity-80 mix-blend-screen"
        />
        <img
          src={girkiShapes.cutleryBar}
          alt=""
          draggable={false}
          className="absolute right-[calc(50%+1.55em)] top-1/2 h-[2.5em] w-auto max-w-none -translate-y-1/2 opacity-55 mix-blend-screen scale-x-[-1]"
        />
      </span>
      <span className="relative z-10">{children}</span>
    </span>
  )
}
