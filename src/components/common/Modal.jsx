import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useLockBody } from '../../hooks/useLockBody'
import { cn } from '../../utils/format'

// Centered dialog on desktop; slides up as a bottom sheet on mobile.
export function Modal({ open, onClose, title, children, className, footer, size = 'md' }) {
  useLockBody(open)
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const widths = { sm: 'md:max-w-md', md: 'md:max-w-xl', lg: 'md:max-w-3xl', xl: 'md:max-w-5xl' }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className={cn('relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[16px] bg-white shadow-[var(--shadow-lift)] md:rounded-[16px]', widths[size], className)}
          >
            <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line md:hidden" />
            {title && (
              <div className="flex items-center justify-between gap-4 border-b border-line-2 px-5 py-3.5">
                <h3 className="text-[17px] font-semibold">{title}</h3>
                <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-sand" aria-label="Close">
                  <X className="size-[18px]" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent style={footer ? undefined : { paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {children}
            </div>
            {footer && (
              <div className="border-t border-line-2 bg-white px-5 pt-4 shadow-[0_-12px_24px_-20px_rgb(18_49_63/0.35)]" style={{ paddingBottom: 'max(18px, calc(env(safe-area-inset-bottom) + 12px))' }}>
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
