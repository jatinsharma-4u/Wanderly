import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeader } from '../../components/common/SectionHeader'
import { ButtonLink } from '../../components/common/Button'
import { DestinationCard } from '../../components/cards/DestinationCard'
import { destinations, destinationCategories } from '../../data/destinations'
import { cn } from '../../utils/format'

// "Explore" mobile reference: chip filters over an image-led grid with a hero tile.
export function ExploreDestinations() {
  const [cat, setCat] = useState('All')
  const list = useMemo(() => {
    const base = cat === 'All' ? destinations.filter((d) => d.featured) : destinations.filter((d) => d.category === cat)
    return base.slice(0, 7)
  }, [cat])

  return (
    <section className="container-x pt-20 md:pt-24">
      <SectionHeader
        eyebrow="Explore destinations"
        title="Where will India"
        accent="take you?"
        desc="From the high passes of Ladakh to the backwaters of Kerala, 120+ places our hosts know by heart."
        action={
          <ButtonLink to="/destinations" variant="outline" size="sm" arrow>
            All destinations
          </ButtonLink>
        }
      />
      <div className="no-scrollbar -mx-3 mb-6 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        {destinationCategories.map((c) => (
          <button key={c} type="button" className="chip" data-active={cat === c} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <motion.div layout className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((d, k) => (
            <motion.div
              key={d.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(k === 0 && 'col-span-2 row-span-2')}
            >
              <DestinationCard d={d} aspect={k === 0 ? 'aspect-square md:aspect-auto md:h-full' : 'aspect-[4/5]'} large={k === 0} sizes={k === 0 ? '(max-width: 768px) 100vw, 50vw' : undefined} className={k === 0 ? 'h-full' : ''} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
