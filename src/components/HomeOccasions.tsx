import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'
import { experiences } from '../data/home'

export default function HomeOccasions() {
  const [active, setActive] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  const videoRef = useRef<HTMLVideoElement>(null)
  const item = experiences[active]
  const hoverVideo = 'video' in item ? item.video : undefined
  const shouldShowVideo = Boolean(hoverVideo) && !prefersReducedMotion

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldShowVideo) return
    void video.play().catch(() => {})
    return () => {
      video.pause()
      video.currentTime = 0
    }
  }, [active, shouldShowVideo])

  return (
    <section id="experiences" className="relative overflow-hidden border-t-4 border-[#1c1418] bg-ploy-background-primary">
      <GirkiCroppedShape
        shape="wovenDiamond"
        anchor="bottom-left"
        size="28rem"
        opacity={0.12}
        fill="#1c1418"
      />

      <div className="relative mx-auto max-w-7xl section-pad !pb-12 lg:!pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-16 xl:grid-cols-[minmax(0,22rem)_1fr] xl:gap-20">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-ploy-text-secondary">
              OCCASIONS
            </p>
            <h2
              className="mt-6 font-display-heavy text-ploy-text-primary"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 3.75rem)' }}
            >
              <span className="block">Your table.</span>
              <span className="block">Your night.</span>
              <span className="mt-1 block text-ploy-accent-secondary">Your chef.</span>
            </h2>
            <Link
              to="/request"
              className="group mt-10 inline-flex items-center gap-3 font-heading text-base font-semibold tracking-tight text-ploy-text-primary"
            >
              <span className="border-b-2 border-ploy-accent-secondary pb-0.5">Explore all</span>
              <ArrowUpRight
                size={20}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </header>

          <div className="min-w-0">
            <div className="relative mb-8 lg:mb-10">
              <div
                className="absolute inset-0 translate-x-2 translate-y-2 rounded-[1.75rem] bg-[#1c1418]"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] border-2 border-[#1c1418] bg-[#1c1418]">
                <div className="relative aspect-[5/6] sm:aspect-[16/11] lg:aspect-[16/10]">
                  <img
                    key={item.image}
                    src={item.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
                  />
                  {shouldShowVideo && hoverVideo ? (
                    <video
                      ref={videoRef}
                      key={item.title}
                      src={hoverVideo}
                      poster={item.image}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-[#1c1418]/90 via-[#1c1418]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="font-display-heavy text-3xl text-girki-cream sm:text-4xl">
                      {item.title}
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-girki-cream/80 sm:text-base">
                      {item.copy}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <nav aria-label="Occasions">
              <ul className="divide-y-2 divide-[#1c1418]/12">
                {experiences.map((experience, index) => {
                  const isActive = index === active
                  return (
                    <li key={experience.title}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        className={`group flex w-full items-baseline gap-4 py-4 text-left transition-[padding,background-color] sm:py-5 ${
                          isActive
                            ? 'bg-white/50 pl-4 sm:pl-5'
                            : 'hover:bg-white/30 hover:pl-2'
                        }`}
                      >
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block font-heading text-lg tracking-tight transition-colors sm:text-xl ${
                              isActive ? 'text-ploy-text-primary' : 'text-ploy-text-secondary'
                            }`}
                          >
                            {experience.title}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={18}
                          className={`shrink-0 transition-all ${
                            isActive
                              ? 'text-ploy-accent-secondary opacity-100'
                              : 'text-ploy-text-secondary/0 group-hover:text-ploy-text-secondary/80'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <Link
              to="/request"
              className="mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-[#1c1418] bg-[#1c1418] font-heading text-sm font-semibold text-girki-cream transition-colors hover:bg-ploy-accent-secondary hover:border-ploy-accent-secondary sm:hidden"
            >
              Explore all occasions
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
