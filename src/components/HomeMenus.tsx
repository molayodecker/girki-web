import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, X } from 'lucide-react'
import { sampleMenus, type SampleMenu } from '../data/marketplace'

function MenuModal({
  menu,
  onClose,
}: {
  menu: SampleMenu
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto border-4 border-[#1c1418] bg-ploy-neutral-primary-s0 p-7 shadow-[12px_12px_0_#1c1418]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-labelledby="menu-modal-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-ploy-text-secondary">
              SAMPLE MENU
            </p>
            <h3 id="menu-modal-title" className="mt-3 font-display-heavy text-3xl text-ploy-text-primary">
              {menu.title}
            </h3>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center border-2 border-[#1c1418]/15 hover:bg-ploy-background-secondary"
            onClick={onClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ploy-text-secondary">{menu.blurb}</p>
        <div className="mt-8 space-y-7">
          {menu.courses.map((course) => (
            <div key={course.title}>
              <p className="font-heading text-[0.65rem] font-semibold tracking-[0.28em] text-ploy-accent-tertiary uppercase">
                {course.title} · {course.note}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ploy-text-secondary">
                {course.dishes.map((dish) => (
                  <li key={dish}>{dish}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link to="/request" className="btn btn-primary mt-8" onClick={onClose}>
          Personalize this menu
        </Link>
      </div>
    </div>
  )
}

export default function HomeMenus() {
  const [active, setActive] = useState(0)
  const [selectedMenu, setSelectedMenu] = useState<SampleMenu | null>(null)
  const menu = sampleMenus[active]

  return (
    <section id="menus" className="border-t-4 border-[#1c1418] bg-ploy-background-primary">
      <div className="relative mx-auto max-w-7xl section-pad">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          <div className="lg:col-span-5 xl:col-span-4">
            <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/50">
              MENUS
            </p>
            <h2
              className="mt-6 font-display-heavy text-ploy-text-primary"
              style={{ fontSize: 'clamp(2.35rem, 6.5vw, 4rem)' }}
            >
              <span className="block">Every occasion</span>
              <span className="block font-display-serif text-ploy-accent-secondary">
                deserves its own menu.
              </span>
            </h2>
            <Link
              to="/request"
              className="group mt-8 inline-flex items-center gap-3 font-heading text-base font-semibold tracking-tight text-ploy-text-primary"
            >
              <span className="border-b-2 border-ploy-accent-secondary pb-0.5">Personalize yours</span>
              <ArrowUpRight
                size={20}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>

            <button
              type="button"
              onClick={() => setSelectedMenu(menu)}
              className="group relative mt-10 w-full text-left lg:sticky lg:top-28"
            >
              <div
                className="absolute inset-0 translate-x-3 translate-y-3 bg-ploy-accent-secondary"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden border-4 border-[#1c1418] bg-[#1c1418] transition-transform duration-500 group-hover:-translate-y-0.5">
                <div className="relative aspect-[4/5] sm:aspect-[5/6]">
                  <img
                    key={menu.id}
                    src={menu.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#1c1418]/92 via-[#1c1418]/35 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-girki-saffron">
                      On the pass
                    </p>
                    <p
                      className="mt-2 font-display-heavy text-girki-cream"
                      style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
                    >
                      {menu.title}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-girki-cream/80">
                      {menu.blurb}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 font-heading text-xs font-semibold tracking-[0.18em] text-girki-saffron uppercase">
                      See full menu
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="min-w-0 lg:col-span-7 xl:col-span-8 lg:pt-16">
            <p className="mb-4 font-heading text-xs font-semibold tracking-[0.28em] text-ploy-text-secondary uppercase">
              Sample menus from our chefs
            </p>
            <ul className="border-t-2 border-[#1c1418]">
              {sampleMenus.map((item, index) => {
                const isActive = index === active
                return (
                  <li key={item.id} className="border-b-2 border-[#1c1418]">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(index)}
                      onFocus={() => setActive(index)}
                      onClick={() => setSelectedMenu(item)}
                      className={`group flex w-full items-center gap-4 px-1 py-5 text-left transition-colors sm:gap-5 sm:py-6 ${
                        isActive ? 'bg-ploy-accent-secondary' : 'hover:bg-white/70'
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block font-display-heavy leading-tight ${
                            isActive ? 'text-[#1c1418]' : 'text-ploy-text-primary'
                          }`}
                          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.85rem)' }}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`mt-1 block line-clamp-2 font-heading text-sm leading-snug ${
                            isActive ? 'text-[#1c1418]/75' : 'text-ploy-text-secondary'
                          }`}
                        >
                          {item.blurb}
                        </span>
                      </span>
                      <span
                        className={`hidden h-14 w-14 shrink-0 overflow-hidden border-2 sm:block ${
                          isActive ? 'border-[#1c1418]' : 'border-[#1c1418]/20'
                        }`}
                        aria-hidden="true"
                      >
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </span>
                      <span
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-11 sm:w-11 ${
                          isActive
                            ? 'border-[#1c1418] bg-[#1c1418] text-girki-cream'
                            : 'border-[#1c1418]/25 text-ploy-text-primary'
                        }`}
                        aria-hidden="true"
                      >
                        <ArrowUpRight size={18} />
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {selectedMenu ? (
        <MenuModal menu={selectedMenu} onClose={() => setSelectedMenu(null)} />
      ) : null}
    </section>
  )
}
