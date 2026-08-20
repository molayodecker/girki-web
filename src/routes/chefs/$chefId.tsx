import { useState } from 'react'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Check, MapPin, MessageCircle } from 'lucide-react'
import DirectInquiryForm from '../../components/DirectInquiryForm'
import PageShell from '../../components/layout/PageShell'
import StarRating from '../../components/StarRating'
import { getChef, menusForChef } from '../../data/marketplace'

export const Route = createFileRoute('/chefs/$chefId')({
  loader: ({ params }) => {
    const chef = getChef(params.chefId)
    if (!chef) throw notFound()
    return { chef, menus: menusForChef(chef.id) }
  },
  component: ChefProfilePage,
})

function ChefProfilePage() {
  const { chef, menus } = Route.useLoaderData()
  const [showInquiry, setShowInquiry] = useState(false)

  return (
    <PageShell>
      <main className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="overflow-hidden rounded-[2rem]">
            <img src={chef.image} alt={chef.alt} className="aspect-3/4 w-full object-cover" />
          </div>
          <div className="lg:pt-6">
            <p className="typography-eyebrow">Private chef</p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <h1 className="display-title text-5xl lg:text-6xl">{chef.name}</h1>
              <StarRating rating={chef.rating} />
            </div>
            <p className="mt-5 flex items-center gap-2 text-ploy-text-secondary">
              <MapPin size={16} aria-hidden="true" /> {chef.location}
              <span className="text-ploy-accent-tertiary">·</span>
              {chef.services} services
            </p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ploy-text-secondary">{chef.bio}</p>
            <p className="mt-4 text-sm tracking-[0.04em] text-ploy-text-secondary">{chef.specialties}</p>
            <p className="mt-8 font-heading text-xl">{chef.pricing}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {chef.included.map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm">
                  <Check size={15} className="text-ploy-accent-tertiary" aria-hidden="true" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-primary min-h-12 px-7"
                aria-expanded={showInquiry}
                onClick={() => setShowInquiry((open) => !open)}
              >
                <MessageCircle size={16} aria-hidden="true" />
                Request to book
              </button>
              <Link
                to="/request"
                search={{ city: chef.city, cuisine: chef.cuisines[0] }}
                className="btn btn-outline min-h-12 px-7"
              >
                Request any chef
              </Link>
            </div>
          </div>
        </div>

        {showInquiry ? (
          <div id="inquiry" className="mx-auto mt-16 max-w-4xl">
            <DirectInquiryForm chef={chef} />
          </div>
        ) : null}

        {menus.length ? (
          <div className="mx-auto mt-24 max-w-7xl">
            <p className="typography-eyebrow">Menus</p>
            <h2 className="display-title mt-4 text-4xl">A taste of the table</h2>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {menus.map((menu) => (
                <article key={menu.id}>
                  <img src={menu.image} alt="" className="aspect-16/9 w-full rounded-[1.4rem] object-cover" />
                  <h3 className="mt-5 font-heading text-2xl tracking-tight">{menu.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ploy-text-secondary">{menu.blurb}</p>
                  <div className="mt-6 space-y-5">
                    {menu.courses.map((course) => (
                      <div key={course.title}>
                        <p className="typography-eyebrow">{course.title} · {course.note}</p>
                        <ul className="mt-2 space-y-1 text-sm text-ploy-text-secondary">
                          {course.dishes.map((dish) => <li key={dish}>{dish}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </PageShell>
  )
}
