import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, CalendarDays, Users, MapPin, Printer, MessageCircle, Mail, Wallet } from 'lucide-react'
import { Lottie } from '../../components/common/Lottie'
import { Img } from '../../components/common/Img'
import { ButtonLink, Button } from '../../components/common/Button'
import { StatusBadge } from '../../components/common/Bits'
import { EmptyState } from '../../components/common/EmptyState'
import { PageTransition } from '../../components/common/Reveal'
import { BookingTimeline } from '../../components/booking/BookingTimeline'
import { getDestination } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate, addDays } from '../../utils/format'
import success from '../../assets/lottie/success.json'

export default function Confirmation() {
  const { id } = useParams()
  const { bookings, catalog } = useApp()
  const toast = useToast()
  useDocumentTitle('Booking confirmed')
  const b = bookings.find((x) => x.id === id)
  const p = b && catalog.find((x) => x.slug === b.packageSlug)

  if (!b || !p)
    return (
      <div className="container-x py-16">
        <EmptyState title="We couldn’t find that booking" desc="Check your booking reference or look it up from the tracking page." action={<ButtonLink to="/track">Track a booking</ButtonLink>} />
      </div>
    )

  const d = getDestination(p.destination)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(b.id)
    } catch {
      /* ignore */
    }
    toast('Booking reference copied')
  }

  return (
    <PageTransition>
      <section className="container-x max-w-4xl pt-8 md:pt-12">
        <div className="flex flex-col items-center text-center">
          <Lottie data={success} loop={false} className="size-36" />
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-[clamp(1.7rem,4vw,2.6rem)] font-semibold">
            You’re going to <span className="serif-accent text-gold">{d?.name}!</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-2 max-w-md text-[15px] text-muted">
            Your booking is confirmed. A confirmation has been sent to <b className="text-ink">{b.email}</b> and your trip host will reach out within 4 hours.
          </motion.p>
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            onClick={copy}
            className="mt-5 inline-flex items-center gap-3 rounded-xl border border-dashed border-gold bg-gold-soft px-5 py-3"
          >
            <span className="text-left">
              <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-gold-dark">Booking reference</span>
              <span className="text-[22px] font-bold tracking-wider">{b.id}</span>
            </span>
            <Copy className="size-4 text-gold-dark" />
          </motion.button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-5">
          <div className="card overflow-hidden md:col-span-3">
            <div className="relative h-40">
              <Img id={p.image} alt={p.title} className="absolute inset-0" sizes="(max-width: 768px) 100vw, 60vw" />
              <div className="img-shade absolute inset-0" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                <p className="text-[18px] font-semibold">{p.title}</p>
                <StatusBadge status={b.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5 text-[13.5px]">
              <div>
                <p className="flex items-center gap-1.5 text-muted"><CalendarDays className="size-3.5" /> Dates</p>
                <p className="font-semibold">{formatDate(b.startDate, { day: 'numeric', month: 'short' })} – {formatDate(addDays(b.startDate, p.days - 1))}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-muted"><Users className="size-3.5" /> Travellers</p>
                <p className="font-semibold">{b.travelers.adults} adults{b.travelers.children ? `, ${b.travelers.children} children` : ''}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-muted"><MapPin className="size-3.5" /> Destination</p>
                <p className="font-semibold">{d?.location}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-muted"><Wallet className="size-3.5" /> Paid / Total</p>
                <p className="font-semibold">{formatINR(b.paid)} / {formatINR(b.amount)}</p>
              </div>
            </div>
            <div className="border-t border-line-2 p-5">
              <p className="mb-3 text-[14px] font-semibold">Itinerary at a glance</p>
              <ol className="space-y-2">
                {p.itinerary.map((day) => (
                  <li key={day.day} className="flex gap-3 text-[13.5px]">
                    <span className="w-12 shrink-0 font-semibold text-gold-dark">Day {day.day}</span>
                    <span className="text-ink-2">{day.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div className="space-y-5 md:col-span-2">
            <div className="card p-5">
              <p className="mb-4 text-[14px] font-semibold">Booking status</p>
              <BookingTimeline booking={b} />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Mail, t: 'Check your inbox', d: 'E-vouchers & invoice sent' },
            { icon: MessageCircle, t: 'WhatsApp group', d: 'Your host adds you in 4 hrs' },
            { icon: Wallet, t: 'Balance due', d: b.amount > b.paid ? `${formatINR(b.amount - b.paid)} by ${formatDate(addDays(b.startDate, -21))}` : 'Fully paid, nothing due' },
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-3 rounded-xl bg-sand p-4">
              <x.icon className="size-5 shrink-0 text-gold-dark" />
              <div>
                <p className="text-[13.5px] font-semibold">{x.t}</p>
                <p className="text-[12.5px] text-muted">{x.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2.5 print:hidden">
          <ButtonLink to={`/track?id=${b.id}`} arrow>Track booking</ButtonLink>
          <ButtonLink to="/dashboard" variant="outline">Go to my trips</ButtonLink>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer className="size-4" /> Print
          </Button>
        </div>
        <p className="mt-6 text-center text-[12.5px] text-faint">This is a demo booking, no payment was charged.</p>
        <p className="mt-1 text-center text-[13px]">
          <Link to="/packages" className="font-semibold text-gold-dark hover:underline">Continue exploring →</Link>
        </p>
      </section>
    </PageTransition>
  )
}
