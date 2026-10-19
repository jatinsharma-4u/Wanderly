import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../utils/format'

/**
 * Positions a popover relative to its anchor: opens downward by default, flips upward when
 * there isn't enough room below, and nudges sideways so it never leaves the viewport.
 */
export function useSmartPosition(open, anchorRef, popRef, gap = 8) {
  const [pos, setPos] = useState({ placement: 'bottom', dx: 0, maxH: 360 })

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const a = anchorRef.current?.getBoundingClientRect()
      const p = popRef.current
      if (!a || !p) return
      const vh = window.innerHeight
      const vw = window.innerWidth
      const natural = Math.min(p.scrollHeight, 420)
      const below = vh - a.bottom - gap - 12
      const above = a.top - gap - 12
      const placement = below >= natural || below >= above ? 'bottom' : 'top'
      const maxH = Math.max(160, Math.min(420, placement === 'bottom' ? below : above))
      // Horizontal clamp (measured without the previous nudge)
      const width = p.offsetWidth
      const alignRight = p.dataset.align === 'right'
      const left = alignRight ? a.right - width : a.left
      let dx = 0
      if (left + width > vw - 8) dx = vw - 8 - (left + width)
      if (left + dx < 8) dx = 8 - left
      setPos({ placement, dx, maxH })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, { passive: true })
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place)
    }
  }, [open, anchorRef, popRef, gap])

  return pos
}

export function useOutsideClose(open, rootRef, onClose) {
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !rootRef.current?.contains(e.target) && onClose()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, rootRef, onClose])
}

// Generic anchored panel used by Select, DateRangePicker and TravellerPicker.
export function Popover({ open, anchorRef, align = 'left', className, children, role = 'dialog', label, popRef: externalRef }) {
  const innerRef = useRef(null)
  const popRef = externalRef || innerRef
  const { placement, dx, maxH } = useSmartPosition(open, anchorRef, popRef)
  const up = placement === 'top'
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={popRef}
          role={role}
          aria-label={label}
          data-align={align}
          data-lenis-prevent
          initial={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: up ? 6 : -6, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: dx, maxHeight: maxH, transformOrigin: up ? 'bottom' : 'top' }}
          className={cn(
            'absolute z-[70] overflow-y-auto overscroll-contain rounded-[14px] border border-line bg-white shadow-[0_24px_50px_-18px_rgb(18_49_63/0.35)]',
            up ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
