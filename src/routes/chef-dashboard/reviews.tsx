import { createFileRoute } from '@tanstack/react-router'
import { Star } from 'lucide-react'
import { chefPortalDemo } from '../../data/chef-portal-demo'
import { matchesQuery } from '../../components/portal/format'
import { Route as ChefDashboardRoute } from './route'

export const Route = createFileRoute('/chef-dashboard/reviews')({
  component: ChefReviewsPage,
})

function ChefReviewsPage() {
  const search = ChefDashboardRoute.useSearch()
  const { reviews } = chefPortalDemo
  const items = reviews.items.filter((review) =>
    matchesQuery(`${review.name} ${review.meta} ${review.text}`, search.q),
  )

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <section className="portal-card h-fit p-5 xl:col-span-4">
        <p className="font-heading text-5xl tracking-tight">{reviews.average}</p>
        <p className="mt-2 text-sm text-portal-muted">{reviews.total}</p>
        <ul className="mt-6 space-y-2.5">
          {reviews.dist.map((row) => (
            <li key={row.star} className="flex items-center gap-3 text-sm">
              <span className="w-3 text-portal-muted">{row.star}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-portal-accent/70"
                  style={{ width: `${row.w}%` }}
                />
              </div>
              <span className="w-6 text-right text-portal-muted">{row.n}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-3 xl:col-span-8">
        {items.map((review) => (
          <article key={`${review.name}-${review.meta}`} className="portal-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{review.name}</p>
                  <span className="flex items-center gap-0.5 text-portal-accent" aria-label={`${review.stars} stars`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < review.stars ? 'currentColor' : 'none'}
                        className={i < review.stars ? '' : 'text-portal-muted/40'}
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-portal-muted">{review.text}</p>
              </div>
              <p className="text-xs text-portal-muted">{review.meta}</p>
            </div>
            <button type="button" className="mt-4 text-sm text-portal-accent hover:underline">
              Reply
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}
