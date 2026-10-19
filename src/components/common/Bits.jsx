import { Star, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils/format'

export function Rating({ value, count, className, light }) {
  return (
    <span className={cn('inline-flex items-center gap-1 text-[13px] font-semibold', light ? 'text-white' : 'text-ink', className)}>
      <Star className="size-3.5 fill-gold text-gold" />
      {value.toFixed(1)}
      {count != null && <span className={cn('font-normal', light ? 'text-white/75' : 'text-muted')}>({count.toLocaleString('en-IN')})</span>}
    </span>
  )
}

export function Stars({ value = 5, className }) {
  return (
    <span className={cn('inline-flex gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn('size-3.5', i <= value ? 'fill-gold text-gold' : 'fill-line text-line')} />
      ))}
    </span>
  )
}

const tones = {
  neutral: 'bg-sand text-ink-2',
  gold: 'bg-gold-soft text-gold-dark',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  sea: 'bg-sea-soft text-sea',
  white: 'bg-white/90 text-ink backdrop-blur',
  dark: 'bg-ink/60 text-white backdrop-blur',
}
export function Badge({ tone = 'neutral', className, children }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold leading-none', tones[tone], className)}>{children}</span>
}

export const statusTone = { confirmed: 'success', pending: 'gold', ongoing: 'info', completed: 'neutral', cancelled: 'danger', new: 'gold', 'in-progress': 'info', resolved: 'success' }
export function StatusBadge({ status }) {
  return (
    <Badge tone={statusTone[status] || 'neutral'} className="capitalize">
      {status.replace('-', ' ')}
    </Badge>
  )
}

export function WishButton({ id, className }) {
  const { wishlist, toggleWish } = useApp()
  const toast = useToast()
  const active = wishlist.includes(id)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      aria-label={active ? 'Remove from saved' : 'Save to wishlist'}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const added = !active
        toggleWish(id)
        toast(added ? 'Saved to your wishlist' : 'Removed from wishlist', added ? 'success' : 'info')
      }}
      className={cn('grid size-9 place-items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition hover:bg-white', className)}
    >
      <Heart className={cn('size-[17px] transition-colors', active && 'fill-danger text-danger')} />
    </motion.button>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-xl bg-sand-2/70', className)} />
}
