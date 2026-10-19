import { useParams, Link } from 'react-router-dom'
import { MapPin, CalendarDays, Clock, Thermometer, Languages, Share2, ArrowUpRight } from 'lucide-react'
import { Gallery } from '../../components/common/Gallery'
import { Img } from '../../components/common/Img'
import { Rating, WishButton } from '../../components/common/Bits'
import { ButtonLink } from '../../components/common/Button'
import { PageTransition, Reveal, Stagger, StaggerItem } from '../../components/common/Reveal'
import { SectionHeader } from '../../components/common/SectionHeader'
import { PackageCard } from '../../components/cards/PackageCard'
import { DestinationCard } from '../../components/cards/DestinationCard'
import { EmptyState } from '../../components/common/EmptyState'
import { getDestination, destinations } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, cn } from '../../utils/format'
import NotFound from '../Info/NotFound'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Parses "Oct – Mar" into a set of month indexes (wrapping across the new year).
const bestMonths = (range) => {
  const [a, b] = range.split('–').map((s) => MONTHS.indexOf(s.trim()))
  if (a < 0 || b < 0) return new Set()
  const out = new Set()
  for (let i = a; ; i = (i + 1) % 12) {
    out.add(i)
    if (i === b) break
  }
  return out
}

export default function DestinationDetail() {
  const { slug } = useParams()
  const d = getDestination(slug)
  const { catalog } = useApp()
  const toast = useToast()
  useDocumentTitle(d?.name)
  if (!d) return <NotFound />

  const pkgs = catalog.filter((p) => p.active && p.destination === d.slug)
  const similar = destinations.filter((x) => x.slug !== d.slug && x.category === d.category).slice(0, 4)
  const best = bestMonths(d.bestTime)

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: d.name, url: window.location.href })
      else {
        await navigator.clipboard.writeText(window.location.href)
        toast('Link copied to clipboard')
      }
    } catch {
      /* share dismissed */
    }
  }

  const facts = [
    { icon: CalendarDays, label: 'Best time', value: d.bestTime },
    { icon: Clock, label: 'Ideal trip', value: d.idealDuration },
    { icon: Thermometer, label: 'Weather', value: d.weather },
    { icon: Languages, label: 'Language', value: d.language },
  ]

  return (
    <PageTransition>
      <section className="container-x pt-4 md:pt-6">
        <nav className="mb-4 text-[12.5px] text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:underline">Home</Link> / <Link to="/destinations" className="hover:underline">Destinations</Link> / <span className="text-ink">{d.name}</span>
        </nav>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
              <MapPin className="size-4 text-gold" /> {d.location}, {d.country}
            </p>
            <h1 className="h-display mt-1.5">
              {d.name} <span className="serif-accent text-gold">· {d.tagline.toLowerCase()}</span>
            </h1>
            <div className="mt-2.5 flex items-center gap-3">
              <Rating value={d.rating} count={d.reviews} />
              <span className="text-[13px] text-muted">·</span>
              <span className="text-[13px] text-muted">{d.category}</span>
            </div>
          </Reveal>
          <div className="flex gap-2">
            <button type="button" onClick={share} className="chip h-10">
              <Share2 className="size-4" /> Share
            </button>
            <WishButton id={d.slug} className="size-10 border border-line" />
          </div>
        </div>
        <Gallery images={d.gallery.length > 1 ? d.gallery : [d.image, ...d.attractions.map((a) => a.image)]} alt={d.name} />
      </section>

      <section className="container-x mt-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal>
            <h2 className="text-[22px]">Overview</h2>
            <p className="mt-3 text-[15.5px] leading-[1.8] text-ink-2">{d.description}</p>
          </Reveal>

          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="border-t border-line pt-3">
                <f.icon className="size-[18px] text-gold" />
                <p className="mt-2 text-[12px] text-muted">{f.label}</p>
                <p className="text-[14px] font-semibold">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <h2 className="text-[22px]">Top attractions</h2>
            <Stagger className="mt-5 grid gap-4 sm:grid-cols-3">
              {d.attractions.map((a, k) => (
                <StaggerItem key={a.name} className="group">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[16px]">
                    <Img id={a.image} alt={a.name} className="absolute inset-0" imgClassName="group-hover:scale-[1.05]" sizes="(max-width: 640px) 100vw, 25vw" />
                    <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-white text-[12px] font-bold">{k + 1}</span>
                  </div>
                  <h3 className="mt-3 text-[16px] font-semibold">{a.name}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{a.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="mt-12">
            <h2 className="text-[22px]">Best time to visit</h2>
            <p className="mt-2 text-[14.5px] text-muted">
              The sweet spot for {d.name} is <b className="text-ink">{d.bestTime}</b>, when the weather is at its most comfortable ({d.weather}).
            </p>
            <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-12">
              {MONTHS.map((m, i) => (
                <div key={m} className={cn('rounded-xl py-3 text-center text-[12.5px] font-semibold', best.has(i) ? 'bg-sea text-white' : 'bg-white text-faint ring-1 ring-line')}>
                  {m}
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex gap-4 text-[12px] text-muted">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-sea" /> Ideal</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-line" /> Off-season</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="card sticky top-24 p-5">
            <p className="text-[13px] text-muted">Trips to {d.name} from</p>
            <p className="mt-0.5 text-[30px] font-bold tracking-tight">
              {formatINR(d.startingPrice)} <span className="text-[13px] font-medium text-muted">/ person</span>
            </p>
            <ul className="mt-4 space-y-2 border-t border-line-2 pt-4 text-[13.5px] text-ink-2">
              <li>✓ Handpicked stays & private transfers</li>
              <li>✓ Local guide & 24/7 trip host</li>
              <li>✓ Free date change up to 30 days</li>
            </ul>
            <div className="mt-5 grid gap-2">
              {pkgs[0] && (
                <ButtonLink to={`/packages/${pkgs[0].slug}`} arrow>
                  View {pkgs.length > 1 ? `${pkgs.length} packages` : 'package'}
                </ButtonLink>
              )}
              <ButtonLink to={`/planner?destination=${d.slug}`} variant="outline">
                Customise a trip
              </ButtonLink>
            </div>
          </div>
        </aside>
      </section>

      <section className="container-x pt-20">
        <SectionHeader title={`Packages for ${d.name}`} desc="Ready-made itineraries you can book today or tailor to your pace." />
        {pkgs.length ? (
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {pkgs.map((p) => (
              <PackageCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={`No fixed packages for ${d.name} yet`}
            desc="Our experts can build a private itinerary around your dates and budget."
            action={<ButtonLink to={`/planner?destination=${d.slug}`} arrow>Plan a custom trip</ButtonLink>}
          />
        )}
      </section>

      {similar.length > 0 && (
        <section className="container-x pt-20">
          <SectionHeader
            title="You may also like"
            action={
              <Link to={`/destinations?category=${d.category}`} className="inline-flex items-center gap-1 text-[14px] font-semibold hover:text-gold-dark">
                More {d.category.toLowerCase()} <ArrowUpRight className="size-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4">
            {similar.map((x) => (
              <DestinationCard key={x.slug} d={x} showPrice={false} />
            ))}
          </div>
        </section>
      )}
    </PageTransition>
  )
}
