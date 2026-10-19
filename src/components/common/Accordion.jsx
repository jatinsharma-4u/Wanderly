import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '../../utils/format'

export function Accordion({ items, defaultOpen = 0, className }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={cn('divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q || i}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-[14.5px] font-semibold text-ink sm:px-5"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className={cn('grid size-7 shrink-0 place-items-center rounded-full border border-line transition-all duration-300', isOpen && 'rotate-45 border-ink bg-ink text-white')}>
                <Plus className="size-4" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-5 text-[14.5px] leading-relaxed text-muted sm:px-5">{item.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
