import { Link } from '@tanstack/react-router'
import { ExternalLink, MapPin } from 'lucide-react'
import type { Chef } from '../data/marketplace'
import { getChefInstagramUrl, isShowcaseChef } from '../lib/feature-flags'
import StarRating from './StarRating'

export default function ChefCard({
  chef,
  distanceKm,
  tone = 'light',
  size = 'default',
}: {
  chef: Chef
  distanceKm?: number
  tone?: 'light' | 'dark'
  size?: 'default' | 'large'
}) {
  const isLarge = size === 'large'
  const cardRadius = isLarge ? 'rounded-[2rem]' : 'rounded-[1.5rem]'
  const nameClass = isLarge
    ? 'font-heading text-3xl tracking-tight lg:text-[2.15rem]'
    : 'font-heading text-2xl tracking-tight'
  const overlayPad = isLarge ? 'p-6 md:p-7' : 'p-5'
  const metaPad = isLarge ? 'pt-5' : 'pt-4'
  const metaSize = isLarge ? 'text-base' : 'text-sm'
  const metaLabelSize = isLarge ? 'text-xs' : 'text-xs'
  const metaSecondary = tone === 'dark' ? 'text-white/65' : 'text-ploy-text-secondary'
  const metaAccent = tone === 'dark' ? 'text-ploy-accent-tertiary' : 'text-ploy-accent-tertiary'
  const metaPrice = tone === 'dark' ? 'text-white/80' : 'text-ploy-text-primary'
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
    <div className={`relative overflow-hidden ${isLarge ? 'aspect-[3/4.25] min-h-[22rem] sm:min-h-[26rem] lg:min-h-[30rem]' : 'aspect-3/4'}`}>
      <img
        src={chef.image}
        alt={chef.alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
      {showcase ? (
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 backdrop-blur-sm uppercase text-white/85 tracking-[0.14em] ${isLarge ? 'px-3.5 py-2 text-[0.7rem]' : 'px-3 py-1.5 text-[0.65rem]'}`}
        >
          <ExternalLink size={isLarge ? 14 : 12} aria-hidden="true" />
          Featured
        </span>
      ) : null}
      <div className={`absolute inset-x-0 bottom-0 text-white ${overlayPad}`}>
        <div className="flex items-end justify-between gap-3">
          <h3 className={nameClass}>{chef.name}</h3>
          {!showcase ? <StarRating rating={chef.rating} light /> : null}
        </div>
        <p
          className={`mt-2 flex items-center gap-1.5 text-white/75 ${isLarge ? 'text-base' : 'text-sm'}`}
        >
          <MapPin size={isLarge ? 16 : 14} aria-hidden="true" /> {chef.location}
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
          className={`block overflow-hidden ${cardRadius}`}
          aria-label={`${chef.name} on Instagram`}
        >
          {imageBlock}
        </a>
      ) : (
        <Link
          to="/chefs/$chefId"
          params={{ chefId: chef.id }}
          className={`block overflow-hidden ${cardRadius}`}
        >
          {imageBlock}
        </Link>
      )}
      <div className={`flex items-start justify-between gap-4 px-1 ${metaPad}`}>
        <div>
          <p className={`${metaSize} ${metaSecondary}`}>{chef.specialties}</p>
          <p className={`mt-1.5 ${metaLabelSize} tracking-[0.12em] uppercase ${metaAccent}`}>
            {showcase ? 'Featured chef' : `${chef.services} services`}
          </p>
        </div>
        <p className={`shrink-0 ${metaSize} ${metaPrice}`}>
          {showcase ? 'Coming soon' : chef.pricing}
        </p>
      </div>
    </article>
  )
}
