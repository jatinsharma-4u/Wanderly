import { Minus, Plus } from 'lucide-react'

export function Stepper({ label, hint, value, onChange, min = 0, max = 12 }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div>
        <p className="text-[14px] font-semibold">{label}</p>
        {hint && <p className="text-[12px] text-muted">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid size-8 place-items-center rounded-full border border-line transition hover:border-ink disabled:opacity-35" aria-label={`Fewer ${label}`}>
          <Minus className="size-3.5" />
        </button>
        <span className="w-5 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid size-8 place-items-center rounded-full border border-line transition hover:border-ink disabled:opacity-35" aria-label={`More ${label}`}>
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

// Upcoming fixed departures, every Saturday starting ~10 days out.
export const upcomingDepartures = (count = 8) => {
  const d = new Date()
  d.setDate(d.getDate() + 10)
  while (d.getDay() !== 6) d.setDate(d.getDate() + 1)
  return Array.from({ length: count }, (_, i) => {
    const x = new Date(d)
    x.setDate(d.getDate() + i * 7)
    return x
  })
}

export const CHILD_RATE = 0.6
export const TAX_RATE = 0.05
export const priceFor = (price, adults, children) => {
  const base = price * adults + Math.round(price * CHILD_RATE) * children
  const taxes = Math.round(base * TAX_RATE)
  return { base, taxes, total: base + taxes }
}
