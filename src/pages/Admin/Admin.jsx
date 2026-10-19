import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Package, CalendarCheck, Inbox, Users, Settings, ArrowLeft, Search, Plus, Pencil, Trash2, TrendingUp, TrendingDown,
  IndianRupee, Plane, MessageSquare, Eye, RotateCcw, Bell, Star,
} from 'lucide-react'
import { Logo } from '../../components/navigation/Logo'
import { Img, Avatar } from '../../components/common/Img'
import { Button } from '../../components/common/Button'
import { StatusBadge, Badge } from '../../components/common/Bits'
import { Modal } from '../../components/common/Modal'
import { EmptyState } from '../../components/common/EmptyState'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { RevenueChart, Donut } from './Charts'
import { PackageForm } from './PackageForm'
import { customers, revenueByMonth, bookingStages, demoUser } from '../../data/bookings'
import { getDestination } from '../../data/destinations'
import { packageCategories } from '../../data/packages'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate, cn } from '../../utils/format'

const nav = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'packages', label: 'Packages', icon: Package },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'enquiries', label: 'Enquiries', icon: Inbox },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
]
const statusOptions = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled']
const stageForStatus = { pending: 0, confirmed: 2, ongoing: 4, completed: 5, cancelled: 0 }

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input h-10 pl-10" aria-label={placeholder} />
    </div>
  )
}

function Kpi({ icon: Icon, label, value, delta, tone }) {
  const up = delta >= 0
  return (
    <div className="card min-w-0 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className={cn('grid size-10 place-items-center rounded-xl', tone)}><Icon className="size-[18px]" /></span>
        <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-semibold', up ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger')}>
          {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />} {Math.abs(delta)}%
        </span>
      </div>
      <p className="mt-4 truncate text-[18px] font-semibold tracking-tight sm:text-[22px]">{value}</p>
      <p className="text-[12.5px] text-muted">{label}</p>
    </div>
  )
}

