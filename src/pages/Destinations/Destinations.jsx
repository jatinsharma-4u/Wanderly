import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition } from '../../components/common/Reveal'
import { DestinationCard } from '../../components/cards/DestinationCard'
import { EmptyState } from '../../components/common/EmptyState'
import { destinations, destinationCategories } from '../../data/destinations'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Select } from '../../components/common/Select'

const regions = ['All regions', 'North India', 'South India', 'West India', 'North East', 'Islands', 'International']
const sorts = {
  popular: { label: 'Most popular', fn: (a, b) => b.reviews - a.reviews },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
  priceAsc: { label: 'Price: low to high', fn: (a, b) => a.startingPrice - b.startingPrice },
  priceDesc: { label: 'Price: high to low', fn: (a, b) => b.startingPrice - a.startingPrice },
  az: { label: 'A – Z', fn: (a, b) => a.name.localeCompare(b.name) },
}

export default function Destinations() {
  useDocumentTitle('Destinations')
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const cat = params.get('category') || 'All'
  const region = params.get('region') || 'All regions'
  const sort = params.get('sort') || 'popular'

  const set = (k, v, def) => {
    const next = new URLSearchParams(params)
    if (!v || v === def) next.delete(k)
    else next.set(k, v)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return destinations
      .filter((d) => !s || [d.name, d.location, d.tagline, d.short, d.country].join(' ').toLowerCase().includes(s))
      .filter((d) => cat === 'All' || d.category === cat)
      .filter((d) => region === 'All regions' || d.region === region)
      .sort(sorts[sort]?.fn ?? sorts.popular.fn)
  }, [q, cat, region, sort])

  const indiaCount = destinations.filter((d) => d.country === 'India').length

  return (
    <PageTransition>
      <PageHeader
        title="Destinations"
        accent="worth the journey"
        desc={`${indiaCount} Indian destinations and a handful of international favourites, each one scouted, stayed in and loved by our team.`}
        crumbs={[{ label: 'Destinations' }]}
      />

      <section className="container-x mt-6">
        <div className="sticky top-16 z-30 -mx-3 bg-paper/90 px-3 py-3 backdrop-blur-xl md:top-[68px] sm:mx-0 sm:px-0">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint" />
              <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search Ladakh, beaches, temples…" className="input-line pl-7" aria-label="Search destinations" />
              {q && (
                <button type="button" onClick={() => set('q', '')} className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full hover:bg-sand" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0 lg:flex-1">
              {destinationCategories.map((c) => (
                <button key={c} type="button" className="chip" data-active={cat === c} onClick={() => set('category', c, 'All')}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Select bare label="Region" className="w-36" buttonClassName="h-9 text-[13.5px]" value={region} onChange={(v) => set('region', v, 'All regions')} options={regions} />
              <Select bare label="Sort" align="right" className="w-40" buttonClassName="h-9 text-[13.5px]" value={sort} onChange={(v) => set('sort', v, 'popular')} options={Object.entries(sorts).map(([k, v]) => ({ value: k, label: v.label }))} />
            </div>
          </div>
        </div>

        <p className="mb-4 mt-2 text-[13px] text-muted">
          Showing <b className="text-ink">{list.length}</b> destination{list.length !== 1 && 's'}
        </p>

        {list.length ? (
          <motion.div layout className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((d) => (
                <motion.div key={d.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                  <DestinationCard d={d} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="No destinations found"
            desc="We couldn’t find a match. Try another keyword or clear the filters."
            action={
              <button type="button" className="chip" onClick={() => setParams({}, { replace: true })}>
                Clear all filters
              </button>
            }
          />
        )}
      </section>
    </PageTransition>
  )
}
