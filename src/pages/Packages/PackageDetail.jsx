import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, MapPin, Clock, Users, Hotel, Car, Utensils, Check, X, CalendarDays, MessageCircle, ShieldCheck, ChevronDown, Flame } from 'lucide-react'
import { Gallery } from '../../components/common/Gallery'
import { Rating, Badge, WishButton, Stars } from '../../components/common/Bits'
import { Button } from '../../components/common/Button'
import { Avatar } from '../../components/common/Img'
import { Accordion } from '../../components/common/Accordion'
import { PageTransition, Reveal } from '../../components/common/Reveal'
import { SectionHeader } from '../../components/common/SectionHeader'
import { PackageCard } from '../../components/cards/PackageCard'
import { Stepper, upcomingDepartures, priceFor } from '../../components/booking/TravellerStepper'
import { EnquiryModal } from '../../components/forms/EnquiryModal'
import { getDestination } from '../../data/destinations'
import { reviews } from '../../data/reviews'
import { useApp } from '../../context/AppContext'
import { getLenis } from '../../hooks/useSmoothScroll'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate, toISODate, cn } from '../../utils/format'
import NotFound from '../Info/NotFound'
import { Select } from '../../components/common/Select'

function Itinerary({ days }) {
  const [open, setOpen] = useState(0)
  return (
    <ol className="relative">
      {days.map((d, i) => {
        const isOpen = open === i
        return (
          <li key={d.day} className="relative pb-3 pl-12 last:pb-0">
            {i < days.length - 1 && <span className="absolute bottom-0 left-[17px] top-9 w-px bg-line" />}
            <span className={cn('absolute left-0 top-1 grid size-9 place-items-center rounded-full text-[12px] font-bold transition', isOpen ? 'bg-ink text-white' : 'border border-line bg-white text-ink')}>
              {String(d.day).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-3 rounded-xl py-2.5 text-left" aria-expanded={isOpen}>
              <span>
                <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-gold-dark">Day {d.day}</span>
                <span className="text-[15.5px] font-semibold">{d.title}</span>
              </span>
              <ChevronDown className={cn('size-4 shrink-0 text-muted transition', isOpen && 'rotate-180')} />
            </button>
            <motion.div initial={false} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} className="overflow-hidden">
              <p className="pb-2 text-[14.5px] leading-relaxed text-muted">{d.desc}</p>
            </motion.div>
          </li>
        )
      })}
    </ol>
  )
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gold">{eyebrow}</p>
      <h2 className="mt-1 text-[19px] md:text-[21px]">{title}</h2>
    </div>
  )
}

// Sticky in-page jump navigation; highlights the section currently in view.
function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0][0])
  useEffect(() => {
    const els = sections.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-35% 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])
  const go = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 130
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y)
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }
  return (
    <nav className="sticky top-16 z-20 -mx-3 border-b border-line bg-paper/90 px-3 backdrop-blur-xl sm:mx-0 sm:px-0 md:top-[72px]" aria-label="Package sections">
      <div className="no-scrollbar flex gap-1 overflow-x-auto py-2">
        {sections.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            className={cn('shrink-0 rounded-[8px] px-3 py-1.5 text-[13px] transition-colors', active === id ? 'bg-navy text-white' : 'text-muted hover:bg-sand hover:text-ink')}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  )
}

const sections = [
  ['overview', 'Overview'],
  ['itinerary', 'Itinerary'],
  ['inclusions', 'Inclusions'],
  ['stay', 'Stay & transport'],
  ['policy', 'Cancellation'],
  ['faqs', 'FAQs'],
  ['reviews', 'Reviews'],
]

