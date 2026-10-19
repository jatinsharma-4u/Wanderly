import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { Popover, useOutsideClose } from '../common/Popover'
import { toISODate, formatDate, cn } from '../../utils/format'

const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const sameDay = (a, b) => a && b && toISODate(a) === toISODate(b)

function Month({ month, start, end, hover, onPick, onHover, min }) {
  const days = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const lead = (first.getDay() + 6) % 7
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  }, [month])
  const rangeEnd = end || hover
  return (
    <div>
      <p className="mb-2 text-center text-[13px] font-semibold">{formatDate(month, { month: 'long', year: 'numeric' })}</p>
      <div className="grid grid-cols-7 text-center text-[10.5px] font-medium uppercase text-faint">
        {WEEK.map((w) => <span key={w} className="py-1">{w}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const disabled = d < min
          const isStart = sameDay(d, start)
          const isEnd = sameDay(d, end)
          const inRange = start && rangeEnd && d > start && d < rangeEnd
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onPick(d)}
              onPointerEnter={() => onHover(d)}
              className={cn(
                'relative h-9 text-[12.5px] transition-colors disabled:text-line',
                inRange && 'bg-gold-soft text-navy',
                (isStart || isEnd) && 'z-10 rounded-[8px] bg-navy font-semibold text-white',
                !isStart && !isEnd && !inRange && !disabled && 'rounded-[8px] hover:bg-sand',
              )}
              aria-label={formatDate(d)}
              aria-pressed={isStart || isEnd}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Date-range calendar in a smart popover. value: { start, end } ISO strings. */
export function DateRangePicker({ value, onChange, trigger, className, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const btn = useRef(null)
  const today = useMemo(() => {
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return t
  }, [])
  const start = value.start ? new Date(value.start) : null
  const end = value.end ? new Date(value.end) : null
  const [view, setView] = useState(() => new Date((start || today).getFullYear(), (start || today).getMonth(), 1))
  const [hover, setHover] = useState(null)
  useOutsideClose(open, root, () => setOpen(false))

  const pick = (d) => {
    if (!start || (start && end) || d <= start) onChange({ start: toISODate(d), end: '' })
    else {
      onChange({ start: value.start, end: toISODate(d) })
      setTimeout(() => setOpen(false), 160)
    }
  }
  const next = new Date(view.getFullYear(), view.getMonth() + 1, 1)
  const nights = start && end ? Math.round((end - start) / 864e5) : 0

  return (
    <div ref={root} className={cn('relative min-w-0', className)}>
      <button ref={btn} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="dialog" className="w-full text-left">
        {trigger}
      </button>
      <Popover open={open} anchorRef={btn} align={align} label="Choose travel dates" className="w-[min(92vw,600px)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} disabled={view <= new Date(today.getFullYear(), today.getMonth(), 1)} className="grid size-8 place-items-center rounded-[8px] border border-line hover:bg-paper disabled:opacity-30" aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </button>
          <p className="text-[12px] text-muted">{start ? (end ? `${nights} nights selected` : 'Now pick your return date') : 'Pick your departure date'}</p>
          <button type="button" onClick={() => setView(next)} className="grid size-8 place-items-center rounded-[8px] border border-line hover:bg-paper" aria-label="Next month">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2" onPointerLeave={() => setHover(null)}>
          <Month month={view} start={start} end={end} hover={hover} onPick={pick} onHover={setHover} min={today} />
          <div className="hidden sm:block">
            <Month month={next} start={start} end={end} hover={hover} onPick={pick} onHover={setHover} min={today} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-line-2 pt-3">
          <button type="button" onClick={() => onChange({ start: '', end: '' })} className="text-[12.5px] font-medium text-muted underline-offset-4 hover:text-ink hover:underline">
            Clear dates
          </button>
          <button type="button" onClick={() => setOpen(false)} className="h-9 rounded-[10px] bg-navy px-4 text-[12.5px] font-medium text-white">
            Done
          </button>
        </div>
      </Popover>
    </div>
  )
}

function Counter({ label, hint, value, onChange, min = 0, max = 12 }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-[13.5px] font-medium">{label}</p>
        <p className="text-[11.5px] text-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} className="grid size-8 place-items-center rounded-[8px] border border-line hover:border-navy disabled:opacity-30" aria-label={`Fewer ${label}`}>
          <Minus className="size-3.5" />
        </button>
        <span className="w-5 text-center text-[14px] font-semibold tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} className="grid size-8 place-items-center rounded-[8px] border border-line hover:border-navy disabled:opacity-30" aria-label={`More ${label}`}>
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

/** Adults / children / rooms selector in a smart popover. value: { adults, children, rooms } */
export function TravellerPicker({ value, onChange, trigger, className, align = 'left' }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const btn = useRef(null)
  useOutsideClose(open, root, () => setOpen(false))
  const set = (k) => (v) => onChange({ ...value, [k]: v })
  return (
    <div ref={root} className={cn('relative min-w-0', className)}>
      <button ref={btn} type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="dialog" className="w-full text-left">
        {trigger}
      </button>
      <Popover open={open} anchorRef={btn} align={align} label="Travellers" className="w-[280px] px-4 py-2">
        <div className="divide-y divide-line-2">
          <Counter label="Adults" hint="12+ years" value={value.adults} onChange={set('adults')} min={1} />
          <Counter label="Children" hint="2–11 years" value={value.children} onChange={set('children')} />
          <Counter label="Rooms" hint="Twin sharing" value={value.rooms} onChange={set('rooms')} min={1} max={6} />
        </div>
        <button type="button" onClick={() => setOpen(false)} className="mb-2 mt-1 h-9 w-full rounded-[10px] bg-navy text-[12.5px] font-medium text-white">
          Apply
        </button>
      </Popover>
    </div>
  )
}
