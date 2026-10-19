import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Loader2 } from 'lucide-react'
import { cn } from '../../utils/format'

// Soft, glossy buttons from the style guide: gentle gradient, inner highlight, separate arrow tile.
const variants = {
  primary:
    'bg-gradient-to-b from-[#24566f] to-navy text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_8px_20px_-10px_rgb(26_67_90/0.7)] hover:from-[#2b6481] hover:to-[#1f4d66]',
  gold:
    'bg-gradient-to-b from-[#5a9cba] to-gold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_8px_20px_-10px_rgb(73_135_164/0.9)] hover:from-[#62a6c4] hover:to-[#3f7c99]',
  outline: 'border border-line bg-white text-ink hover:border-gold/60 hover:text-navy',
  ghost: 'text-ink hover:bg-sand',
  white:
    'bg-gradient-to-b from-white to-[#eef6fb] text-navy ring-1 ring-white/70 shadow-[inset_0_1px_0_white,0_10px_24px_-12px_rgb(18_49_63/0.45)] hover:to-white',
  glass: 'bg-white/15 text-white ring-1 ring-white/35 backdrop-blur-md hover:bg-white/25',
  danger: 'bg-danger text-white hover:brightness-95',
}
const sizes = {
  sm: 'h-9 px-3.5 text-[12.5px] gap-1.5',
  md: 'h-10 px-4 text-[13.5px] gap-2',
  lg: 'h-11 px-5 text-[14px] gap-2',
}

const base =
  'inline-flex select-none items-center justify-center whitespace-nowrap rounded-[12px] font-medium tracking-[0.005em] transition-all duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const tileTone = {
  primary: 'bg-white/15 ring-1 ring-white/20',
  gold: 'bg-white/20 ring-1 ring-white/30',
  white: 'bg-navy text-white',
  outline: 'bg-navy text-white',
  ghost: 'bg-navy text-white',
  glass: 'bg-white text-navy',
  danger: 'bg-white/20',
}

function Inner({ children, arrow, loading, size, variant }) {
  return (
    <>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
      {arrow && (
        <span
          className={cn(
            '-mr-1.5 grid place-items-center rounded-[8px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5',
            tileTone[variant],
            size === 'sm' ? 'size-6' : 'size-7',
          )}
        >
          <ArrowUpRight className="size-3.5" />
        </span>
      )}
    </>
  )
}

export const Button = forwardRef(function Button({ variant = 'primary', size = 'md', arrow, loading, className, children, type = 'button', ...rest }, ref) {
  return (
    <button ref={ref} type={type} className={cn('group', base, variants[variant], sizes[size], className)} disabled={loading || rest.disabled} {...rest}>
      <Inner arrow={arrow} loading={loading} size={size} variant={variant}>
        {children}
      </Inner>
    </button>
  )
})

export function ButtonLink({ to, variant = 'primary', size = 'md', arrow, className, children, ...rest }) {
  return (
    <Link to={to} className={cn('group', base, variants[variant], sizes[size], className)} {...rest}>
      <Inner arrow={arrow} size={size} variant={variant}>
        {children}
      </Inner>
    </Link>
  )
}

export function IconButton({ className, label, children, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn('grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink/30 active:scale-95', className)}
      {...rest}
    >
      {children}
    </button>
  )
}
