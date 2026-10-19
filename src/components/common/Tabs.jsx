import { motion } from 'framer-motion'
import { cn } from '../../utils/format'

// Pill tabs with a shared animated indicator; scrolls horizontally on small screens.
export function Tabs({ tabs, value, onChange, id = 'tabs', className, size = 'md' }) {
  return (
    <div role="tablist" className={cn('no-scrollbar -mx-3 flex overflow-x-auto px-3 sm:mx-0 sm:px-0', className)}>
      <div className="flex gap-1 rounded-[12px] border border-line bg-white p-1">
        {tabs.map((t) => {
          const key = t.value ?? t
          const active = key === value
          return (
            <button
              type="button"
              key={key}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(key)}
              className={cn(
                'relative shrink-0 rounded-[9px] font-medium transition-colors',
                size === 'sm' ? 'h-8 px-3 text-[12.5px]' : 'h-9 px-4 text-[13.5px]',
                active ? 'text-white' : 'text-muted hover:text-ink',
              )}
            >
              {active && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-[9px] bg-gradient-to-b from-[#24566f] to-navy" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative z-10 flex items-center gap-1.5">
                {t.icon}
                {t.label ?? t}
                {t.count != null && <span className={cn('rounded-full px-1.5 text-[11px]', active ? 'bg-white/20' : 'bg-sand')}>{t.count}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
