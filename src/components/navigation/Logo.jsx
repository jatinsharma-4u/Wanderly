import { Link } from 'react-router-dom'
import { brand } from '../../config/brand'
import { cn } from '../../utils/format'

// Pure typographic wordmark, no icon. Styling lives in config/brand.js so it can be swapped easily.
export function Logo({ className, light, size = 'md' }) {
  const { uppercase, tracking, weight } = brand.wordmark
  return (
    <Link to="/" className={cn('group inline-flex items-center', className)} aria-label={`${brand.name} home`}>
      <span
        className={cn(
          'relative leading-none transition-colors',
          size === 'lg' ? 'text-[19px]' : 'text-[15px] sm:text-[16px]',
          light ? 'text-white' : 'text-navy',
          uppercase && 'uppercase',
        )}
        style={{ letterSpacing: tracking, fontWeight: weight, marginRight: `-${tracking}` }}
      >
        {brand.name}
        <span className={cn('absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 group-hover:w-full', light ? 'bg-white/70' : 'bg-gold')} />
      </span>
    </Link>
  )
}
