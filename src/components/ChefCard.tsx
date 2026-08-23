import { Link } from '@tanstack/react-router'
import { ExternalLink, MapPin } from 'lucide-react'
import type { Chef } from '../data/marketplace'
import { getChefInstagramUrl, isShowcaseChef } from '../lib/feature-flags'
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

  const showcase = isShowcaseChef(chef.id)
  const instagramUrl = getChefInstagramUrl(chef.id)

  const imageBlock = (
    <div className="relative aspect-3/4 overflow-hidden">
      <img
        src={chef.image}
        alt={chef.alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
      {showcase ? (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[0.65rem] tracking-[0.14em] uppercase text-white/85 backdrop-blur-sm">
          <ExternalLink size={12} aria-hidden="true" />
          Featured
        </span>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="flex items-end justify-between gap-3">
          <h3 className="font-heading text-2xl tracking-tight">{chef.name}</h3>
          {!showcase ? <StarRating rating={chef.rating} light /> : null}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
          <MapPin size={14} aria-hidden="true" /> {chef.location}
          {distanceLabel ? <span>· {distanceLabel}</span> : null}
        </p>
      </div>
    </div>
  )

  return (
    <article className="group">
      {showcase && instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-[1.5rem]"
          aria-label={`${chef.name} on Instagram`}
        >
          {imageBlock}
        </a>
      ) : (
        <Link
          to="/chefs/$chefId"
          params={{ chefId: chef.id }}
          className="block overflow-hidden rounded-[1.5rem]"
        >
          {imageBlock}
        </Link>
      )}
      <div className="flex items-start justify-between gap-4 px-1 pt-4">
        <div>
          <p className="text-sm text-ploy-text-secondary">{chef.specialties}</p>
          <p className="mt-1 text-xs tracking-[0.12em] uppercase text-ploy-accent-tertiary">
            {showcase ? 'Featured chef' : `${chef.services} services`}
          </p>
        </div>
        <p className="shrink-0 text-sm">{showcase ? 'Coming soon' : chef.pricing}</p>
      </div>
    </article>
  )
}
