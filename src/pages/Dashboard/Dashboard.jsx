import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { CalendarDays, Users, MapPin, Plane, Heart, Award, CheckCircle2, ArrowUpRight, LogOut, Settings, Briefcase, LayoutGrid, User, Wallet, Bell } from 'lucide-react'
import { PageTransition } from '../../components/common/Reveal'
import { Img, Avatar } from '../../components/common/Img'
import { Button, ButtonLink } from '../../components/common/Button'
import { Tabs } from '../../components/common/Tabs'
import { StatusBadge } from '../../components/common/Bits'
import { Modal } from '../../components/common/Modal'
import { EmptyState } from '../../components/common/EmptyState'
import { Field } from '../../components/forms/Field'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { SavedGrid } from '../../components/cards/SavedGrid'
import { getDestination } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate, addDays, cn } from '../../utils/format'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  phone: z.string().trim().regex(/^[+\d\s-]{10,16}$/, 'Enter a valid mobile number'),
  city: z.string().trim().min(2, 'Enter your city'),
})

function daysUntil(date) {
  return Math.ceil((new Date(date) - new Date()) / 864e5)
}

function TripCard({ b, p, onOpen }) {
  const d = getDestination(p.destination)
  return (
    <motion.div layout className="card flex flex-col gap-4 p-3 sm:flex-row">
      <Img id={p.image} alt={p.title} className="aspect-[16/9] w-full shrink-0 rounded-xl sm:aspect-auto sm:h-auto sm:w-44" sizes="(max-width: 640px) 100vw, 180px" />
      <div className="flex min-w-0 flex-1 flex-col py-1 sm:pr-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold tracking-wider text-gold-dark">{b.id}</span>
          <StatusBadge status={b.status} />
        </div>
        <p className="mt-1 text-[16px] font-semibold leading-snug">{p.title}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-muted">
          <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {d?.name}</span>
          <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> {formatDate(b.startDate)}</span>
          <span className="flex items-center gap-1.5"><Users className="size-3.5" /> {b.travelers.adults + b.travelers.children} travellers</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="text-[13px] text-muted">
            Total <b className="text-[15px] text-ink">{formatINR(b.amount)}</b>
          </p>
          <Button size="sm" variant="outline" onClick={() => onOpen(b)}>
            View details
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  useDocumentTitle('My dashboard')
  const { user, bookings, catalog, wishlist, cancelBooking, updateProfile, logout } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const setTab = (t) => setParams(t === 'overview' ? {} : { tab: t }, { replace: true })
  const [tripFilter, setTripFilter] = useState('upcoming')
  const [open, setOpen] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [prefs, setPrefs] = useState({ deals: true, whatsapp: true, newsletter: false })

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: user?.name, phone: user?.phone, city: user?.city } })
  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone, city: user.city })
  }, [user, reset])

  const mine = useMemo(
    () =>
      bookings
        .filter((b) => user && (b.userId === user.id || b.email === user.email))
        .map((b) => ({ b, p: catalog.find((x) => x.slug === b.packageSlug) }))
        .filter((x) => x.p),
    [bookings, catalog, user],
  )

  if (!user)
    return (
      <div className="container-x py-16">
        <EmptyState
          title="Sign in to see your trips"
          desc="Your bookings, saved places and travel documents live in your Wanderly account."
          action={
            <div className="flex gap-2">
              <ButtonLink to="/login?redirect=/dashboard">Sign in</ButtonLink>
              <ButtonLink to="/signup" variant="outline">Create account</ButtonLink>
            </div>
          }
        />
      </div>
    )

  const upcoming = mine.filter(({ b }) => ['confirmed', 'pending', 'ongoing'].includes(b.status))
  const completed = mine.filter(({ b }) => b.status === 'completed')
  const cancelled = mine.filter(({ b }) => b.status === 'cancelled')
  const next = [...upcoming].sort((a, b) => new Date(a.b.startDate) - new Date(b.b.startDate))[0]
  const trips = { upcoming, completed, cancelled }[tripFilter]
  const spent = mine.filter(({ b }) => b.status !== 'cancelled').reduce((s, { b }) => s + b.paid, 0)
  const openP = open && catalog.find((x) => x.slug === open.packageSlug)

  const tabs = [
    { value: 'overview', label: 'Overview', icon: <LayoutGrid className="size-3.5" /> },
    { value: 'trips', label: 'My trips', icon: <Briefcase className="size-3.5" />, count: mine.length },
    { value: 'saved', label: 'Saved', icon: <Heart className="size-3.5" />, count: wishlist.length },
    { value: 'profile', label: 'Profile', icon: <User className="size-3.5" /> },
  ]

  return (
    <PageTransition>
      <section className="container-x pt-5 md:pt-8">
        {/* Profile header */}
        <div className="relative overflow-hidden rounded-[16px] bg-navy p-5 text-white sm:p-7">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-gold/25 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar id={user.avatar} name={user.name} size={64} className="ring-white/20" />
              <div>
                <p className="text-[13px] text-white/60">Good to see you,</p>
                <h1 className="text-[24px] !text-white md:text-[28px]">{user.name}</h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[#d3ebf9]">
                  <Award className="size-3.5" /> {user.tier} · member since {formatDate(user.memberSince, { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="w-full max-w-xs rounded-xl bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-white/70">Wanderly points</span>
                <b>{user.points?.toLocaleString('en-IN')}</b>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                <motion.div className="h-full rounded-full bg-[#d3ebf9]" initial={{ width: 0 }} animate={{ width: `${Math.min(100, ((user.points || 0) / 7500) * 100)}%` }} transition={{ duration: 1 }} />
              </div>
              <p className="mt-1.5 text-[11.5px] text-white/60">{Math.max(0, 7500 - (user.points || 0)).toLocaleString('en-IN')} points to Platinum</p>
            </div>
          </div>
        </div>

        <Tabs tabs={tabs} value={tab} onChange={setTab} id="dash" className="mt-6" />

        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          {tab === 'overview' && (
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="grid grid-cols-2 gap-3 lg:col-span-3 lg:grid-cols-4">
                {[
                  { icon: Plane, label: 'Upcoming trips', value: upcoming.length, tone: 'bg-info-soft text-info' },
                  { icon: CheckCircle2, label: 'Trips completed', value: completed.length, tone: 'bg-success-soft text-success' },
                  { icon: Heart, label: 'Saved places', value: wishlist.length, tone: 'bg-danger-soft text-danger' },
                  { icon: Wallet, label: 'Total spent', value: formatINR(spent), tone: 'bg-gold-soft text-gold-dark' },
                ].map((s) => (
                  <div key={s.label} className="card p-4">
                    <span className={cn('grid size-9 place-items-center rounded-xl', s.tone)}><s.icon className="size-[18px]" /></span>
                    <p className="mt-3 text-[22px] font-bold tracking-tight">{s.value}</p>
                    <p className="text-[12.5px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2">
                <h2 className="font-sans mb-3 text-[16px]">Your next adventure</h2>
                {next ? (
                  <div className="card overflow-hidden">
                    <div className="relative h-52">
                      <Img id={next.p.image} alt={next.p.title} className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 60vw" />
                      <div className="img-shade absolute inset-0" />
                      <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-2 text-center backdrop-blur">
                        <p className="text-[22px] font-bold leading-none">{Math.max(0, daysUntil(next.b.startDate))}</p>
                        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted">days to go</p>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-[12.5px] text-white/75">{formatDate(next.b.startDate)} – {formatDate(addDays(next.b.startDate, next.p.days - 1))}</p>
                        <p className="text-[20px] font-semibold">{next.p.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div className="flex items-center gap-2"><StatusBadge status={next.b.status} /><span className="text-[13px] text-muted">Ref {next.b.id}</span></div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setOpen(next.b)}>Trip details</Button>
                        <ButtonLink size="sm" to={`/track?id=${next.b.id}`}>Track</ButtonLink>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No upcoming trips" desc="Your next story is waiting to be written." action={<ButtonLink to="/packages" arrow>Find a trip</ButtonLink>} />
                )}
              </div>

              <div>
                <h2 className="font-sans mb-3 text-[16px]">Notifications</h2>
                <div className="card divide-y divide-line-2">
                  {[
                    { t: 'Hotel vouchers ready', d: 'Kashmir: Paradise on Earth', time: '2h ago' },
                    { t: 'Price drop on a saved trip', d: 'Ladakh is now 12% off', time: '1d ago' },
                    { t: 'Balance reminder', d: 'Due 21 days before departure', time: '3d ago' },
                    { t: 'You earned 250 points', d: 'For reviewing your Kerala trip', time: '1w ago' },
                  ].map((n) => (
                    <div key={n.t} className="flex gap-3 p-3.5">
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-sand"><Bell className="size-3.5" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-semibold">{n.t}</p>
                        <p className="truncate text-[12.5px] text-muted">{n.d}</p>
                      </div>
                      <span className="shrink-0 text-[11.5px] text-faint">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'trips' && (
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {[['upcoming', upcoming.length], ['completed', completed.length], ['cancelled', cancelled.length]].map(([k, n]) => (
                  <button key={k} type="button" className="chip capitalize" data-active={tripFilter === k} onClick={() => setTripFilter(k)}>
                    {k} <span className="opacity-60">{n}</span>
                  </button>
                ))}
              </div>
              {trips.length ? (
                <div className="grid gap-3 xl:grid-cols-2">
                  {trips.map(({ b, p }) => (
                    <TripCard key={b.id} b={b} p={p} onOpen={setOpen} />
                  ))}
                </div>
              ) : (
                <EmptyState title={`No ${tripFilter} trips`} desc="When you book a trip it will show up here." action={<ButtonLink to="/packages" arrow>Browse packages</ButtonLink>} />
              )}
            </div>
          )}

          {tab === 'saved' && <SavedGrid />}

          {tab === 'profile' && (
            <div className="grid gap-5 lg:grid-cols-3">
              <form
                className="card p-5 lg:col-span-2"
                noValidate
                onSubmit={handleSubmit((data) => {
                  updateProfile(data)
                  toast('Profile updated')
                })}
              >
                <h2 className="font-sans text-[16px]">Personal details</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
                    <input className="input" {...register('name')} aria-invalid={!!errors.name} />
                  </Field>
                  <Field label="Email" hint="Contact support to change your email">
                    <input className="input bg-paper text-muted" value={user.email} readOnly />
                  </Field>
                  <Field label="Mobile" error={errors.phone}>
                    <input className="input" {...register('phone')} aria-invalid={!!errors.phone} />
                  </Field>
                  <Field label="City" error={errors.city}>
                    <input className="input" {...register('city')} aria-invalid={!!errors.city} />
                  </Field>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button type="submit" disabled={!isDirty}>Save changes</Button>
                </div>
              </form>
              <div className="space-y-5">
                <div className="card p-5">
                  <h2 className="font-sans flex items-center gap-2 text-[16px]"><Settings className="size-4" /> Preferences</h2>
                  <div className="mt-3 divide-y divide-line-2">
                    {[
                      ['deals', 'Deal alerts', 'Price drops on saved trips'],
                      ['whatsapp', 'WhatsApp updates', 'Trip reminders & host chat'],
                      ['newsletter', 'Monthly newsletter', 'Stories and new itineraries'],
                    ].map(([k, t, d]) => (
                      <label key={k} className="flex cursor-pointer items-center justify-between gap-3 py-3">
                        <span>
                          <span className="block text-[14px] font-semibold">{t}</span>
                          <span className="block text-[12.5px] text-muted">{d}</span>
                        </span>
                        <span className="relative">
                          <input type="checkbox" checked={prefs[k]} onChange={(e) => { setPrefs((p) => ({ ...p, [k]: e.target.checked })); toast('Preference saved') }} className="peer sr-only" />
                          <span className="block h-6 w-11 rounded-full bg-line transition peer-checked:bg-ink" />
                          <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-danger"
                  onClick={() => {
                    logout()
                    toast('Signed out', 'info')
                    navigate('/')
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? `Booking ${open.id}` : ''} size="lg">
        {open && openP && (
          <div className="grid gap-6 p-5 md:grid-cols-2">
            <div>
              <Img id={openP.image} alt={openP.title} className="aspect-[16/10] rounded-xl" sizes="400px" />
              <p className="mt-3 text-[17px] font-semibold">{openP.title}</p>
              <dl className="mt-3 space-y-2 text-[13.5px]">
                <div className="flex justify-between"><dt className="text-muted">Dates</dt><dd className="font-medium">{formatDate(open.startDate)} – {formatDate(addDays(open.startDate, openP.days - 1))}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Travellers</dt><dd className="font-medium">{open.travelers.adults} adults, {open.travelers.children} children</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Booked on</dt><dd className="font-medium">{formatDate(open.createdAt)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Total</dt><dd className="font-semibold">{formatINR(open.amount)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Paid</dt><dd className="font-semibold text-success">{formatINR(open.paid)}</dd></div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <ButtonLink size="sm" to={`/packages/${openP.slug}`} variant="outline">View package <ArrowUpRight className="size-3.5" /></ButtonLink>
                {['confirmed', 'pending'].includes(open.status) && (
                  <Button size="sm" variant="ghost" className="text-danger hover:bg-danger-soft" onClick={() => setConfirmCancel(true)}>
                    Cancel booking
                  </Button>
                )}
              </div>
            </div>
            <div>
              <p className="mb-4 text-[14px] font-semibold">Status</p>
              <BookingTimeline booking={bookings.find((x) => x.id === open.id) || open} />
            </div>
          </div>
        )}
      </Modal>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} title="Cancel this booking?" size="sm">
        <div className="p-5">
          <p className="text-[14px] text-muted">
            Cancelling more than 30 days before departure is free (excluding non-refundable components). Refunds reach you in 5–7 working days. See the{' '}
            <Link to="/cancellation-policy" className="font-semibold text-ink underline">full policy</Link>.
          </p>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmCancel(false)}>Keep booking</Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                cancelBooking(open.id)
                setConfirmCancel(false)
                setOpen(null)
                toast('Booking cancelled. Refund initiated.', 'info')
              }}
            >
              Yes, cancel
            </Button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  )
}
