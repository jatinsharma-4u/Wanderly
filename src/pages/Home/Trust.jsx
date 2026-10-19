import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, CalendarCheck, Headphones, Star, ShieldCheck, Route, Award, Copy, Check, Timer, ArrowUpRight, MapPin, Compass, Plane } from 'lucide-react'
import { Img, Avatar } from '../../components/common/Img'
import { Stars } from '../../components/common/Bits'
import { Reveal, Stagger, StaggerItem } from '../../components/common/Reveal'
import { Counter } from '../../components/common/Counter'
import { ButtonLink } from '../../components/common/Button'
import { Accordion } from '../../components/common/Accordion'
import { SectionHeader } from '../../components/common/SectionHeader'
import { BlogCard } from '../../components/cards/BlogCard'
import { reviews } from '../../data/reviews'
import { offers, flashDeals, stats, faqs, blogPosts } from '../../data/content'
import { getPackage } from '../../data/packages'
import { useToast } from '../../context/ToastContext'
import { formatINR, img } from '../../utils/format'
import { TextReveal } from '../../components/common/TextReveal'

function useCountdown(hours) {
  const [end] = useState(() => Date.now() + hours * 3600 * 1000)
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.max(0, Math.floor((end - now) / 1000))
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0'))
}

export function SpecialOffers() {
  const toast = useToast()
  const [copied, setCopied] = useState(null)
  const [h, m, s] = useCountdown(41)
  const deal = getPackage(flashDeals[0].slug)

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* clipboard may be unavailable */
    }
    setCopied(code)
    toast(`Code ${code} copied`)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <section className="container-x pt-20 md:pt-24">
      <SectionHeader eyebrow="Special offers" title="Deals worth" accent="packing for" action={<ButtonLink to="/offers" variant="outline" size="sm" arrow>All offers</ButtonLink>} />
      <div className="grid gap-4 lg:grid-cols-5">
        <Reveal className="relative overflow-hidden rounded-[14px] lg:col-span-3">
          <Img id={deal.image} alt={deal.title} className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 60vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="relative flex min-h-[340px] flex-col justify-between p-6 text-white md:p-8">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-danger px-3 py-1 text-[12px] font-semibold">
              <Timer className="size-3.5" /> Flash deal · {flashDeals[0].off}% off
            </span>
            <div>
              <h3 className="max-w-sm text-[22px] font-semibold leading-tight !text-white md:text-[26px]">{deal.title}</h3>
              <p className="mt-2 max-w-sm text-[14px] text-white/80">{deal.summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <div className="flex gap-1.5" aria-label="Offer ends in">
                  {[[h, 'hrs'], [m, 'min'], [s, 'sec']].map(([v, l]) => (
                    <span key={l} className="grid min-w-[54px] place-items-center rounded-xl bg-white/15 px-2 py-1.5 backdrop-blur-md">
                      <span className="text-[20px] font-bold tabular-nums leading-none">{v}</span>
                      <span className="mt-0.5 text-[10px] uppercase tracking-wider text-white/70">{l}</span>
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-[12px] text-white/60 line-through">{formatINR(deal.originalPrice)}</p>
                  <p className="text-[22px] font-bold leading-none">{formatINR(deal.price)}</p>
                </div>
                <ButtonLink to={`/packages/${deal.slug}`} variant="white" arrow>
                  Grab the deal
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
        <Stagger className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0 lg:col-span-2 lg:grid-cols-1 lg:divide-y">
          {offers.slice(0, 3).map((o) => (
            <StaggerItem key={o.code} className="flex items-center gap-4 py-4 first:pt-0 lg:first:pt-1">
              <img src={img(o.image, 200, 200)} alt="" loading="lazy" className="size-20 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] font-semibold uppercase tracking-wider text-gold-dark">{o.tag}</p>
                <p className="text-[14.5px] font-semibold leading-snug">{o.title}</p>
                <button type="button" onClick={() => copy(o.code)} className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gold/60 bg-gold-soft px-2 py-1 text-[12px] font-bold tracking-wider text-gold-dark">
                  {o.code} {copied === o.code ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

export function WhyUs() {
  const features = [
    { icon: Map, title: 'Local expertise', desc: 'Our hosts live where they guide, insider access you won’t find on a typical tour.' },
    { icon: CalendarCheck, title: 'All-in-one booking', desc: 'Stays, transfers, permits and experiences in one transparent price.' },
    { icon: Headphones, title: '24/7 trip host', desc: 'A real person on WhatsApp before, during and after your trip.' },
    { icon: ShieldCheck, title: 'Flexible & secure', desc: 'Free date changes up to 30 days out and fully protected payments.' },
  ]
  return (
    <section className="mt-20 bg-sand py-14 md:mt-24 md:py-20">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <span className="eyebrow">Why Wanderly</span>
            <TextReveal as="h2" className="h-section mt-4 block max-w-lg" parts={[{ text: 'Why thousands of travellers choose us for their' }, { text: 'Indian adventures', className: 'serif-accent text-gold' }]} />
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
              From pristine beaches to Himalayan monasteries, we make exploring India easier, safer and far more memorable, with expert-crafted itineraries and round-the-clock support.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-[28px] font-bold tracking-tight md:text-[32px]">
                    <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                  </p>
                  <p className="text-[12.5px] text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Stagger className="grid gap-x-8 sm:grid-cols-2">
            {features.map((f) => (
              <StaggerItem key={f.title} className="group border-t border-ink/15 py-6">
                <span className="grid size-11 place-items-center rounded-full bg-navy text-white transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{f.desc}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

// "What travellers say" reference: rating summary · photo quote · stacked reviews.
export function Testimonials() {
  return (
    <section className="container-x pt-20 md:pt-24">
      <SectionHeader eyebrow="Testimonials" title="What travellers say" accent="about us" desc="Every journey we organise is built on trust, safety and unforgettable views." />
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="flex flex-col justify-between lg:col-span-4 lg:pr-4">
          <div>
            <div className="flex items-end gap-3">
              <p className="text-[56px] font-bold leading-none tracking-tight">
                4.9<span className="text-[20px] text-muted">/5</span>
              </p>
              <p className="pb-1.5 text-[13px] leading-snug text-muted">
                Based on 2,800+
                <br /> verified reviews
              </p>
            </div>
            <ul className="mt-6 space-y-3 text-[14px] text-ink-2">
              <li className="flex items-center gap-2.5"><MapPin className="size-4 text-gold" /> 1,200+ guided trips delivered</li>
              <li className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-gold" /> 100% safe routes, certified local guides</li>
              <li className="flex items-center gap-2.5"><Award className="size-4 text-gold" /> 12 years of crafting journeys</li>
              <li className="flex items-center gap-2.5"><Route className="size-4 text-gold" /> 400+ handpicked boutique stays</li>
            </ul>
          </div>
          <div className="mt-8">
            <p className="text-[14px] font-semibold">Ready to plan your own journey?</p>
            <ButtonLink to="/planner" className="mt-3" arrow>
              Plan your trip
            </ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="relative min-h-[420px] overflow-hidden rounded-[var(--radius-card)] lg:col-span-4">
          <Img id="1496602910407-bacda74a0fe4" alt="Travellers watching the sunset" className="absolute inset-0" sizes="(max-width: 1024px) 100vw, 33vw" />
          <div className="img-shade absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <Stars value={5} />
            <p className="mt-2 text-[16px] font-medium leading-snug">“We expected mountains and silence, we found warmth, stars, and people who love what they do.”</p>
            <p className="mt-2 text-[12.5px] text-white/75">Arjun & Tara · Ladakh, Sep 2026</p>
          </div>
        </Reveal>
        <div className="no-scrollbar -mx-3 sm:-mx-4 flex snap-x gap-5 overflow-x-auto px-3 sm:px-4 lg:col-span-4 lg:mx-0 lg:max-h-[520px] lg:flex-col lg:overflow-y-auto lg:px-0" data-lenis-prevent>
          {reviews.map((r, k) => (
            <motion.figure
              key={r.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: k * 0.06 }}
              className="w-[82%] shrink-0 snap-start border-t border-line pt-4 sm:w-[46%] lg:w-auto lg:pb-2"
            >
              <Stars value={r.rating} />
              <blockquote className="mt-2 text-[14px] leading-relaxed text-ink-2">“{r.text}”</blockquote>
              <figcaption className="mt-3 flex items-center gap-2.5">
                <Avatar id={r.avatar} name={r.name} size={34} className="ring-0" />
                <span className="text-[13px]">
                  <b className="block font-semibold">{r.name}</b>
                  <span className="text-muted">{r.trip} · {r.date}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-muted">
        <Star className="size-4 fill-gold text-gold" /> Rated Excellent on Google, TripAdvisor & Trustpilot
      </div>
    </section>
  )
}

export function Steps() {
  const steps = [
    { icon: Compass, t: 'Pick your destination', d: 'Browse 120+ places or tell us your vibe and we’ll suggest the perfect fit.' },
    { icon: Route, t: 'Customise your tour', d: 'Tweak hotels, pace and experiences. Get a final quote in under 4 hours.' },
    { icon: Plane, t: 'Confirm & travel', d: 'Pay a 25% advance, receive vouchers and meet your trip host. That’s it.' },
  ]
  return (
    <section className="container-x pt-20 md:pt-24">
      <SectionHeader align="center" eyebrow="How it works" title="Booking made as easy as" accent="1-2-3" />
      <Stagger className="relative grid gap-4 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-[38px] hidden border-t border-dashed border-gold/50 md:block" />
        {steps.map((s, k) => (
          <StaggerItem key={s.t} className="relative flex flex-col items-center px-4 text-center">
            <span className="relative grid size-[76px] place-items-center rounded-full border border-line bg-white shadow-[var(--shadow-soft)]">
              <s.icon className="size-7 text-ink" strokeWidth={1.6} />
              <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-gold text-[12px] font-bold text-white">{k + 1}</span>
            </span>
            <h3 className="mt-5 text-[17px] font-semibold">{s.t}</h3>
            <p className="mt-1.5 max-w-xs text-[14px] leading-relaxed text-muted">{s.d}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export function HomeFaq() {
  return (
    <section className="container-x pt-20 md:pt-24">
      <div className="grid gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <span className="eyebrow">FAQs</span>
          <TextReveal as="h2" className="h-section mt-4 block" parts={[{ text: 'Questions,' }, { text: 'answered', className: 'serif-accent text-gold' }]} />
          <p className="mt-3 max-w-sm text-[14.5px] text-muted">Can’t find what you’re looking for? Our travel experts reply within minutes.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink to="/faq" variant="outline" size="sm">All FAQs</ButtonLink>
            <ButtonLink to="/contact" size="sm">Contact us</ButtonLink>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-8">
          <Accordion items={faqs.slice(0, 5)} />
        </Reveal>
      </div>
    </section>
  )
}

export function Journal() {
  return (
    <section className="container-x pt-20 md:pt-24">
      <SectionHeader eyebrow="Travel journal" title="Stories &" accent="field notes" action={<ButtonLink to="/blog" variant="outline" size="sm" arrow>Read the journal</ButtonLink>} />
      <Stagger className="grid gap-8 md:grid-cols-3 md:gap-5">
        {blogPosts.slice(0, 3).map((p) => (
          <StaggerItem key={p.slug}>
            <BlogCard post={p} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="pt-20 md:pt-24">
      <Reveal className="relative overflow-hidden">
        <Img id="1595815771614-ade9d652a65d" alt="" className="absolute inset-0" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/10" />
        <div className="container-x relative grid gap-6 py-20 text-white md:grid-cols-2 md:py-28">
          <div>
            <span className="eyebrow !border-white/20 !bg-white/10 !text-white">Ready when you are</span>
            <TextReveal as="h2" className="mt-4 block text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.1] !text-white" parts={[{ text: 'Your next story' }, { text: 'starts here.', className: 'serif-accent text-[#d3ebf9]' }]} />
            <p className="mt-3 max-w-md text-[15px] text-white/80">Tell us where your heart is set, we’ll craft a day-by-day plan with stays, transfers and experiences, free of cost.</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <ButtonLink to="/planner" variant="white" arrow>
                Plan my trip
              </ButtonLink>
              <Link to="/contact" className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold text-white hover:bg-white/10">
                Talk to an expert <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
