import { Star } from 'lucide-react'

export default function StarRating({
  rating,
  light = false,
}: {
  rating: number
  light?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${
        light ? 'text-white' : 'text-ploy-text-primary'
      }`}
    >
      <Star
        size={14}
        className="fill-ploy-accent-tertiary text-ploy-accent-tertiary"
        aria-hidden="true"
      />
      {rating.toFixed(1)}
    </span>
  )
}
