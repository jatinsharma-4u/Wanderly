import { motion } from 'framer-motion'
import { Check, XCircle } from 'lucide-react'
import { bookingStages } from '../../data/bookings'
import { formatDate, addDays, cn } from '../../utils/format'

// Vertical status tracker. Dates are simulated relative to booking creation.
export function BookingTimeline({ booking }) {
  if (booking.status === 'cancelled') {
    return (
      <div className="flex items-start gap-3 rounded-xl bg-danger-soft p-4">
        <XCircle className="mt-0.5 size-5 shrink-0 text-danger" />
        <div>
          <p className="text-[14.5px] font-semibold text-danger">Booking cancelled</p>
          <p className="text-[13px] text-ink-2">Any eligible refund is processed within 5–7 working days to the original payment method.</p>
        </div>
      </div>
    )
  }
  const current = booking.stage ?? 0
  return (
    <ol className="relative">
      {bookingStages.map((s, i) => {
        const done = i < current
        const active = i === current
        return (
          <motion.li key={s.key} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative flex gap-4 pb-6 last:pb-0">
            {i < bookingStages.length - 1 && <span className={cn('absolute left-[13px] top-7 h-[calc(100%-20px)] w-0.5', done ? 'bg-success' : 'bg-line')} />}
            <span
              className={cn(
                'relative z-10 grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                done && 'bg-success text-white',
                active && 'bg-ink text-white ring-4 ring-gold-soft',
                !done && !active && 'border border-line bg-white text-faint',
              )}
            >
              {done ? <Check className="size-3.5" /> : i + 1}
              {active && <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />}
            </span>
            <div className="-mt-0.5 min-w-0">
              <p className={cn('text-[14.5px] font-semibold', !done && !active && 'text-faint')}>{s.label}</p>
              <p className="text-[13px] text-muted">{s.desc}</p>
              {(done || active) && (
                <p className="mt-0.5 text-[12px] text-faint">{i >= 4 ? formatDate(booking.startDate) : formatDate(addDays(booking.createdAt, i))}</p>
              )}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}
