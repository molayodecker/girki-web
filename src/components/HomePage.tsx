import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Search,
  Users,
  X,
} from 'lucide-react'
import ChefCard from './ChefCard'
import ExperiencesGrid from './ExperiencesGrid'
import GirkiBorderStrip from './patterns/GirkiBorderStrip'
import GirkiComposition from './patterns/GirkiComposition'
import GirkiCroppedShape from './patterns/GirkiCroppedShape'
import DatePicker from './DatePicker'
import LocationAutocomplete from './LocationAutocomplete'
import SearchSelect from './SearchSelect'
import SiteFooter from './layout/SiteFooter'
import SiteHeader from './layout/SiteHeader'
import StarRating from './StarRating'
import { chefBenefits, cuisines, images, trustItems } from '../data/home'
import {
  chefs,
  cities,
  reviews,
  reviewStats,
  sampleMenus,
  type SampleMenu,
} from '../data/marketplace'

const guestSearchMap: Record<string, string> = {
  '2 guests': '2',
  '4 guests': '3-6',
  '6 guests': '3-6',
  '8+ guests': '7-12',
}

const howItWorks = [
  {
    title: 'Tell us what you want',
    copy: 'City, date, guests, and the kind of table you have in mind. No commitment.',
  },
  {
    title: 'Compare and customize',
    copy: 'Chefs propose menus around your evening. You refine every course.',
  },
  {
    title: 'Host, and do nothing else',
    copy: 'Groceries, cooking, service, and cleanup are theirs. The table is yours.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedMenu, setSelectedMenu] = useState<SampleMenu | null>(null)
  const [city, setCity] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState('2 guests')
  const [cuisine, setCuisine] = useState('Any cuisine')

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void navigate({
      to: '/request',
      search: {
        city: city.trim() || undefined,
        date: date || undefined,
        guests: guestSearchMap[guests],
        cuisine: cuisine === 'Any cuisine' ? undefined : cuisine,
      },
    })
  }

  return (
    <div className="min-h-screen bg-ploy-background-primary text-ploy-text-primary">
      <SiteHeader overlay />

      <main>
        <section
          id="top"
          className="relative bg-ploy-background-inverse text-ploy-text-inverse"
        >
          <div className="relative min-h-svh overflow-hidden">
            <img
              src={images.hero}
              alt="A private chef plating a meal in a modern home kitchen"
              className="absolute inset-0 h-full w-full object-cover object-[66%_center] scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,13,16,0.88)_0%,rgba(18,13,16,0.55)_42%,rgba(18,13,16,0.12)_78%,transparent_100%)]" />
            <GirkiCroppedShape
              shape="conversationArc"
              anchor="center-right"
              size="min(90vw, 56rem)"
              opacity={0.5}
              blend="screen"
              className="hidden sm:block"
            />
            <GirkiCroppedShape
              shape="plate"
              anchor="bottom-right"
              size="min(70vw, 38rem)"
              opacity={0.35}
              blend="screen"
              className="hidden md:block"
            />
            <GirkiCroppedShape
              shape="cloche"
              anchor="bottom-left"
              size="min(58vw, 32rem)"
              opacity={0.42}
              blend="screen"
              rotate={-8}
            />
            <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl items-end px-5 pb-28 pt-32 lg:items-center lg:px-8 lg:pb-24 lg:pt-24">
              <div className="grid w-full items-end gap-12 lg:grid-cols-[1.1fr_.9fr]">
                <div className="max-w-2xl">
                  <p className="typography-eyebrow text-ploy-accent-tertiary">
                    Private chefs across Africa
                  </p>
                  <h1 className="display-title mt-6 text-5xl sm:text-6xl lg:text-[5.4rem]">
                    Unforgettable meals, at your table.
                  </h1>
                  <p className="mt-7 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                    Book a private chef for date night, celebrations, weekly meals,
                    and villa stays, without leaving home.
                  </p>
                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Link className="btn btn-primary min-h-12 px-7 text-[0.78rem]" to="/request">
                      Start a request
                    </Link>
                    <Link
                      className="btn btn-ghost min-h-12 border border-white/20 px-6"
                      to="/become-a-chef"
                    >
                      Become a chef
                    </Link>
                  </div>
                </div>

                <form
                  id="find-chef"
                  onSubmit={onSearch}
                  className="w-full max-w-md justify-self-end rounded-[1.8rem] border border-white/10 bg-[#1c1418]/75 p-3 text-white shadow-[var(--shadow-lift)] backdrop-blur-xl max-md:mb-16"
                >
                  <div className="rounded-[1.3rem] bg-white/5 p-4">
                    <LocationAutocomplete
                      tone="dark"
                      value={city}
                      onChange={setCity}
                      placeholder="Accra, Lagos, Nairobi…"
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-[1.3rem] bg-white/5 p-4">
                      <DatePicker tone="dark" value={date} onChange={setDate} />
                    </div>
                    <div className="rounded-[1.3rem] bg-white/5 p-4">
                      <SearchSelect
                        tone="dark"
                        name="guests"
                        label="Guests"
                        value={guests}
                        options={['2 guests', '4 guests', '6 guests', '8+ guests']}
                        onChange={setGuests}
                        icon={<Users size={16} className="text-ploy-accent-tertiary" />}
                      />
                    </div>
                  </div>
                  <div className="mt-2 rounded-[1.3rem] bg-white/5 p-4">
                    <SearchSelect
                      tone="dark"
                      name="cuisine"
                      label="Cuisine"
                      value={cuisine}
                      options={[
                        'Any cuisine',
                        'Ghanaian',
                        'Nigerian',
                        'Moroccan',
                        'East African',
                        'Continental',
                      ]}
                      onChange={setCuisine}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3 min-h-14 w-full rounded-[1.3rem]">
                    <Search size={16} aria-hidden="true" /> Request a chef
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <GirkiBorderStrip />

        <section id="how-it-works" className="relative overflow-hidden bg-girki-charcoal text-girki-cream">
          <GirkiCroppedShape
            shape="conversationArc"
            anchor="top-left"
            size="min(72vw, 54rem)"
            opacity={0.52}
            blend="screen"
            pushX="-12%"
            pushY="-10%"
          />
          <GirkiCroppedShape
            shape="tableArch"
            anchor="top-right"
            size="min(68vw, 50rem)"
            opacity={0.42}
            blend="screen"
            pushX="14%"
            pushY="-8%"
          />
          <GirkiCroppedShape
            shape="plate"
            anchor="bottom-center"
            size="min(80vw, 58rem)"
            opacity={0.38}
            blend="screen"
            pushY="18%"
          />
          <div className="relative z-10 section-pad pb-20 sm:pb-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
                <div>
                  <p className="typography-eyebrow text-girki-saffron">The experience</p>
                  <h2 className="display-title mt-5 text-4xl text-girki-cream sm:text-5xl">
                    A restaurant, without leaving home.
                  </h2>
                </div>
                <p className="max-w-xl text-lg leading-relaxed text-girki-cream/70 lg:justify-self-end">
                  Girki brings chef discovery, a tailored menu, and African
                  hospitality into one quiet booking.
                </p>
              </div>
              <div className="mt-16 grid gap-10 border-t border-girki-cream/10 pt-12 md:grid-cols-3 md:gap-8">
                {howItWorks.map((step, index) => (
                  <article key={step.title} className="relative">
                    <p className="typography-eyebrow text-girki-saffron">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-4 font-heading text-2xl tracking-tight text-girki-cream">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-sm leading-relaxed text-girki-cream/65">
                      {step.copy}
                    </p>
                  </article>
                ))}
              </div>
              <Link
                to="/request"
                className="mt-14 inline-flex items-center gap-2 text-sm tracking-[0.08em] uppercase text-girki-cream"
              >
                Start a request <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <GirkiBorderStrip />
        </section>

        <section id="experiences" className="relative overflow-hidden bg-ploy-background-secondary">
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(28vw,18rem)] overflow-hidden lg:block"
            aria-hidden="true"
          >
            <GirkiComposition composition="tableRhythm" scale={0.85} opacity={0.9} />
            <div className="absolute inset-0 bg-linear-to-l from-transparent via-ploy-background-secondary/20 to-ploy-background-secondary" />
          </div>
          <div className="relative z-10 section-pad">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="typography-eyebrow">Occasions</p>
                  <h2 className="display-title mt-5 max-w-xl text-4xl sm:text-5xl">
                    Your table. Your night. Your chef.
                  </h2>
                </div>
                <Link
                  to="/request"
                  className="inline-flex items-center gap-2 text-sm tracking-[0.08em] uppercase"
                >
                  Explore all <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
              <ExperiencesGrid />
            </div>
          </div>
        </section>

        <section id="featured-chefs" className="section-pad">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="typography-eyebrow">The chefs</p>
              <h2 className="display-title mt-5 text-4xl sm:text-5xl">
                Africa has extraordinary chefs. Meet a few of them.
              </h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {chefs.slice(0, 3).map((chef) => (
                <ChefCard key={chef.id} chef={chef} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/chefs"
                className="inline-flex items-center gap-2 text-sm tracking-[0.08em] uppercase"
              >
                All chefs <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section-pad bg-ploy-background-secondary">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2rem]">
              <img
                src={images.cuisine}
                alt="A table of colorful African dishes"
                className="aspect-4/3 h-full w-full object-cover"
              />
              <GirkiCroppedShape
                shape="plate"
                anchor="bottom-right"
                size="min(55vw, 28rem)"
                opacity={0.7}
                blend="screen"
              />
              <div
                className="absolute inset-y-0 left-0 w-[32%] overflow-hidden"
                aria-hidden="true"
              >
                <GirkiComposition composition="gathering" scale={0.7} />
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-black/25" />
              </div>
            </div>
            <div>
              <p className="typography-eyebrow">Cuisine</p>
              <h2 className="display-title mt-5 text-4xl sm:text-5xl">
                A continent of flavor, one chef at a time.
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-ploy-text-secondary">
                Discover chefs through the dishes, traditions, and personal
                styles that make every table different.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {cuisines.map((cuisine) => (
                  <Link
                    key={cuisine}
                    to="/request"
                    search={{ cuisine }}
                    className="rounded-full border border-ploy-border-primary bg-ploy-neutral-primary-s0 px-4 py-2 text-sm transition-colors hover:border-ploy-accent-tertiary"
                  >
                    {cuisine}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="reviews" className="relative overflow-hidden bg-girki-plum text-ploy-text-inverse">
          <div className="relative h-28 overflow-hidden sm:h-32" aria-hidden="true">
            <GirkiComposition composition="celebration" scale={0.8} />
          </div>
          <div className="section-pad">
            <p className="typography-eyebrow">Guest notes</p>
            <h2 className="display-title mt-5 max-w-3xl text-4xl sm:text-5xl">
              The table is the review.
            </h2>
            <div className="mt-14 grid gap-8 border-y border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-4">
              {reviewStats.map((stat) => (
                <article key={stat.label}>
                  <p className="font-heading text-5xl text-ploy-accent-tertiary">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/50">{stat.label}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 grid gap-10 md:grid-cols-2">
              {reviews.map((review) => (
                <blockquote key={review.id} className="border-t border-white/10 pt-8">
                  <StarRating rating={review.rating} light />
                  <p className="mt-5 font-heading text-2xl font-normal leading-snug tracking-tight text-white/90">
                    {review.copy}
                  </p>
                  <footer className="mt-6 text-sm text-white/45">
                    {review.name} · {review.city}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="menus" className="section-pad">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="typography-eyebrow">Menus</p>
                <h2 className="display-title mt-5 max-w-xl text-4xl sm:text-5xl">
                  Every occasion deserves its own menu.
                </h2>
              </div>
              <Link
                to="/request"
                className="inline-flex items-center gap-2 text-sm tracking-[0.08em] uppercase"
              >
                Personalize yours <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {sampleMenus.map((menu) => (
                <button
                  key={menu.id}
                  type="button"
                  onClick={() => setSelectedMenu(menu)}
                  className="group text-left"
                >
                  <span className="block overflow-hidden rounded-[1.4rem]">
                    <img
                      src={menu.image}
                      alt=""
                      className="aspect-16/10 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="mt-4 block font-heading text-2xl tracking-tight">
                    {menu.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-ploy-text-secondary">
                    {menu.blurb}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs tracking-[0.14em] uppercase text-ploy-accent-tertiary">
                    See menu <ArrowUpRight size={13} aria-hidden="true" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad bg-ploy-background-secondary">
          <div className="mx-auto max-w-7xl">
            <p className="typography-eyebrow">Destinations</p>
            <h2 className="display-title mt-5 max-w-2xl text-4xl sm:text-5xl">
              Private chefs across Africa.
            </h2>
            <div className="mt-12 divide-y divide-ploy-border-primary border-y border-ploy-border-primary">
              {cities.map((city) => (
                <Link
                  key={city.slug}
                  to="/request"
                  search={{ city: city.name }}
                  className="group flex items-center justify-between py-5"
                >
                  <span className="font-heading text-3xl tracking-tight">{city.name}</span>
                  <span className="flex items-center gap-6 text-sm text-ploy-text-secondary">
                    {city.country}
                    <ArrowUpRight
                      size={18}
                      className="text-ploy-accent-tertiary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="relative overflow-hidden bg-girki-cream">
          <GirkiCroppedShape
            shape="wovenDiamond"
            anchor="top-right"
            size="26rem"
            opacity={0.22}
            blend="multiply"
          />
          <GirkiCroppedShape
            shape="flameDrop"
            anchor="bottom-left"
            size="18rem"
            opacity={0.2}
            blend="multiply"
          />
          <div className="relative z-10 section-pad">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl">
                <p className="typography-eyebrow">Trust</p>
                <h2 className="display-title mt-5 text-4xl sm:text-5xl">
                  Good food starts with trust.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-ploy-text-secondary">
                  Girki is being built so chef discovery feels personal, and the
                  booking standards stay clear.
                </p>
              </div>
              <div className="mt-14 grid gap-10 border-t border-ploy-border-primary pt-12 md:grid-cols-2 lg:grid-cols-4">
                {trustItems.map((item, index) => (
                  <article key={item.title}>
                    <p className="typography-eyebrow text-ploy-accent-secondary">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-4 font-heading text-2xl tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ploy-text-secondary">
                      {item.copy}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="become-a-chef" className="section-pad pt-0 lg:pt-0">
          <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-girki-plum text-ploy-text-on-accent-primary lg:grid-cols-2">
            <div className="relative min-h-105 overflow-hidden">
              <img
                src={images.opportunity}
                alt="A private chef welcoming guests to a prepared dining experience"
                className="h-full min-h-105 w-full object-cover object-left"
              />
              <GirkiCroppedShape
                shape="cloche"
                anchor="bottom-right"
                size="min(70vw, 30rem)"
                opacity={0.6}
                blend="screen"
              />
            </div>
            <div className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
              <GirkiComposition composition="feast" scale={0.75} opacity={0.55} />
              <div className="relative z-10">
                <p className="typography-eyebrow text-ploy-accent-tertiary">For chefs</p>
                <h2 className="display-title mt-5 text-4xl sm:text-5xl">
                  Turn your talent into a house.
                </h2>
                <p className="mt-6 leading-relaxed text-white/65">
                  Join Girki and build a business creating meaningful food
                  experiences for guests across Africa.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {chefBenefits.map((benefit) => (
                    <span key={benefit} className="flex items-center gap-2 text-sm text-white/80">
                      <Check size={15} className="text-ploy-accent-tertiary" aria-hidden="true" />
                      {benefit}
                    </span>
                  ))}
                </div>
                <Link className="btn btn-primary mt-10" to="/become-a-chef">
                  Apply as a chef
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedMenu ? (
        <div
          className="fixed inset-0 z-60 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setSelectedMenu(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.8rem] bg-ploy-neutral-primary-s0 p-7 shadow-[var(--shadow-lift)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="typography-eyebrow">Sample menu</p>
                <h3 className="mt-3 font-heading text-3xl tracking-tight">
                  {selectedMenu.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ploy-background-secondary"
                onClick={() => setSelectedMenu(null)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ploy-text-secondary">
              {selectedMenu.blurb}
            </p>
            <div className="mt-8 space-y-7">
              {selectedMenu.courses.map((course) => (
                <div key={course.title}>
                  <p className="typography-eyebrow">
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
            <Link
              to="/request"
              className="btn btn-primary mt-8"
              onClick={() => setSelectedMenu(null)}
            >
              Personalize this menu
            </Link>
          </div>
        </div>
      ) : null}

      <SiteFooter />
    </div>
  )
}
