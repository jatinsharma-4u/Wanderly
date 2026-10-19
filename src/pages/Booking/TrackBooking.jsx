import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, AlertCircle, CalendarDays, Users, Phone, ArrowUpRight } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition } from '../../components/common/Reveal'
import { Button } from '../../components/common/Button'
import { Img } from '../../components/common/Img'
import { Lottie } from '../../components/common/Lottie'
import { StatusBadge } from '../../components/common/Bits'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { useApp } from '../../context/AppContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate, addDays, sleep } from '../../utils/format'
import compass from '../../assets/lottie/compass.json'

export default function TrackBooking() {
  useDocumentTitle('Track your booking')
  const { bookings, catalog } = useApp()
  const [params, setParams] = useSearchParams()
  const [id, setId] = useState(params.get('id') || '')
  const [state, setState] = useState({ status: 'idle' })

  const lookup = async (raw) => {
    const ref = raw.trim().toUpperCase()
    if (!/^WL-\d{5}$/.test(ref)) {
      setState({ status: 'error', message: 'Booking IDs look like WL-48217. Please check and try again.' })
      return
    }
    setParams({ id: ref }, { replace: true })
    setState({ status: 'loading' })
    await sleep(1100)
    const b = bookings.find((x) => x.id === ref)
    if (!b) setState({ status: 'error', message: `We couldn’t find a booking with ID ${ref}.` })
    else setState({ status: 'found', booking: b })
  }

  useEffect(() => {
    if (params.get('id')) lookup(params.get('id'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const b = state.booking
  const p = b && catalog.find((x) => x.slug === b.packageSlug)
  const samples = ['WL-48217', 'WL-51934', 'WL-29014', 'WL-33480']

  return (
    <PageTransition>
      <PageHeader title="Track your" accent="booking" desc="Enter your booking reference to see live status, payment details and what happens next." crumbs={[{ label: 'Track booking' }]} />

      <section className="container-x mt-8 max-w-3xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            lookup(id)
          }}
          className="card flex flex-col gap-2 p-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input
              value={id}
              onChange={(e) => setId(e.target.value.toUpperCase())}
              placeholder="Booking ID, e.g. WL-48217"
              className="h-12 w-full rounded-xl bg-transparent pl-10 pr-3 text-[15px] font-semibold tracking-wide outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-faint"
              aria-label="Booking ID"
            />
          </div>
          <Button type="submit" size="lg" loading={state.status === 'loading'}>
            Track status
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12.5px] text-muted">
          Try a demo ID:
          {samples.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setId(s)
                lookup(s)
              }}
              className="rounded-full border border-line bg-white px-2.5 py-1 font-semibold text-ink-2 hover:border-ink/30"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <AnimatePresence mode="wait">
            {state.status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card flex flex-col items-center px-6 py-12 text-center">
                <Lottie data={compass} className="size-28" />
                <p className="mt-2 font-semibold">Your trip status will appear here</p>
                <p className="mt-1 text-[13.5px] text-muted">Find your booking ID in your confirmation email or dashboard.</p>
              </motion.div>
            )}
            {state.status === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card flex flex-col items-center px-6 py-12 text-center" role="status">
                <Lottie data={compass} className="size-28" />
                <p className="mt-2 font-semibold">Looking up your booking…</p>
              </motion.div>
            )}
            {state.status === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3 rounded-[var(--radius-card)] border border-danger/20 bg-danger-soft p-5" role="alert">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-danger" />
                <div>
                  <p className="font-semibold text-danger">Booking not found</p>
                  <p className="mt-0.5 text-[14px] text-ink-2">{state.message}</p>
                  <Link to="/contact" className="mt-2 inline-flex items-center gap-1 text-[13.5px] font-semibold underline underline-offset-2">
                    Contact support <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
            {state.status === 'found' && p && (
              <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-5 md:grid-cols-5">
                <div className="card overflow-hidden md:col-span-2">
                  <Img id={p.image} alt={p.title} className="h-36" sizes="(max-width: 768px) 100vw, 40vw" />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-bold tracking-wider text-gold-dark">{b.id}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <Link to={`/packages/${p.slug}`} className="mt-1.5 block text-[16px] font-semibold leading-snug hover:text-gold-dark">{p.title}</Link>
                    <div className="mt-3 space-y-1.5 text-[13px] text-ink-2">
                      <p className="flex items-center gap-2"><CalendarDays className="size-3.5 text-gold" /> {formatDate(b.startDate)} – {formatDate(addDays(b.startDate, p.days - 1))}</p>
                      <p className="flex items-center gap-2"><Users className="size-3.5 text-gold" /> {b.travelers.adults + b.travelers.children} travellers · {b.customer}</p>
                    </div>
                    <div className="mt-4 rounded-xl bg-paper p-3 text-[13px]">
                      <div className="flex justify-between"><span className="text-muted">Total</span><b>{formatINR(b.amount)}</b></div>
                      <div className="flex justify-between"><span className="text-muted">Paid</span><b className="text-success">{formatINR(b.paid)}</b></div>
                      {b.amount > b.paid && b.status !== 'cancelled' && (
                        <div className="flex justify-between"><span className="text-muted">Balance</span><b className="text-gold-dark">{formatINR(b.amount - b.paid)}</b></div>
                      )}
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
                        <motion.div className="h-full rounded-full bg-success" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (b.paid / b.amount) * 100)}%` }} transition={{ duration: 0.8 }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card p-5 md:col-span-3">
                  <p className="mb-5 text-[15px] font-semibold">Trip progress</p>
                  <BookingTimeline booking={b} />
                  <a href="tel:+918045671234" className="mt-6 flex items-center gap-3 rounded-xl bg-sand p-3.5 text-[13.5px]">
                    <span className="grid size-9 place-items-center rounded-full bg-white"><Phone className="size-4" /></span>
                    <span>
                      Questions about this trip? <b>Call your trip host</b>
                    </span>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  )
}
