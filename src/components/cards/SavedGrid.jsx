import { AnimatePresence, motion } from 'framer-motion'
import { DestinationCard } from './DestinationCard'
import { PackageCard } from './PackageCard'
import { EmptyState } from '../common/EmptyState'
import { ButtonLink } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { destinations } from '../../data/destinations'

export function SavedGrid() {
  const { wishlist, catalog } = useApp()
  const savedDest = destinations.filter((d) => wishlist.includes(d.slug))
  const savedPkgs = catalog.filter((p) => wishlist.includes(p.slug))

  if (!savedDest.length && !savedPkgs.length)
    return (
      <EmptyState
        title="Nothing saved yet"
        desc="Tap the heart on any destination or package to keep it here for later."
        action={<ButtonLink to="/destinations" arrow>Start exploring</ButtonLink>}
      />
    )

  return (
    <div className="space-y-10">
      {savedDest.length > 0 && (
        <div>
          <h3 className="mb-4 text-[16px] font-semibold">Destinations <span className="text-muted">({savedDest.length})</span></h3>
          <motion.div layout className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {savedDest.map((d) => (
                <motion.div key={d.slug} layout exit={{ opacity: 0, scale: 0.9 }}>
                  <DestinationCard d={d} showPrice={false} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
      {savedPkgs.length > 0 && (
        <div>
          <h3 className="mb-4 text-[16px] font-semibold">Packages <span className="text-muted">({savedPkgs.length})</span></h3>
          <motion.div layout className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {savedPkgs.map((p) => (
                <motion.div key={p.slug} layout exit={{ opacity: 0, scale: 0.9 }}>
                  <PackageCard p={p} compact />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  )
}
