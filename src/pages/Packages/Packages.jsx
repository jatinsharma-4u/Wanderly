import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, Star } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition } from '../../components/common/Reveal'
import { PackageCard } from '../../components/cards/PackageCard'
import { EmptyState } from '../../components/common/EmptyState'
import { Modal } from '../../components/common/Modal'
import { Button } from '../../components/common/Button'
import { Skeleton } from '../../components/common/Bits'
import { packageCategories } from '../../data/packages'
import { destinations, getDestination } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, cn } from '../../utils/format'
import { Select } from '../../components/common/Select'

const sorts = {
  popular: { label: 'Most popular', fn: (a, b) => b.reviews - a.reviews },
  priceAsc: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  priceDesc: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
  duration: { label: 'Shortest first', fn: (a, b) => a.days - b.days },
}
const durations = [
  { value: '', label: 'Any' },
  { value: '1-5', label: '≤ 5 days' },
  { value: '6-7', label: '6–7 days' },
  { value: '8-30', label: '8+ days' },
]
const MAX = 200000

function Filters({ f, set, reset, inSheet }) {
  return (
    <div className="divide-y divide-line-2 [&>div]:py-4 [&>div:first-child]:pt-0 [&>button]:mt-4">
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Experience</p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
          {packageCategories.map((c) => (
            <button key={c} type="button" className="chip" data-active={f.category === c} onClick={() => set('category', c, 'All')}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Trip type</p>
        <div className="flex flex-wrap gap-x-4">
          {['all', 'domestic', 'international'].map((t) => (
            <button key={t} type="button" onClick={() => set('type', t, 'all')} className="chip capitalize" data-active={f.type === t}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Destination</p>
        <Select label="Destination" value={f.destination} onChange={(v) => set('destination', v, '')} options={[{ value: '', label: 'All destinations' }, ...destinations.map((d) => ({ value: d.slug, label: d.name, group: d.country === 'India' ? 'India' : 'International' }))]} />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="f-budget" className="text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Max budget / person</label>
          <span className="text-[13px] font-semibold text-gold-dark">{f.max >= MAX ? 'Any' : formatINR(f.max)}</span>
        </div>
        <input
          id="f-budget"
          type="range"
          min={10000}
          max={MAX}
          step={5000}
          value={f.max}
          onChange={(e) => set('max', e.target.value, String(MAX))}
          className="w-full accent-[var(--color-navy)]"
        />
        <div className="mt-1 flex justify-between text-[11.5px] text-faint">
          <span>₹10k</span>
          <span>₹2L+</span>
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Duration</p>
        <div className="flex flex-wrap gap-x-4">
          {durations.map((d) => (
            <button key={d.value} type="button" className="chip" data-active={f.duration === d.value} onClick={() => set('duration', d.value, '')}>
              {d.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-faint">Rating</p>
        <div className="flex flex-wrap gap-x-4">
          {['', '4.5', '4.7', '4.8'].map((r) => (
            <button key={r} type="button" className="chip" data-active={f.rating === r} onClick={() => set('rating', r, '')}>
              {r ? (
                <>
                  <Star className="size-3 fill-current" /> {r}+
                </>
              ) : (
                'Any'
              )}
            </button>
          ))}
        </div>
      </div>
      <button type="button" onClick={reset} className={cn('text-[13px] font-medium text-muted underline underline-offset-4 hover:text-ink', inSheet && 'hidden')}>
        Reset all filters
      </button>
    </div>
  )
}

export default function Packages() {
  useDocumentTitle('Tour packages')
  const { catalog } = useApp()
  const [params, setParams] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const [loading, setLoading] = useState(true)

  // Brief simulated fetch so the loading state is visible on first paint.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  const budgetParam = params.get('budget')
  const f = {
    q: params.get('q') || '',
    category: params.get('category') || 'All',
    destination: params.get('destination') || '',
    type: params.get('type') || 'all',
    max: Number(params.get('max') || (budgetParam ? budgetParam.split('-')[1] : MAX)),
    min: budgetParam ? Number(budgetParam.split('-')[0]) : 0,
    duration: params.get('duration') || '',
    rating: params.get('rating') || '',
    sort: params.get('sort') || 'popular',
  }

  const set = (k, v, def) => {
    const next = new URLSearchParams(params)
    if (k === 'max') next.delete('budget')
    if (v === undefined || v === '' || v === def) next.delete(k)
    else next.set(k, v)
    setParams(next, { replace: true })
  }
  const reset = () => setParams({}, { replace: true })

  const list = useMemo(() => {
    const s = f.q.trim().toLowerCase()
    return catalog
      .filter((p) => p.active)
      .filter((p) => !s || `${p.title} ${p.category} ${getDestination(p.destination)?.name} ${p.summary}`.toLowerCase().includes(s))
      .filter((p) => f.category === 'All' || p.category === f.category)
      .filter((p) => !f.destination || p.destination === f.destination)
      .filter((p) => f.type === 'all' || (f.type === 'international' ? p.international : !p.international))
      .filter((p) => p.price <= (f.max >= MAX ? Infinity : f.max) && p.price >= f.min)
      .filter((p) => {
        if (!f.duration) return true
        const [a, b] = f.duration.split('-').map(Number)
        return p.days >= a && p.days <= b
      })
      .filter((p) => !f.rating || p.rating >= Number(f.rating))
      .sort(sorts[f.sort]?.fn ?? sorts.popular.fn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, params])

  const activeChips = [
    f.category !== 'All' && { k: 'category', label: f.category },
    f.destination && { k: 'destination', label: getDestination(f.destination)?.name },
    f.type !== 'all' && { k: 'type', label: f.type },
    (f.max < MAX || budgetParam) && { k: budgetParam ? 'budget' : 'max', label: budgetParam ? `${formatINR(f.min)} – ${formatINR(f.max)}` : `Under ${formatINR(f.max)}` },
    f.duration && { k: 'duration', label: durations.find((d) => d.value === f.duration)?.label },
    f.rating && { k: 'rating', label: `${f.rating}+ rating` },
  ].filter(Boolean)

  return (
    <PageTransition>
      <PageHeader
        image="1785767021015-d8eac9f076cc"
        title="Tour packages"
        accent="for every traveller"
        desc="Compare curated itineraries by price, duration and experience. Every package can be tailored."
        crumbs={[{ label: 'Packages' }]}
      />

      <section className="container-x mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="no-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain pb-6 pr-1" data-lenis-prevent>
            <p className="mb-5 flex items-center gap-2 text-[15px] font-semibold">
              <SlidersHorizontal className="size-4" /> Filters
            </p>
            <Filters f={f} set={set} reset={reset} />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input value={f.q} onChange={(e) => set('q', e.target.value, '')} placeholder="Search packages, places, experiences" className="input-line pl-7" aria-label="Search packages" />
            </div>
            <div className="flex items-center gap-5">
              <button type="button" onClick={() => setSheet(true)} className="chip lg:hidden">
                <SlidersHorizontal className="size-4" /> Filters {activeChips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-gold text-[11px] text-white">{activeChips.length}</span>}
              </button>
              <span className="text-[12.5px] text-faint">Sort</span>
              <Select bare label="Sort packages" align="right" className="w-40" buttonClassName="h-9 text-[13.5px]" value={f.sort} onChange={(v) => set('sort', v, 'popular')} options={Object.entries(sorts).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
          </div>

          <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            <p className="shrink-0 text-[13px] text-muted">
              <b className="text-ink">{list.length}</b> packages
            </p>
            {activeChips.map((c) => (
              <button key={c.k} type="button" onClick={() => set(c.k, '', '')} className="inline-flex shrink-0 items-center gap-1 rounded-[6px] bg-sand px-2 py-1 text-[12px] capitalize text-ink-2 hover:bg-gold-soft">
                {c.label} <X className="size-3.5" />
              </button>
            ))}
          </div>

          <div className="mt-4">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="card p-2.5">
                    <Skeleton className="aspect-[4/3] rounded-[13px]" />
                    <Skeleton className="mt-3 h-3 w-1/2" />
                    <Skeleton className="mt-2 h-4 w-4/5" />
                    <Skeleton className="mt-6 h-5 w-1/3" />
                  </div>
                ))}
              </div>
            ) : list.length ? (
              <motion.div layout className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {list.map((p) => (
                    <motion.div key={p.slug} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }}>
                      <PackageCard p={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <EmptyState
                title="No packages match"
                desc="Try removing a filter or two, or let our experts build something just for you."
                action={
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={reset}>Reset filters</Button>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </section>

      <Modal
        open={sheet}
        onClose={() => setSheet(false)}
        title="Filter packages"
        footer={
          <div className="flex items-center gap-3">
            <button type="button" onClick={reset} className="h-11 px-2 text-[13.5px] font-medium text-muted underline underline-offset-4 hover:text-navy">Clear all</button>
            <Button size="lg" className="flex-1" onClick={() => setSheet(false)}>Show {list.length} packages</Button>
          </div>
        }
      >
        <div className="px-5 pb-10 pt-5">
          <Filters f={f} set={set} reset={reset} inSheet />
        </div>
      </Modal>
    </PageTransition>
  )
}
