import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import type { Chef } from '../data/marketplace'
import StarRating from './StarRating'

export default function ChefCard({
  chef,
  distanceKm,
}: {
  chef: Chef
  distanceKm?: number
}) {
  const distanceLabel =
    distanceKm == null
      ? undefined
      : distanceKm < 1
        ? 'Under 1 km'
        : distanceKm < 10
          ? `${distanceKm.toFixed(1)} km`
          : `${Math.round(distanceKm)} km`
  return (
    <article className="group">
      <Link
        to="/chefs/$chefId"
        params={{ chefId: chef.id }}
        className="block overflow-hidden rounded-[1.5rem]"
      >
        <div className="relative aspect-3/4 overflow-hidden">
          <img
            src={chef.image}
            alt={chef.alt}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <div className="flex items-end justify-between gap-3">
              <h3 className="font-heading text-2xl tracking-tight">{chef.name}</h3>
              <StarRating rating={chef.rating} light />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
              <MapPin size={14} aria-hidden="true" /> {chef.location}
              {distanceLabel ? <span>· {distanceLabel}</span> : null}
            </p>
          </div>
        </div>
      </Link>
      <div className="flex items-start justify-between gap-4 px-1 pt-4">
        <div>
          <p className="text-sm text-ploy-text-secondary">{chef.specialties}</p>
          <p className="mt-1 text-xs tracking-[0.12em] uppercase text-ploy-accent-tertiary">
            {chef.services} services
          </p>
        </div>
        <p className="shrink-0 text-sm">{chef.pricing}</p>
      </div>
    </article>
  )
}
