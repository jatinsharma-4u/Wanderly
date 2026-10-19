import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Compass, CalendarDays, Wallet, Users, ChevronDown } from 'lucide-react'
import { Select } from '../common/Select'
import { DateRangePicker, TravellerPicker } from './Pickers'
import { destinations } from '../../data/destinations'
import { packageCategories } from '../../data/packages'
import { formatDate, cn } from '../../utils/format'

export const budgets = [
  { value: '', label: 'Any budget' },
  { value: '0-20000', label: 'Under ₹20,000' },
  { value: '20000-40000', label: '₹20k – ₹40k' },
  { value: '40000-80000', label: '₹40k – ₹80k' },
  { value: '80000-999999', label: '₹80k +' },
]
const popular = ['ladakh', 'kerala', 'udaipur', 'bali']

function Label({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-muted">
      <Icon className="size-3.5 text-gold" /> {children}
    </span>
  )
}

const cell = 'min-w-0 rounded-[10px] bg-paper px-3 py-2 ring-1 ring-transparent transition hover:bg-sand focus-within:bg-white focus-within:ring-gold/40 lg:rounded-none lg:bg-transparent lg:px-4 lg:py-1.5 lg:hover:bg-paper'

function FakeValue({ children, placeholder }) {
  return (
    <span className="mt-0.5 flex h-7 items-center justify-between gap-2 text-[13.5px] font-medium text-ink">
      <span className={cn('truncate', !children && 'font-normal text-faint')}>{children || placeholder}</span>
      <ChevronDown className="size-4 shrink-0 text-faint" />
    </span>
  )
}

// Trip selector: destination, dates, travellers, budget, trip type. Every popover flips upward when space runs out.
export function TripSearchForm({ className }) {
  const navigate = useNavigate()
  const [dest, setDest] = useState('')
  const [dates, setDates] = useState({ start: '', end: '' })
  const [pax, setPax] = useState({ adults: 2, children: 0, rooms: 1 })
  const [budget, setBudget] = useState('')
  const [type, setType] = useState('All')

  const submit = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (dest) p.set('destination', dest)
    if (type !== 'All') p.set('category', type)
    if (budget) p.set('budget', budget)
    navigate(`/packages${p.toString() ? `?${p}` : ''}`)
  }

  const destOptions = [
    { value: '', label: 'Anywhere' },
    ...destinations.map((d) => ({ value: d.slug, label: d.name, group: d.country === 'India' ? 'India' : 'International' })),
  ]
  const dateLabel = dates.start ? `${formatDate(dates.start, { day: 'numeric', month: 'short' })}${dates.end ? ` – ${formatDate(dates.end, { day: 'numeric', month: 'short' })}` : ''}` : ''
  const paxLabel = `${pax.adults + pax.children} guest${pax.adults + pax.children > 1 ? 's' : ''} · ${pax.rooms} room${pax.rooms > 1 ? 's' : ''}`

  return (
    <form
      onSubmit={submit}
      className={cn(
        'rounded-[16px] border border-white bg-gradient-to-b from-white to-[#f7fbfd] p-3 shadow-[0_30px_60px_-32px_rgb(18_49_63/0.5)] ring-1 ring-line/80 lg:p-2.5',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-3 pt-0.5 lg:px-3 lg:pb-2.5 lg:pt-1.5">
        <p className="text-[14px] font-semibold text-navy">Plan your next escape</p>
        <div className="hidden items-center gap-1.5 text-[12px] text-muted sm:flex">
          Popular:
          {popular.map((s) => (
            <button key={s} type="button" onClick={() => setDest(s)} className={cn('rounded-[8px] px-2 py-0.5 font-medium transition', dest === s ? 'bg-navy text-white' : 'bg-sand text-ink-2 hover:bg-gold-soft')}>
              {destinations.find((d) => d.slug === s)?.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2 lg:flex lg:gap-0 lg:divide-x lg:divide-line lg:rounded-[12px] lg:bg-white lg:ring-1 lg:ring-line">
          <div className={cn(cell, 'col-span-2 lg:flex-[1.25]')}>
            <Label icon={MapPin}>Destination</Label>
            <Select bare label="Destination" value={dest} onChange={setDest} options={destOptions} buttonClassName="mt-0.5 h-7 text-[13.5px] font-medium" />
          </div>
          <div className={cn(cell, 'col-span-2 lg:flex-[1.2]')}>
            <DateRangePicker value={dates} onChange={setDates} trigger={<><Label icon={CalendarDays}>Travel dates</Label><FakeValue placeholder="Add dates">{dateLabel}</FakeValue></>} />
          </div>
          <div className={cn(cell, 'lg:flex-1')}>
            <TravellerPicker value={pax} onChange={setPax} trigger={<><Label icon={Users}>Travellers</Label><FakeValue>{paxLabel}</FakeValue></>} />
          </div>
          <div className={cn(cell, 'lg:flex-1')}>
            <Label icon={Wallet}>Budget</Label>
            <Select bare label="Budget" value={budget} onChange={setBudget} options={budgets} align="right" buttonClassName="mt-0.5 h-7 text-[13.5px] font-medium" />
          </div>
          <div className={cn(cell, 'col-span-2 lg:flex-1')}>
            <Label icon={Compass}>Trip type</Label>
            <Select bare label="Trip type" value={type} onChange={setType} options={packageCategories.map((c) => ({ value: c, label: c === 'All' ? 'Any style' : c }))} align="right" buttonClassName="mt-0.5 h-7 text-[13.5px] font-medium" />
          </div>
        </div>
        <button
          type="submit"
          className="group flex h-12 items-center justify-center gap-2 rounded-[12px] bg-gradient-to-b from-[#24566f] to-navy px-7 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_10px_24px_-12px_rgb(26_67_90/0.8)] transition hover:from-[#2b6481] active:scale-[0.98] lg:h-auto"
        >
          <Search className="size-4 transition-transform group-hover:scale-110" /> Search
        </button>
      </div>
    </form>
  )
}
