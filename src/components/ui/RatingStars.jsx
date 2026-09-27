import { Star } from 'lucide-react'

export function RatingStars({ rating, count }) {
  if (rating == null) return null
  const rounded = Math.round(rating)
  return (
    <p className="flex items-center gap-1 text-xs text-muted">
      <span className="sr-only">{rating} out of 5 stars</span>
      <span className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((value) => (
          <Star key={value} size={12} className={value <= rounded ? 'fill-straw text-straw' : 'text-line'} />
        ))}
      </span>
      <span>{rating.toFixed(1)}</span>
      {count ? <span>({count})</span> : null}
    </p>
  )
}
