import type { ReactNode } from 'react'
import { girkiShapes } from '../../data/patterns'

/** Plate rings behind a headline word. */
export default function HeroHeadlineAccent({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <img
        src={girkiShapes.plate}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute left-1/2 top-[54%] -z-10 h-[5.5em] w-[5.5em] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-70 mix-blend-screen sm:h-[4.4em] sm:w-[4.4em]"
      />
      <span className="relative">{children}</span>
    </span>
  )
}
