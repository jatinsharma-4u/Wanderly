import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, Heart, User, Search, Compass, PhoneCall, PackageSearch, ArrowUpRight } from 'lucide-react'
import { Logo } from './Logo'
import { useApp } from '../../context/AppContext'
import { useLockBody } from '../../hooks/useLockBody'
import { destinations } from '../../data/destinations'
import { img, cn } from '../../utils/format'

// Two-line glyph that reads less like a stock hamburger.
export function MenuGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2 6h14M7 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const items = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/packages', label: 'Tour packages' },
  { to: '/offers', label: 'Offers' },
  { to: '/blog', label: 'Journal' },
]
const secondary = [
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
]
const ease = [0.22, 1, 0.36, 1]

/**
 * Mobile navigation: a full-screen index revealed as an expanding circle from its trigger,
 * plus a floating "Explore" pill that appears once the header has scrolled away.
 */
export function MobileMenu({ open, onOpen, onClose, onSearch }) {
  const { user, wishlist } = useApp()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const [origin, setOrigin] = useState('calc(100% - 50px) 32px')
  const [showFab, setShowFab] = useState(false)
  useLockBody(open)

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 520)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const trending = destinations.filter((d) => d.featured).slice(0, 6)
  const circle = (r) => `circle(${r} at ${origin})`
  const hideFab = /^\/packages\/.+/.test(pathname) || pathname.startsWith('/booking')

  return (
    <>
      <AnimatePresence>
        {showFab && !open && !hideFab && (
          <motion.button
            type="button"
            initial={{ y: 24, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={() => {
              setOrigin('calc(100% - 60px) calc(100% - 40px)')
              onOpen()
            }}
            className="fixed right-4 z-40 grid size-14 place-items-center rounded-full bg-gradient-to-b from-[#24566f] to-navy text-white shadow-[0_16px_34px_-12px_rgb(15_20_25/0.65)] ring-4 ring-white/70 lg:hidden"
            style={{ bottom: 'max(18px, calc(env(safe-area-inset-bottom) + 10px))' }}
            aria-label="Open navigation"
          >
            <span className="absolute inset-1.5 rounded-full border border-dashed border-[#d3ebf9]/35 motion-safe:animate-[spin_16s_linear_infinite]" />
            <Compass className="size-[22px] text-[#d3ebf9]" strokeWidth={1.7} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-semibold text-white ring-2 ring-white">{wishlist.length}</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={() => setOrigin('calc(100% - 50px) 32px')}>
        {open && (
          <motion.div
            key="menu"
            className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-paper lg:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: circle('0%') }}
            animate={reduce ? { opacity: 1 } : { clipPath: circle('150%') }}
            exit={reduce ? { opacity: 0 } : { clipPath: circle('0%') }}
            transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="container-x flex h-16 shrink-0 items-center justify-between border-b border-line">
              <Logo />
              <div className="flex items-center gap-2">
                <button type="button" onClick={onSearch} className="grid size-10 place-items-center rounded-full border border-line bg-white" aria-label="Search">
                  <Search className="size-[18px]" />
                </button>
                <button type="button" onClick={onClose} className="grid size-10 place-items-center rounded-full bg-navy text-white" aria-label="Close menu">
                  <X className="size-[18px]" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              <div className="container-x py-5">
                {/* Featured: plan a trip */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5, ease }}>
                  <Link to="/planner" className="relative flex h-24 items-end overflow-hidden rounded-[12px] p-3.5 text-white">
                    <img src={img('1653844573020-71f77a0ccb8c', 800, 320)} alt="" className="absolute inset-0 size-full object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
                    <span className="relative flex w-full items-end justify-between gap-3">
                      <span>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d3ebf9]">Free · 4 hr reply</span>
                        <span className="block text-[16px] font-semibold leading-tight">Plan a custom trip</span>
                      </span>
                      <span className="grid size-9 place-items-center rounded-full bg-white text-ink"><ArrowUpRight className="size-4" /></span>
                    </span>
                  </Link>
                </motion.div>

                <nav className="mt-4" aria-label="Mobile">
                  <ol>
                    {items.map((l, i) => (
                      <motion.li key={l.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.045, duration: 0.45, ease }}>
                        <NavLink to={l.to} end={l.to === '/'} className="group flex items-center gap-3 border-b border-line py-3">
                          {({ isActive }) => (
                            <>
                              <span className="w-5 text-[11.5px] font-semibold tabular-nums text-faint">0{i + 1}</span>
                              <span className={cn('flex-1 text-[17px] font-medium tracking-[-0.01em]', isActive ? 'text-gold-dark' : 'text-ink')}>{l.label}</span>
                              {isActive ? <span className="size-2 rounded-full bg-gold" /> : <ArrowUpRight className="size-4 text-faint transition group-active:rotate-45" />}
                            </>
                          )}
                        </NavLink>
                      </motion.li>
                    ))}
                  </ol>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="mt-4 flex flex-wrap gap-2">
                    {secondary.map((s) => (
                      <Link key={s.to} to={s.to} className="chip text-[12.5px]">{s.label}</Link>
                    ))}
                  </motion.div>
                </nav>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 grid grid-cols-3 gap-2">
                  {[
                    { to: '/saved', icon: Heart, label: 'Saved', badge: wishlist.length },
                    { to: '/track', icon: PackageSearch, label: 'Track trip' },
                    { to: user ? '/dashboard' : '/login', icon: User, label: user ? 'My account' : 'Sign in' },
                  ].map((q) => (
                    <Link key={q.label} to={q.to} className="relative flex flex-col items-center gap-1.5 rounded-[14px] bg-white py-3 text-[11.5px] font-medium ring-1 ring-line">
                      <q.icon className="size-[18px]" />
                      {q.label}
                      {q.badge > 0 && <span className="absolute right-2.5 top-2 grid size-[18px] place-items-center rounded-full bg-gold text-[10px] text-white">{q.badge}</span>}
                    </Link>
                  ))}
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55, duration: 0.5, ease }} className="pb-6">
                <p className="container-x mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">Trending now</p>
                <div className="no-scrollbar flex snap-x gap-2.5 overflow-x-auto px-3 sm:px-4">
                  {trending.map((d) => (
                    <Link key={d.slug} to={`/destinations/${d.slug}`} className="relative h-32 w-24 shrink-0 snap-start overflow-hidden rounded-xl">
                      <img src={img(d.image, 240, 320)} alt="" className="absolute inset-0 size-full object-cover" />
                      <span className="img-shade absolute inset-0" />
                      <span className="absolute bottom-2 left-2 right-2 text-[12px] font-semibold leading-tight text-white">{d.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="container-x shrink-0 border-t border-line bg-white/60 pt-3" style={{ paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom) + 12px))' }}>
              <a href="tel:+918045671234" className="flex h-14 items-center justify-between gap-3 rounded-[16px] bg-navy pl-4 pr-2 text-white">
                <span className="text-[13px] leading-tight">
                  <span className="block text-[11px] text-white/60">Talk to a travel expert</span>
                  <b>+91 80 4567 1234</b>
                </span>
                <span className="grid size-10 place-items-center rounded-[12px] bg-gold"><PhoneCall className="size-4" /></span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