function PackageDetailView() {
  const { slug } = useParams()
  const { catalog } = useApp()
  const navigate = useNavigate()
  const p = catalog.find((x) => x.slug === slug)
  useDocumentTitle(p?.title)
  const departures = upcomingDepartures()
  const [date, setDate] = useState(toISODate(departures[0]))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [enquiry, setEnquiry] = useState(false)

  if (!p) return <NotFound />
  const d = getDestination(p.destination)
  const { base, taxes, total } = priceFor(p.price, adults, children)
  const related = catalog.filter((x) => x.active && x.slug !== p.slug && (x.category === p.category || x.destination === p.destination)).slice(0, 3)
  const pkgReviews = reviews.filter((r) => r.trip === p.title).concat(reviews.filter((r) => r.trip !== p.title)).slice(0, 4)

  const book = () => navigate(`/booking/${p.slug}?date=${date}&adults=${adults}&children=${children}`)

  const facts = [
    { icon: Clock, label: 'Duration', value: `${p.days} days / ${p.days - 1} nights` },
    { icon: Users, label: 'Group size', value: `${p.groupSize} people` },
    { icon: Hotel, label: 'Stay', value: p.hotel },
    { icon: Car, label: 'Transport', value: p.transport },
    { icon: Utensils, label: 'Meals', value: p.meals },
    { icon: CalendarDays, label: 'Best season', value: d?.bestTime },
  ]

  return (
    <PageTransition>
      <section className="container-x pt-4 md:pt-6">
        <nav className="mb-4 text-[12.5px] text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">Home</Link> / <Link to="/packages" className="hover:underline">Packages</Link> / <span className="text-ink">{p.title}</span>
        </nav>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <Badge tone="gold">{p.category}</Badge>
              {p.tag && <Badge>{p.tag}</Badge>}
              {p.slotsLeft <= 4 && (
                <Badge tone="danger">
                  <Flame className="size-3" /> Only {p.slotsLeft} slots left
                </Badge>
              )}
            </div>
            <h1 className="text-[clamp(1.45rem,2.8vw,2.2rem)] leading-[1.08] tracking-[-0.035em]">{p.title}</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13.5px] text-muted">
              <Link to={`/destinations/${d?.slug}`} className="flex items-center gap-1 hover:text-ink">
                <MapPin className="size-4 text-gold" /> {d?.location}
              </Link>
              <span>·</span>
              <span>{p.days}D / {p.days - 1}N</span>
              <span>·</span>
              <Rating value={p.rating} count={p.reviews} />
            </div>
          </Reveal>
          <div className="flex gap-2">
            <button type="button" onClick={() => setEnquiry(true)} className="chip h-10">
              <MessageCircle className="size-4" /> Enquire
            </button>
            <WishButton id={p.slug} className="size-10 border border-line" />
          </div>
        </div>
        <Gallery images={p.gallery} alt={p.title} />
      </section>

      <section className="container-x mt-8 grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <SectionNav sections={sections} />

          <section id="overview" className="scroll-mt-36 pt-6">
            <p className="text-[15px] leading-[1.8] text-ink-2">{p.summary} {d?.description}</p>
            <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3 border-t border-line pt-3">
                  <f.icon className="mt-0.5 size-[18px] shrink-0 text-gold" />
                  <div className="min-w-0">
                    <p className="text-[11.5px] text-muted">{f.label}</p>
                    <p className="text-[13px] font-medium leading-snug">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mt-8 text-[16px] font-semibold">Trip highlights</h3>
            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[14px] text-ink-2">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-[6px] bg-gold-soft text-gold-dark"><Check className="size-3" /></span>
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <section id="itinerary" className="mt-10 scroll-mt-36 border-t border-line pt-8">
            <SectionTitle eyebrow={`${p.days} days`} title="Day-by-day itinerary" />
            <Itinerary days={p.itinerary} />
          </section>

          <section id="inclusions" className="mt-10 scroll-mt-36 border-t border-line pt-8">
            <SectionTitle eyebrow="Transparent pricing" title="Inclusions & exclusions" />
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 text-[14px] font-semibold"><span className="grid size-6 place-items-center rounded-[6px] bg-success-soft text-success"><Check className="size-3.5" /></span> What’s included</p>
                <ul className="mt-3 space-y-2">
                  {p.inclusions.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[13.5px] text-ink-2"><Check className="mt-0.5 size-4 shrink-0 text-success" /> {x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="flex items-center gap-2 text-[14px] font-semibold"><span className="grid size-6 place-items-center rounded-[6px] bg-danger-soft text-danger"><X className="size-3.5" /></span> Not included</p>
                <ul className="mt-3 space-y-2">
                  {p.exclusions.map((x) => (
                    <li key={x} className="flex gap-2.5 text-[13.5px] text-ink-2"><X className="mt-0.5 size-4 shrink-0 text-danger" /> {x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="stay" className="mt-10 scroll-mt-36 border-t border-line pt-8">
            <SectionTitle eyebrow="On the ground" title="Stay, transport & activities" />
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Hotel, t: 'Accommodation', v: p.hotel, d: `${p.days - 1} nights · twin sharing · personally inspected` },
                { icon: Car, t: 'Transport', v: p.transport, d: 'Private vehicle with an experienced local driver' },
                { icon: Utensils, t: 'Meals', v: p.meals, d: 'Veg, Jain and vegan preferences catered on request' },
              ].map((x) => (
                <div key={x.t} className="border-t border-line pt-4">
                  <x.icon className="size-5 text-gold" />
                  <p className="mt-3 text-[11px] uppercase tracking-[0.1em] text-muted">{x.t}</p>
                  <p className="text-[14px] font-medium">{x.v}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{x.d}</p>
                </div>
              ))}
            </div>
            <p className="mb-3 mt-6 text-[14px] font-semibold">Activities & experiences</p>
            <div className="flex flex-wrap gap-2">
              {[...(d?.attractions || []).map((a) => a.name), ...p.highlights.slice(0, 3)].map((a) => (
                <span key={a} className="inline-flex items-center gap-1.5 rounded-[8px] bg-sand px-3 py-1.5 text-[12.5px] text-ink-2"><Sparkles className="size-3.5 text-gold" /> {a}</span>
              ))}
            </div>
          </section>

          <section id="policy" className="mt-10 scroll-mt-36 border-t border-line pt-8">
            <SectionTitle eyebrow="Book with confidence" title="Cancellation policy" />
            <div className="overflow-hidden rounded-[12px] ring-1 ring-line">
              {[
                ['30+ days before departure', 'Full refund*', 'text-success'],
                ['15–29 days before', '75% refund', 'text-ink'],
                ['7–14 days before', '50% refund', 'text-ink'],
                ['Under 7 days / no-show', 'No refund', 'text-danger'],
              ].map(([a, b, c], i) => (
                <div key={a} className={cn('flex items-center justify-between gap-3 px-4 py-3 text-[13.5px]', i % 2 ? 'bg-paper' : 'bg-white')}>
                  <span className="text-ink-2">{a}</span>
                  <span className={cn('font-semibold', c)}>{b}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] text-muted">
              *Excluding non-refundable flights, permits and festival-period hotels. Free date changes up to 30 days before departure.{' '}
              <Link to="/cancellation-policy" className="font-medium text-navy underline underline-offset-2">Read the full policy</Link>
            </p>
          </section>

          <section id="faqs" className="mt-10 scroll-mt-36 border-t border-line pt-8">
            <SectionTitle eyebrow="Good to know" title="Frequently asked questions" />
            <Accordion
              defaultOpen={-1}
              items={[
                { q: 'How much do I need to pay to confirm?', a: `A 25% advance (${formatINR(Math.round(p.price * 0.25))} per person) confirms your seats. The balance is due 21 days before departure.` },
                { q: 'Can this itinerary be customised?', a: 'Yes, add nights, upgrade hotels or swap experiences. Mention it in special requests or send an enquiry and a trip designer will rework it for you.' },
                { q: 'Is this trip suitable for children or seniors?', a: p.category === 'Adventure' ? 'This is an active trip with long drives and altitude. Children above 8 and fit seniors are welcome after a quick consultation.' : 'Absolutely. We can adjust the pace, add rest time and request ground-floor rooms.' },
                { q: 'What happens if the weather disrupts plans?', a: 'Your trip host reroutes the day in real time and we substitute equivalent experiences at no extra cost wherever possible.' },
                { q: 'Are flights included?', a: p.international ? 'International flights are not included, but we can book them at the best available fares.' : 'Flights and trains are not included. We can add them to your booking at actual cost.' },
              ]}
            />
          </section>

          <section id="reviews" className="mt-10 scroll-mt-36 border-t border-line pt-8">
            <SectionTitle eyebrow={`${p.reviews} verified`} title="Traveller reviews" />
            <div className="mb-6 flex flex-wrap items-center gap-6">
              <div>
                <p className="text-[36px] font-semibold leading-none">{p.rating.toFixed(1)}</p>
                <Stars value={Math.round(p.rating)} className="mt-1.5" />
              </div>
              <div className="min-w-[200px] flex-1 space-y-1.5">
                {[[5, 82], [4, 13], [3, 4], [2, 1], [1, 0]].map(([st, pct]) => (
                  <div key={st} className="flex items-center gap-2 text-[12px] text-muted">
                    <span className="w-3">{st}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                      <motion.span className="block h-full rounded-full bg-gold" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
                    </span>
                    <span className="w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {pkgReviews.map((r) => (
                <figure key={r.id} className="border-t border-line pt-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar id={r.avatar} name={r.name} size={34} className="ring-0" />
                    <div>
                      <p className="text-[13px] font-semibold">{r.name}</p>
                      <p className="text-[11.5px] text-muted">{r.city} · {r.date}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} className="mt-3" />
                  <blockquote className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{r.text}</blockquote>
                </figure>
              ))}
            </div>
          </section>
        </div>

        {/* Booking widget */}
        <aside className="scroll-mt-24 lg:col-span-4" id="book">
          <div className="card no-scrollbar sticky top-24 overflow-hidden lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto" data-lenis-prevent>
            <div className="border-b border-line-2 bg-paper p-5">
              <p className="text-[12.5px] text-muted">
                Starting from <span className="line-through">{formatINR(p.originalPrice)}</span>
              </p>
              <p className="text-[28px] font-bold leading-tight tracking-tight">
                {formatINR(p.price)} <span className="text-[13px] font-medium text-muted">/ person</span>
              </p>
            </div>
            <div className="p-5">
              <p className="label">Departure date</p>
              <Select label="Departure date" value={date} onChange={setDate} options={departures.map((x) => ({ value: toISODate(x), label: formatDate(x, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }))} />
              <div className="mt-3 divide-y divide-line-2">
                <Stepper label="Adults" hint="12+ years" value={adults} onChange={setAdults} min={1} />
                <Stepper label="Children" hint="5–11 years · 60% fare" value={children} onChange={setChildren} />
              </div>
              <dl className="mt-3 space-y-1.5 border-t border-line-2 pt-3 text-[13.5px]">
                <div className="flex justify-between text-muted"><dt>Package ({adults + children} travellers)</dt><dd>{formatINR(base)}</dd></div>
                <div className="flex justify-between text-muted"><dt>GST & taxes (5%)</dt><dd>{formatINR(taxes)}</dd></div>
                <div className="flex justify-between pt-1 text-[16px] font-bold"><dt>Total</dt><dd>{formatINR(total)}</dd></div>
              </dl>
              <Button onClick={book} className="mt-4 w-full" size="lg" arrow>
                Book now
              </Button>
              <Button variant="outline" onClick={() => setEnquiry(true)} className="mt-2 w-full">
                Send an enquiry
              </Button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-muted">
                <ShieldCheck className="size-3.5 text-success" /> Pay just 25% now · free changes up to 30 days
              </p>
            </div>
          </div>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="container-x pt-20">
          <SectionHeader title="Similar packages" />
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {related.map((x) => (
              <PackageCard key={x.slug} p={x} />
            ))}
          </div>
        </section>
      )}

      {/* Spacer so the sticky bar never hides the last content on phones/tablets */}
      <div aria-hidden="true" className="h-24 lg:hidden" />

      {/* Mobile sticky booking bar, respects the browser safe area */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
        <div className="container-x flex items-center justify-between gap-3 pt-2.5">
          <button
            type="button"
            onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="min-w-0 text-left"
          >
            <p className="truncate text-[11px] text-muted">
              {formatDate(date, { day: 'numeric', month: 'short' })} · {adults + children} traveller{adults + children > 1 ? 's' : ''} · <span className="font-medium text-gold-dark underline underline-offset-2">Change</span>
            </p>
            <p className="text-[17px] font-semibold leading-tight">
              {formatINR(total)} <span className="text-[11px] font-normal text-muted">total</span>
            </p>
          </button>
          <Button onClick={book} variant="gold" arrow className="shrink-0">
            Book now
          </Button>
        </div>
      </div>

      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} subject={p.title} />
    </PageTransition>
  )
}

// Remount per package so tabs, dates and travellers reset when navigating between packages.
export default function PackageDetail() {
  const { slug } = useParams()
  return <PackageDetailView key={slug} />
}
