import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal } from 'lucide-react'
import { Reveal } from '../../components/common/Reveal'
import { ButtonLink } from '../../components/common/Button'
import { PackageCard } from '../../components/cards/PackageCard'
import { EmptyState } from '../../components/common/EmptyState'
import { packageCategories } from '../../data/packages'
import { budgets } from '../../components/forms/TripSearchForm'
import { getDestination } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { Select } from '../../components/common/Select'
import { TextReveal } from '../../components/common/TextReveal'

const durations = [
  { value: '', label: 'Any length' },
  { value: '1-5', label: 'Up to 5 days' },
  { value: '6-7', label: '6 – 7 days' },
  { value: '8-30', label: '8+ days' },
]

// "Pick the Place" reference: inline filter bar that live-filters the featured cards.
export function FeaturedPackages() {
  const { catalog } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [budget, setBudget] = useState('')
  const [dur, setDur] = useState('')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return catalog
      .filter((p) => p.active)
      .filter((p) => !s || `${p.title} ${getDestination(p.destination)?.name}`.toLowerCase().includes(s))
      .filter((p) => cat === 'All' || p.category === cat)
      .filter((p) => {
        if (!budget) return true
        const [a, b] = budget.split('-').map(Number)
        return p.price >= a && p.price <= b
      })
      .filter((p) => {
        if (!dur) return true
        const [a, b] = dur.split('-').map(Number)
        return p.days >= a && p.days <= b
      })
      .slice(0, 6)
  }, [catalog, q, cat, budget, dur])

  const reset = () => {
    setQ('')
    setCat('All')
    setBudget('')
    setDur('')
  }


  return (
    <section className="container-x pt-20 md:pt-24">
      <div className="mb-7 flex flex-col gap-4 md:mb-9 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <span className="eyebrow mb-4">Featured packages · 2026</span>
          <TextReveal as="h2" className="block text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.03em]" parts={[{ text: 'Pick the' }, { text: 'place', className: 'serif-accent text-gold' }]} />
        </Reveal>
        <Reveal delay={0.1} className="max-w-xs text-[14px] leading-relaxed text-muted md:text-right">
          Great options for everyone, cosy spots for your squad, slow escapes for two and big-sky adventures for the bold.
        </Reveal>
      </div>

      <Reveal className="relative z-10 mb-10 grid grid-cols-2 gap-x-5 gap-y-1 border-y border-line py-2 md:grid-cols-[1.3fr_1fr_1fr_1fr_auto] md:items-center md:gap-0 md:divide-x md:divide-line">
        <label className="col-span-2 flex flex-col justify-center py-1.5 md:col-span-1 md:pr-5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-faint">Destination</span>
          <span className="flex items-center gap-2">
            <Search className="size-4 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a spot…" className="h-10 w-full bg-transparent text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-faint" />
          </span>
        </label>
        <div className="flex flex-col justify-center py-1.5 md:px-5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-faint">Category</span>
          <Select bare label="Category" value={cat} onChange={setCat} options={packageCategories} buttonClassName="h-9 text-[13.5px]" />
        </div>
        <div className="flex flex-col justify-center py-1.5 md:px-5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-faint">Price</span>
          <Select bare label="Price" value={budget} onChange={setBudget} options={budgets} buttonClassName="h-9 text-[13.5px]" />
        </div>
        <div className="flex flex-col justify-center py-1.5 md:px-5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-faint">Duration</span>
          <Select bare label="Duration" value={dur} onChange={setDur} options={durations} buttonClassName="h-9 text-[13.5px]" />
        </div>
        <div className="col-span-2 flex items-center pt-2 md:col-span-1 md:pl-5 md:pt-0">
          <ButtonLink
            to={`/packages?${new URLSearchParams({ ...(q && { q }), ...(cat !== 'All' && { category: cat }), ...(budget && { budget }) })}`}
            className="h-11 w-full md:h-12 md:w-auto"
          >
            <SlidersHorizontal className="size-4" /> Discover
          </ButtonLink>
        </div>
      </Reveal>

      {list.length ? (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.div key={p.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                <PackageCard p={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <EmptyState
          title="No trips match those filters"
          desc="Try widening your budget or choosing a different experience."
          action={
            <button type="button" className="chip" onClick={reset}>
              Reset filters
            </button>
          }
        />
      )}
      <div className="mt-8 flex justify-center">
        <ButtonLink to="/packages" variant="outline" arrow>
          View all {catalog.filter((p) => p.active).length} packages
        </ButtonLink>
      </div>
    </section>
  )
}
