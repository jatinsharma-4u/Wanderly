import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Heart, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react'
import { Logo } from './Logo'
import { SearchDialog } from './SearchDialog'
import { MobileMenu, MenuGlyph } from './MobileMenu'
import { Avatar } from '../common/Img'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/format'

export const links = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/packages', label: 'Packages' },
  { to: '/offers', label: 'Offers' },
  { to: '/planner', label: 'Plan a trip' },
  { to: '/blog', label: 'Journal' },
]
export const more = [
  { to: '/about', label: 'About us' },
  { to: '/track', label: 'Track booking' },
  { to: '/faq', label: 'FAQs' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const [account, setAccount] = useState(false)
  const { user, logout, wishlist } = useApp()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    setMenu(false)
    setAccount(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearch(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const iconBtn = cn(
    'relative grid size-10 place-items-center rounded-full border transition',
    overHero ? 'border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20' : 'border-line bg-white text-ink hover:border-ink/25',
  )

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
          overHero ? 'border-b border-transparent bg-transparent' : 'glass border-b border-line/70',
        )}
      >
        <div className="container-x flex h-16 items-center gap-3 md:h-[72px] lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Logo light={overHero} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'group/nl relative px-3 py-2 text-[13.5px] font-normal tracking-[0.01em] transition-colors',
                    overHero ? (isActive ? 'text-white' : 'text-white/80 hover:text-white') : isActive ? 'text-ink' : 'text-muted hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span className={cn('absolute inset-x-3 bottom-1 h-px origin-left transition-transform duration-500', overHero ? 'bg-white' : 'bg-gold', isActive ? 'scale-x-100' : 'scale-x-0 group-hover/nl:scale-x-100')} />
                  </>
                )}
              </NavLink>
            ))}
            <div className="group relative">
              <button type="button" className={cn('flex items-center gap-1 px-3 py-2 text-[13.5px] font-normal', overHero ? 'text-white/80 hover:text-white' : 'text-muted hover:text-ink')}>
                More <ChevronDown className="size-3.5 transition group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-10 w-52 translate-y-1 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="card p-1.5 shadow-[var(--shadow-lift)]">
                  {more.map((m) => (
                    <Link key={m.to} to={m.to} className="block rounded-lg px-3 py-2 text-[13.5px] font-medium text-ink-2 hover:bg-paper hover:text-ink">
                      {m.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:justify-self-end">
            <button
              type="button"
              onClick={() => setSearch(true)}
              className={cn(
                'hidden h-10 items-center gap-2 rounded-[10px] border pl-3 pr-2 text-[13px] transition md:flex',
                overHero ? 'border-white/25 bg-white/10 text-white/80 backdrop-blur-md hover:bg-white/20' : 'border-line bg-white text-faint hover:border-ink/25',
              )}
            >
              <Search className={cn('size-4', overHero ? 'text-white' : 'text-ink')} />
              <span className="w-24 text-left xl:w-32">Search…</span>
              <kbd className={cn('rounded-md border px-1.5 text-[11px] font-medium', overHero ? 'border-white/25 text-white/70' : 'border-line bg-paper text-muted')}>⌘K</kbd>
            </button>
            <button type="button" onClick={() => setSearch(true)} className={cn(iconBtn, 'md:hidden')} aria-label="Search">
              <Search className="size-[18px]" />
            </button>
            <Link to="/saved" className={cn(iconBtn, 'hidden sm:grid')} aria-label="Saved">
              <Heart className="size-[18px]" />
              {wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-gold text-[10px] font-bold text-white">{wishlist.length}</span>}
            </Link>

            {user ? (
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setAccount((a) => !a)}
                  className={cn('flex items-center gap-2 rounded-[10px] border p-1 pr-3 transition', overHero ? 'border-white/25 bg-white/10 text-white backdrop-blur-md' : 'border-line bg-white hover:border-ink/25')}
                  aria-expanded={account}
                >
                  <Avatar id={user.avatar} name={user.name} size={32} className="ring-0" />
                  <span className="text-[13px] font-semibold">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
                <AnimatePresence>
                  {account && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="card absolute right-0 top-[calc(100%+8px)] w-56 p-1.5 shadow-[var(--shadow-lift)]">
                      <div className="border-b border-line-2 px-3 py-2.5">
                        <p className="text-[13.5px] font-semibold">{user.name}</p>
                        <p className="truncate text-[12px] text-muted">{user.email}</p>
                      </div>
                      <Link to="/dashboard" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] hover:bg-paper"><LayoutDashboard className="size-4" /> My dashboard</Link>
                      <Link to="/admin" className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] hover:bg-paper"><User className="size-4" /> Admin console</Link>
                      <button type="button" onClick={() => { logout(); navigate('/') }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] text-danger hover:bg-danger-soft">
                        <LogOut className="size-4" /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className={cn('hidden h-10 items-center rounded-[10px] border px-4 text-[13px] font-medium transition lg:inline-flex', overHero ? 'border-white/40 text-white hover:bg-white hover:text-navy' : 'border-navy/20 text-navy hover:bg-navy hover:text-white')}>
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenu(true)}
              className={cn('grid size-10 place-items-center rounded-full transition active:scale-95 lg:hidden', overHero ? 'bg-white text-navy' : 'bg-navy text-white')}
              aria-label="Open menu"
              aria-expanded={menu}
            >
              <MenuGlyph />
            </button>
          </div>
        </div>
      </header>

      <SearchDialog open={search} onClose={() => setSearch(false)} />
      <MobileMenu open={menu} onOpen={() => setMenu(true)} onClose={() => setMenu(false)} onSearch={() => { setMenu(false); setSearch(true) }} />
    </>
  )
}

