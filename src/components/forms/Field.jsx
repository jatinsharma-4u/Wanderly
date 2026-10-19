import { useId, cloneElement, isValidElement } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../utils/format'

// Label + control + animated error message. Wires up id/aria-describedby automatically.
export function Field({ label, error, hint, children, className, optional }) {
  const id = useId()
  const errId = `${id}-err`
  const control = isValidElement(children) ? cloneElement(children, { id, 'aria-describedby': error ? errId : undefined }) : children
  return (
    <div className={cn('min-w-0', className)}>
      {label && (
        <label htmlFor={id} className="label">
          {label} {optional && <span className="font-normal text-faint">(optional)</span>}
        </label>
      )}
      {control}
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p id={errId} role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 flex items-center gap-1 text-[12.5px] font-medium text-danger">
            <AlertCircle className="size-3.5" /> {error.message}
          </motion.p>
        ) : (
          hint && <p className="mt-1.5 text-[12.5px] text-faint">{hint}</p>
        )}
      </AnimatePresence>
    </div>
  )
}