export default function Admin() {
  useDocumentTitle('Admin console')
  const { catalog, savePackage, removePackage, bookings, updateBooking, enquiries, updateEnquiry, resetDemo } = useApp()
  const toast = useToast()
  const [tab, setTab] = useState('overview')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [bStatus, setBStatus] = useState('all')
  const [editing, setEditing] = useState(null) // null | 'new' | pkg
  const [deleting, setDeleting] = useState(null)
  const [viewBooking, setViewBooking] = useState(null)
  const [reply, setReply] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [settings, setSettings] = useState({ name: 'Wanderly Journeys', email: 'hello@wanderly.in', phone: '+91 80 4567 1234', currency: 'INR', autoConfirm: true, notifyEmail: true, maintenance: false })

  const switchTab = (t) => {
    setTab(t)
    setQ('')
  }

  const pkgTitle = (slug) => catalog.find((p) => p.slug === slug)?.title || slug
  const revenue = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.amount, 0)
  const collected = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.paid, 0)
  const newEnq = enquiries.filter((e) => e.status === 'new').length

  const pkgList = useMemo(() => {
    const s = q.toLowerCase()
    return catalog.filter((p) => (cat === 'All' || p.category === cat) && (!s || `${p.title} ${p.destination}`.toLowerCase().includes(s)))
  }, [catalog, q, cat])
  const bookingList = useMemo(() => {
    const s = q.toLowerCase()
    return bookings.filter((b) => (bStatus === 'all' || b.status === bStatus) && (!s || `${b.id} ${b.customer} ${pkgTitle(b.packageSlug)}`.toLowerCase().includes(s)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings, q, bStatus])
  const enquiryList = useMemo(() => {
    const s = q.toLowerCase()
    return enquiries.filter((e) => !s || `${e.name} ${e.subject} ${e.type}`.toLowerCase().includes(s))
  }, [enquiries, q])
  const customerList = useMemo(() => {
    const s = q.toLowerCase()
    return customers.filter((c) => !s || `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(s))
  }, [q])

  const topPackages = useMemo(() => {
    const counts = {}
    bookings.forEach((b) => b.status !== 'cancelled' && (counts[b.packageSlug] = (counts[b.packageSlug] || 0) + b.amount))
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [bookings])

  const statusSegments = [
    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, color: 'var(--color-success)' },
    { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, color: 'var(--color-gold)' },
    { label: 'Ongoing', value: bookings.filter((b) => b.status === 'ongoing').length, color: 'var(--color-info)' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'completed').length, color: 'var(--color-navy)' },
    { label: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length, color: 'var(--color-danger)' },
  ]

  const current = nav.find((n) => n.key === tab)

  return (
    <div className="min-h-dvh bg-paper lg:grid lg:grid-cols-[248px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-r border-line bg-white lg:block">
        <div className="no-scrollbar sticky top-0 flex h-dvh flex-col overflow-y-auto p-4">
          <div className="flex items-center justify-between px-2 py-2">
            <Logo />
            <Badge tone="gold">Admin</Badge>
          </div>
          <nav className="mt-6 flex flex-col gap-1" aria-label="Admin">
            {nav.map((n) => (
              <button
                key={n.key}
                type="button"
                onClick={() => switchTab(n.key)}
                className={cn('relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition', tab === n.key ? 'text-white' : 'text-ink-2 hover:bg-paper')}
              >
                {tab === n.key && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <n.icon className="relative size-[18px]" />
                <span className="relative flex-1 text-left">{n.label}</span>
                {n.key === 'enquiries' && newEnq > 0 && <span className="relative grid size-5 place-items-center rounded-full bg-gold text-[11px] font-bold text-white">{newEnq}</span>}
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-3 pt-6">
            <div className="rounded-xl bg-sand p-4">
              <p className="text-[13px] font-semibold">Demo mode</p>
              <p className="mt-0.5 text-[12px] text-muted">Changes are stored in this browser only.</p>
            </div>
            <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink-2 hover:bg-paper">
              <ArrowLeft className="size-4" /> Back to website
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar */}
        <header className="glass sticky top-0 z-30 border-b border-line">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Link to="/" className="grid size-9 place-items-center rounded-full border border-line bg-white lg:hidden" aria-label="Back to website">
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-muted">Admin console</p>
              <h1 className="font-sans truncate text-[18px] leading-tight">{current.label}</h1>
            </div>
            <button type="button" onClick={() => switchTab('enquiries')} className="relative grid size-10 place-items-center rounded-full border border-line bg-white" aria-label="Notifications">
              <Bell className="size-[18px]" />
              {newEnq > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-danger ring-2 ring-white" />}
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar id={demoUser.avatar} size={36} className="ring-0" />
              <div className="text-[12.5px] leading-tight">
                <p className="font-semibold">Ritu M.</p>
                <p className="text-muted">Super admin</p>
              </div>
            </div>
          </div>
          {/* Mobile tabs */}
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3 lg:hidden">
            {nav.map((n) => (
              <button key={n.key} type="button" onClick={() => switchTab(n.key)} className="chip shrink-0 text-[12.5px]" data-active={tab === n.key}>
                <n.icon className="size-3.5" /> {n.label}
              </button>
            ))}
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {tab === 'overview' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                    <Kpi icon={IndianRupee} label="Gross booking value" value={formatINR(revenue)} delta={18.4} tone="bg-gold-soft text-gold-dark" />
                    <Kpi icon={CalendarCheck} label="Total bookings" value={bookings.length} delta={12.1} tone="bg-success-soft text-success" />
                    <Kpi icon={Plane} label="Payments collected" value={formatINR(collected)} delta={9.6} tone="bg-info-soft text-info" />
                    <Kpi icon={MessageSquare} label="Open enquiries" value={enquiries.filter((e) => e.status !== 'resolved').length} delta={-4.2} tone="bg-danger-soft text-danger" />
                  </div>
                  <div className="grid gap-5 xl:grid-cols-3 [&>*]:min-w-0">
                    <div className="card p-5 xl:col-span-2">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h2 className="font-sans text-[16px]">Revenue</h2>
                          <p className="text-[12.5px] text-muted">Last 6 months · hover bars for details</p>
                        </div>
                        <Badge tone="success">+21% vs last period</Badge>
                      </div>
                      <RevenueChart data={revenueByMonth} />
                    </div>
                    <div className="card p-5">
                      <h2 className="font-sans text-[16px]">Bookings by status</h2>
                      <div className="mt-4 flex items-center gap-5">
                        <Donut segments={statusSegments} />
                        <ul className="space-y-2 text-[13px]">
                          {statusSegments.map((s) => (
                            <li key={s.label} className="flex items-center gap-2">
                              <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                              <span className="text-muted">{s.label}</span>
                              <b className="ml-auto pl-3">{s.value}</b>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-5 xl:grid-cols-3 [&>*]:min-w-0">
                    <div className="card overflow-hidden xl:col-span-2">
                      <div className="flex items-center justify-between p-5 pb-3">
                        <h2 className="font-sans text-[16px]">Recent bookings</h2>
                        <button type="button" onClick={() => switchTab('bookings')} className="text-[13px] font-semibold text-gold-dark hover:underline">View all</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px] text-left text-[13.5px]">
                          <thead className="text-[11.5px] uppercase tracking-wider text-muted">
                            <tr className="border-y border-line-2 bg-paper/60"><th className="px-5 py-2.5 font-semibold">Booking</th><th className="px-3 py-2.5 font-semibold">Customer</th><th className="px-3 py-2.5 font-semibold">Travel</th><th className="px-3 py-2.5 font-semibold">Amount</th><th className="px-5 py-2.5 font-semibold">Status</th></tr>
                          </thead>
                          <tbody className="divide-y divide-line-2">
                            {bookings.slice(0, 6).map((b) => (
                              <tr key={b.id} className="cursor-pointer hover:bg-paper" onClick={() => setViewBooking(b)}>
                                <td className="px-5 py-3"><p className="font-semibold">{b.id}</p><p className="max-w-[200px] truncate text-[12px] text-muted">{pkgTitle(b.packageSlug)}</p></td>
                                <td className="px-3 py-3">{b.customer}</td>
                                <td className="px-3 py-3 text-muted">{formatDate(b.startDate, { day: 'numeric', month: 'short' })}</td>
                                <td className="px-3 py-3 font-semibold">{formatINR(b.amount)}</td>
                                <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="card p-5">
                      <h2 className="font-sans text-[16px]">Top packages</h2>
                      <ul className="mt-4 space-y-4">
                        {topPackages.map(([slug, amt]) => {
                          const p = catalog.find((x) => x.slug === slug)
                          const pct = (amt / topPackages[0][1]) * 100
                          return (
                            <li key={slug}>
                              <div className="flex items-center gap-3">
                                {p && <Img id={p.image} alt="" className="size-10 shrink-0 rounded-lg" sizes="40px" w={120} widths={[120]} />}
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-[13.5px] font-semibold">{pkgTitle(slug)}</p>
                                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line-2">
                                    <motion.div className="h-full rounded-full bg-gold" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                                  </div>
                                </div>
                                <span className="text-[12.5px] font-semibold">{formatINR(amt)}</span>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'packages' && (
                <div>
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <SearchBox value={q} onChange={setQ} placeholder="Search packages" />
                      <select value={cat} onChange={(e) => setCat(e.target.value)} className="input h-10 sm:w-40" aria-label="Category">
                        {packageCategories.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <Button onClick={() => setEditing('new')}><Plus className="size-4" /> Add package</Button>
                  </div>
                  {pkgList.length ? (
                    <div className="card overflow-x-auto">
                      <table className="w-full min-w-[760px] text-left text-[13.5px]">
                        <thead className="text-[11.5px] uppercase tracking-wider text-muted">
                          <tr className="border-b border-line-2 bg-paper/60"><th className="px-4 py-3 font-semibold">Package</th><th className="px-3 py-3 font-semibold">Category</th><th className="px-3 py-3 font-semibold">Duration</th><th className="px-3 py-3 font-semibold">Price</th><th className="px-3 py-3 font-semibold">Rating</th><th className="px-3 py-3 font-semibold">Live</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-line-2">
                          {pkgList.map((p) => (
                            <tr key={p.slug} className={cn('transition', !p.active && 'opacity-55')}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <Img id={p.image} alt="" className="size-11 shrink-0 rounded-lg" sizes="44px" w={120} widths={[120]} />
                                  <div className="min-w-0">
                                    <p className="max-w-[240px] truncate font-semibold">{p.title}</p>
                                    <p className="text-[12px] text-muted">{getDestination(p.destination)?.name} · {p.slotsLeft} slots</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-3"><Badge>{p.category}</Badge></td>
                              <td className="px-3 py-3 text-muted">{p.days}D/{p.days - 1}N</td>
                              <td className="px-3 py-3 font-semibold">{formatINR(p.price)}</td>
                              <td className="px-3 py-3"><span className="inline-flex items-center gap-1"><Star className="size-3.5 fill-gold text-gold" /> {p.rating?.toFixed(1)}</span></td>
                              <td className="px-3 py-3">
                                <label className="relative inline-block cursor-pointer" aria-label={`Toggle ${p.title} visibility`}>
                                  <input type="checkbox" checked={p.active} onChange={() => { savePackage({ ...p, active: !p.active }); toast(p.active ? 'Package hidden from site' : 'Package is live', 'info') }} className="peer sr-only" />
                                  <span className="block h-5 w-9 rounded-full bg-line transition peer-checked:bg-success" />
                                  <span className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
                                </label>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-end gap-1">
                                  <Link to={`/packages/${p.slug}`} className="grid size-8 place-items-center rounded-lg hover:bg-paper" aria-label="View"><Eye className="size-4" /></Link>
                                  <button type="button" onClick={() => setEditing(p)} className="grid size-8 place-items-center rounded-lg hover:bg-paper" aria-label="Edit"><Pencil className="size-4" /></button>
                                  <button type="button" onClick={() => setDeleting(p)} className="grid size-8 place-items-center rounded-lg text-danger hover:bg-danger-soft" aria-label="Delete"><Trash2 className="size-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState title="No packages found" desc="Try a different search or add a new package." />
                  )}
                </div>
              )}

              {tab === 'bookings' && (
                <div>
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <SearchBox value={q} onChange={setQ} placeholder="Search ID, customer, package" />
                    <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
                      {['all', ...statusOptions].map((s) => (
                        <button key={s} type="button" className="chip shrink-0 text-[12.5px] capitalize" data-active={bStatus === s} onClick={() => setBStatus(s)}>
                          {s} <span className="opacity-60">{s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {bookingList.length ? (
                    <div className="card overflow-x-auto">
                      <table className="w-full min-w-[820px] text-left text-[13.5px]">
                        <thead className="text-[11.5px] uppercase tracking-wider text-muted">
                          <tr className="border-b border-line-2 bg-paper/60"><th className="px-4 py-3 font-semibold">Booking</th><th className="px-3 py-3 font-semibold">Customer</th><th className="px-3 py-3 font-semibold">Departure</th><th className="px-3 py-3 font-semibold">Pax</th><th className="px-3 py-3 font-semibold">Paid / Total</th><th className="px-3 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">View</th></tr>
                        </thead>
                        <tbody className="divide-y divide-line-2">
                          {bookingList.map((b) => (
                            <tr key={b.id} className="hover:bg-paper/60">
                              <td className="px-4 py-3"><p className="font-semibold">{b.id}</p><p className="max-w-[220px] truncate text-[12px] text-muted">{pkgTitle(b.packageSlug)}</p></td>
                              <td className="px-3 py-3"><p className="font-medium">{b.customer}</p><p className="text-[12px] text-muted">{b.phone}</p></td>
                              <td className="px-3 py-3 text-muted">{formatDate(b.startDate)}</td>
                              <td className="px-3 py-3">{b.travelers.adults + b.travelers.children}</td>
                              <td className="px-3 py-3"><span className="font-semibold">{formatINR(b.paid)}</span><span className="text-muted"> / {formatINR(b.amount)}</span></td>
                              <td className="px-3 py-3">
                                <select
                                  value={b.status}
                                  onChange={(e) => {
                                    const s = e.target.value
                                    updateBooking(b.id, { status: s, stage: stageForStatus[s], paid: s === 'completed' ? b.amount : b.paid })
                                    toast(`${b.id} marked ${s}`)
                                  }}
                                  className="input h-8 w-[130px] px-3 text-[12.5px] capitalize"
                                  aria-label={`Status for ${b.id}`}
                                >
                                  {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button type="button" onClick={() => setViewBooking(b)} className="grid size-8 place-items-center rounded-lg hover:bg-paper" aria-label="View booking"><Eye className="size-4" /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState title="No bookings match" desc="Clear the search or pick another status." />
                  )}
                </div>
              )}

              {tab === 'enquiries' && (
                <div>
                  <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search enquiries" /></div>
                  {enquiryList.length ? (
                    <div className="grid gap-3 xl:grid-cols-2">
                      {enquiryList.map((e) => (
                        <motion.div layout key={e.id} className="card p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold">{e.name}</p>
                                <Badge>{e.type}</Badge>
                              </div>
                              <p className="text-[12px] text-muted">{e.email} · {formatDate(e.date)}</p>
                            </div>
                            <StatusBadge status={e.status} />
                          </div>
                          <p className="mt-3 text-[14px] font-semibold">{e.subject}</p>
                          <p className="mt-1 line-clamp-3 text-[13.5px] text-muted">{e.message}</p>
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line-2 pt-3">
                            <select value={e.status} onChange={(ev) => { updateEnquiry(e.id, { status: ev.target.value }); toast('Enquiry updated') }} className="input h-8 w-[140px] px-3 text-[12.5px]" aria-label="Enquiry status">
                              <option value="new">New</option>
                              <option value="in-progress">In progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <Button size="sm" variant="outline" onClick={() => { setReply(e); setReplyText(`Hi ${e.name.split(' ')[0]},\n\nThanks for reaching out about "${e.subject}". `) }}>
                              <MessageSquare className="size-3.5" /> Reply
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState title="Inbox zero" desc="No enquiries match your search." />
                  )}
                </div>
              )}

              {tab === 'customers' && (
                <div>
                  <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search customers" /></div>
                  <div className="card overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-[13.5px]">
                      <thead className="text-[11.5px] uppercase tracking-wider text-muted">
                        <tr className="border-b border-line-2 bg-paper/60"><th className="px-4 py-3 font-semibold">Customer</th><th className="px-3 py-3 font-semibold">City</th><th className="px-3 py-3 font-semibold">Trips</th><th className="px-3 py-3 font-semibold">Lifetime value</th><th className="px-3 py-3 font-semibold">Tier</th><th className="px-4 py-3 font-semibold">Joined</th></tr>
                      </thead>
                      <tbody className="divide-y divide-line-2">
                        {customerList.map((c) => (
                          <tr key={c.id} className="hover:bg-paper/60">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar id={c.avatar} name={c.name} size={36} className="ring-0" />
                                <div><p className="font-semibold">{c.name}</p><p className="text-[12px] text-muted">{c.email}</p></div>
                              </div>
                            </td>
                            <td className="px-3 py-3 text-muted">{c.city}</td>
                            <td className="px-3 py-3">{c.trips}</td>
                            <td className="px-3 py-3 font-semibold">{formatINR(c.spent)}</td>
                            <td className="px-3 py-3"><Badge tone={c.tier === 'Platinum' ? 'info' : c.tier === 'Gold' ? 'gold' : 'neutral'}>{c.tier}</Badge></td>
                            <td className="px-4 py-3 text-muted">{formatDate(c.joined)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tab === 'settings' && (
                <div className="grid gap-5 xl:grid-cols-3 [&>*]:min-w-0">
                  <form className="card p-5 xl:col-span-2" onSubmit={(e) => { e.preventDefault(); toast('Settings saved') }}>
                    <h2 className="font-sans text-[16px]">Agency profile</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {[['name', 'Agency name'], ['email', 'Support email'], ['phone', 'Support phone']].map(([k, l]) => (
                        <div key={k}>
                          <label className="label" htmlFor={`s-${k}`}>{l}</label>
                          <input id={`s-${k}`} className="input" value={settings[k]} onChange={(e) => setSettings((s) => ({ ...s, [k]: e.target.value }))} />
                        </div>
                      ))}
                      <div>
                        <label className="label" htmlFor="s-cur">Currency</label>
                        <select id="s-cur" className="input" value={settings.currency} onChange={(e) => setSettings((s) => ({ ...s, currency: e.target.value }))}>
                          <option>INR</option><option>USD</option><option>EUR</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-5 divide-y divide-line-2 border-t border-line-2">
                      {[['autoConfirm', 'Auto-confirm paid bookings'], ['notifyEmail', 'Email me on new enquiries'], ['maintenance', 'Maintenance mode']].map(([k, l]) => (
                        <label key={k} className="flex cursor-pointer items-center justify-between py-3 text-[14px] font-medium">
                          {l}
                          <span className="relative">
                            <input type="checkbox" checked={settings[k]} onChange={(e) => setSettings((s) => ({ ...s, [k]: e.target.checked }))} className="peer sr-only" />
                            <span className="block h-6 w-11 rounded-full bg-line transition peer-checked:bg-ink" />
                            <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end"><Button type="submit">Save settings</Button></div>
                  </form>
                  <div className="card h-fit p-5">
                    <h2 className="font-sans text-[16px]">Demo data</h2>
                    <p className="mt-1.5 text-[13.5px] text-muted">Restore the original packages, bookings and enquiries. Your sign-in and wishlist stay as they are.</p>
                    <Button variant="outline" className="mt-4 w-full" onClick={() => { resetDemo(); toast('Demo data restored', 'info') }}>
                      <RotateCcw className="size-4" /> Reset demo data
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <PackageForm
        open={!!editing}
        initial={editing && editing !== 'new' ? editing : null}
        onClose={() => setEditing(null)}
        onSave={(p) => {
          savePackage(p)
          toast(editing === 'new' ? 'Package created' : 'Package updated')
          setEditing(null)
        }}
      />

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete package?" size="sm">
        <div className="p-5">
          <p className="text-[14px] text-muted">“{deleting?.title}” will be removed from the catalogue. Existing bookings are not affected.</p>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" onClick={() => { removePackage(deleting.slug); toast('Package deleted', 'info'); setDeleting(null) }}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewBooking} onClose={() => setViewBooking(null)} title={viewBooking ? `Booking ${viewBooking.id}` : ''} size="lg">
        {viewBooking && (() => {
          const b = bookings.find((x) => x.id === viewBooking.id) || viewBooking
          return (
            <div className="grid gap-6 p-5 md:grid-cols-2">
              <dl className="space-y-2.5 text-[13.5px]">
                {[
                  ['Package', pkgTitle(b.packageSlug)],
                  ['Customer', b.customer],
                  ['Email', b.email],
                  ['Phone', b.phone],
                  ['Departure', formatDate(b.startDate)],
                  ['Travellers', `${b.travelers.adults} adults, ${b.travelers.children} children`],
                  ['Total', formatINR(b.amount)],
                  ['Paid', formatINR(b.paid)],
                  ['Booked on', formatDate(b.createdAt)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-line-2 pb-2"><dt className="text-muted">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                ))}
              </dl>
              <div>
                <p className="mb-3 text-[14px] font-semibold">Progress</p>
                <BookingTimeline booking={b} />
                {b.status !== 'cancelled' && b.stage < bookingStages.length - 1 && (
                  <Button size="sm" className="mt-5" onClick={() => { updateBooking(b.id, { stage: b.stage + 1, status: b.stage + 1 >= 5 ? 'completed' : b.stage + 1 >= 4 ? 'ongoing' : 'confirmed' }); toast('Moved to next stage') }}>
                    Advance to “{bookingStages[b.stage + 1].label}”
                  </Button>
                )}
              </div>
            </div>
          )
        })()}
      </Modal>

      <Modal open={!!reply} onClose={() => setReply(null)} title={reply ? `Reply to ${reply.name}` : ''} size="md">
        {reply && (
          <form className="p-5" onSubmit={(e) => { e.preventDefault(); updateEnquiry(reply.id, { status: 'in-progress' }); toast(`Reply sent to ${reply.email} (simulated)`); setReply(null) }}>
            <p className="text-[13px] text-muted">Re: {reply.subject}</p>
            <textarea rows={7} value={replyText} onChange={(e) => setReplyText(e.target.value)} className="input mt-3 h-auto py-3" aria-label="Reply message" />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReply(null)}>Cancel</Button>
              <Button type="submit" disabled={replyText.trim().length < 10}>Send reply</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
