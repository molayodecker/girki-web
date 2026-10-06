import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowUpRight, Search, Users } from 'lucide-react'
import DatePicker from './DatePicker'
import LocationAutocomplete from './LocationAutocomplete'
import SearchSelect from './SearchSelect'
import { images } from '../data/images'

const guestSearchMap: Record<string, string> = {
  '2 guests': '2',
  '4 guests': '3-6',
  '6 guests': '3-6',
  '8+ guests': '7-12',
}

export default function HomeHero() {
  const navigate = useNavigate()
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
    <section id="top" className="border-b-4 border-[#1c1418] bg-ploy-background-primary">
      <div className="grid lg:min-h-[calc(100svh-4.25rem)] lg:grid-cols-2 xl:min-h-[calc(100svh-5rem)]">
        <div className="relative flex flex-col px-5 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10 lg:justify-center lg:px-10 lg:py-14 xl:px-12">
          <p className="font-heading text-[0.65rem] font-semibold tracking-[0.42em] text-[#1c1418]/55">
            PRIVATE CHEFS · ACCRA AND ACROSS AFRICA
          </p>
          <h1
            className="mt-6 font-display-heavy text-ploy-text-primary"
            style={{ fontSize: 'clamp(2.75rem, 8vw, 5.5rem)' }}
          >
            <span className="block leading-[0.92]">Private chef.</span>
            <span className="mt-1 block font-display-serif text-ploy-accent-secondary">
              Food that slaps.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ploy-text-secondary sm:text-lg">
            Professional chefs shop, cook, serve, and clean in the kitchen you&apos;re in: date
            night, Sunday pots, villa stays.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/request"
              className="inline-flex min-h-12 items-center gap-2 bg-ploy-accent-secondary px-6 font-heading text-sm font-semibold text-[#1c1418] transition-transform hover:-translate-y-0.5"
            >
              Book a chef
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/chefs"
              className="inline-flex min-h-12 items-center border-2 border-[#1c1418] px-6 font-heading text-sm font-semibold text-ploy-text-primary transition-colors hover:bg-[#1c1418] hover:text-girki-cream"
            >
              Browse chefs
            </Link>
          </div>

          <form
            id="find-chef"
            onSubmit={onSearch}
            className="relative mt-10 w-full max-w-lg lg:mt-12"
          >
            <div
              className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-girki-saffron"
              aria-hidden="true"
            />
            <div className="relative border-4 border-[#1c1418] bg-girki-charcoal p-4 text-girki-cream sm:p-5">
              <p className="font-heading text-[0.65rem] font-semibold tracking-[0.28em] text-girki-saffron uppercase">
                Request a chef
              </p>
              <div className="mt-4 border border-white/10 bg-white/5 p-4">
                <LocationAutocomplete
                  tone="dark"
                  value={city}
                  onChange={setCity}
                  placeholder="Accra, Kumasi, Tema…"
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="border border-white/10 bg-white/5 p-4">
                  <DatePicker tone="dark" value={date} onChange={setDate} />
                </div>
                <div className="border border-white/10 bg-white/5 p-4">
                  <SearchSelect
                    tone="dark"
                    name="guests"
                    label="Guests"
                    value={guests}
                    options={['2 guests', '4 guests', '6 guests', '8+ guests']}
                    onChange={setGuests}
                    icon={<Users size={20} className="text-girki-saffron" />}
                  />
                </div>
              </div>
              <div className="mt-3 border border-white/10 bg-white/5 p-4">
                <SearchSelect
                  tone="dark"
                  name="cuisine"
                  label="Cuisine"
                  value={cuisine}
                  options={[
                    'Any cuisine',
                    'Ghanaian',
                    'West African',
                    'Continental',
                    'Seafood',
                    'Vegetarian',
                  ]}
                  onChange={setCuisine}
                />
              </div>
              <button
                type="submit"
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 bg-girki-saffron font-heading text-base font-semibold text-[#1c1418] transition-transform hover:-translate-y-0.5 sm:min-h-16"
              >
                <Search size={20} aria-hidden="true" />
                Request a chef
              </button>
            </div>
          </form>
        </div>

        <div className="relative min-h-[min(52vh,28rem)] lg:min-h-0">
          <video
            className="absolute inset-0 h-full w-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
            poster={images.hero}
            aria-hidden="true"
          >
            <source src={images.heroVideo} type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0 bg-[#1c1418]/25 lg:bg-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-2 bg-girki-saffron lg:block"
            aria-hidden="true"
          />
          <p
            className="pointer-events-none absolute bottom-6 right-6 hidden max-w-[11rem] font-heading text-sm font-medium leading-snug text-girki-cream/90 lg:block"
            aria-hidden="true"
          >
            Fire, smoke, and someone else doing the dishes.
          </p>
        </div>
      </div>
    </section>
  )
}
