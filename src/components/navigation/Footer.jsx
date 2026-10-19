import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, ArrowRight, ArrowUp, ArrowUpRight, ShieldCheck, Award, Headphones, Check } from 'lucide-react'
import { Logo } from './Logo'
import { InstagramIcon, YoutubeIcon, FacebookIcon, XIcon, WhatsAppIcon } from '../common/SocialIcons'
import { useToast } from '../../context/ToastContext'
import { scrollToTop } from '../../hooks/useSmoothScroll'
import { brand } from '../../config/brand'

const cols = [
  {
    title: 'India',
    links: [
      ['/destinations/ladakh', 'Ladakh'],
      ['/destinations/kerala', 'Kerala'],
      ['/destinations/udaipur', 'Udaipur'],
      ['/destinations/kashmir', 'Kashmir'],
      ['/destinations/andaman', 'Andaman Islands'],
      ['/destinations/spiti', 'Spiti Valley'],
    ],
  },
  {
    title: 'International',
    links: [
      ['/destinations/maldives', 'Maldives'],
      ['/destinations/bali', 'Bali'],
      ['/destinations/switzerland', 'Switzerland'],
      ['/destinations/dubai', 'Dubai'],
      ['/destinations/santorini', 'Santorini'],
      ['/destinations/thailand', 'Thailand'],
    ],
  },
  {
    title: 'Journeys',
    links: [
      ['/packages?category=Honeymoon', 'Honeymoons'],
      ['/packages?category=Luxury', 'Luxury escapes'],
      ['/packages?category=Adventure', 'Adventure trips'],
      ['/packages?category=Family', 'Family holidays'],
      ['/offers', 'Offers & deals'],
      ['/planner', 'Tailor-made trips'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['/about', 'Our story'],
      ['/blog', 'Travel journal'],
      ['/contact', 'Contact'],
      ['/faq', 'FAQs'],
      ['/track', 'Track a booking'],
      ['/dashboard', 'My account'],
    ],
  },
]

const socials = [
  [InstagramIcon, 'Instagram'],
  [YoutubeIcon, 'YouTube'],
  [FacebookIcon, 'Facebook'],
  [XIcon, 'X'],
  [WhatsAppIcon, 'WhatsApp'],
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const toast = useToast()

  const subscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast('Please enter a valid email', 'error')
    setDone(true)
    toast('You’re subscribed. Welcome aboard!')
    setEmail('')
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <footer className="relative mt-20 overflow-hidden md:mt-24">
      {/* Newsletter band */}
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#d3ebf9_0%,#eaf5fc_45%,#ffffff_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-gold/15 blur-3xl" />
        <div className="container-x relative grid gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:py-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-dark">The {brand.name} letter</p>
            <h2 className="mt-3 max-w-lg text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-[1.2] text-navy">
              Quiet places, seasonal journeys and members-only fares, <span className="serif-accent text-gold">once a month.</span>
            </h2>
          </div>
          <div>
            <form onSubmit={subscribe} className="flex items-center gap-2 rounded-[14px] bg-white p-1.5 shadow-[0_20px_40px_-24px_rgb(18_49_63/0.45)] ring-1 ring-white focus-within:ring-gold/50">
              <Mail className="ml-3 size-4 shrink-0 text-gold" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" aria-label="Email address" className="h-11 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint" />
              <button type="submit" className="relative flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-[10px] bg-gradient-to-b from-[#24566f] to-navy px-5 text-[13.5px] font-medium text-white transition hover:from-[#2b6481]">
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.span key="d" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-1.5"><Check className="size-4" /> Subscribed</motion.span>
                  ) : (
                    <motion.span key="s" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-1.5">Subscribe <ArrowRight className="size-4" /></motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
            <p className="mt-2.5 text-[12px] text-muted">No spam. Unsubscribe anytime. Read our <Link to="/privacy" className="underline underline-offset-2 hover:text-navy">privacy policy</Link>.</p>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <section className="bg-gradient-to-b from-white to-paper">
        <div className="container-x pt-14 md:pt-16">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_2.6fr] lg:gap-16">
            <div>
              <Logo size="lg" />
              <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-muted">{brand.description}</p>
              <ul className="mt-6 space-y-3 text-[13.5px] text-ink-2">
                <li><a href={brand.phoneHref} className="group inline-flex items-center gap-3 transition-colors hover:text-navy"><span className="grid size-8 place-items-center rounded-[8px] bg-sand text-gold-dark transition group-hover:bg-navy group-hover:text-white"><Phone className="size-3.5" /></span> {brand.phone}</a></li>
                <li><a href={`mailto:${brand.email}`} className="group inline-flex items-center gap-3 transition-colors hover:text-navy"><span className="grid size-8 place-items-center rounded-[8px] bg-sand text-gold-dark transition group-hover:bg-navy group-hover:text-white"><Mail className="size-3.5" /></span> {brand.email}</a></li>
                <li className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-sand text-gold-dark"><MapPin className="size-3.5" /></span> <span className="pt-1.5">{brand.address}</span></li>
              </ul>
              <div className="mt-6 flex gap-2">
                {socials.map(([Icon, label]) => (
                  <a key={label} href="#" onClick={(e) => e.preventDefault()} aria-label={label} className="grid size-9 place-items-center rounded-[9px] text-ink-2 ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-navy hover:text-white hover:ring-navy">
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {cols.map((c) => (
                <div key={c.title}>
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-gold-dark">{c.title}</p>
                  <ul className="space-y-2.5">
                    {c.links.map(([to, label]) => (
                      <li key={to}>
                        <Link to={to} className="group inline-flex items-center gap-1 text-[13.5px] text-ink-2 transition-colors hover:text-navy">
                          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">{label}</span>
                          <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-14 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
            {[
              [ShieldCheck, 'Secure, flexible bookings', 'Free changes up to 30 days'],
              [Headphones, 'A trip host, 24/7', 'On WhatsApp throughout your journey'],
              [Award, 'IATA & MoT approved', 'Trusted by 48,000+ travellers'],
            ].map(([Icon, t, d]) => (
              <div key={t} className="flex items-center gap-3">
                <Icon className="size-5 shrink-0 text-gold" strokeWidth={1.6} />
                <div>
                  <p className="text-[13px] font-medium text-navy">{t}</p>
                  <p className="text-[12px] text-muted">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oversized wordmark */}
        <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
          <p
            className="container-x whitespace-nowrap bg-gradient-to-b from-navy/[0.12] to-transparent bg-clip-text pt-6 text-center text-[clamp(3.2rem,15vw,13rem)] font-medium uppercase leading-[0.9] text-transparent"
            style={{ letterSpacing: '0.12em', marginRight: '-0.12em' }}
          >
            {brand.name}
          </p>
        </div>

        <div className="border-t border-line">
          <div className="container-x flex flex-col gap-4 py-5 text-[12px] text-muted md:flex-row md:items-center md:justify-between">
            <p>© 2026 {brand.legalName}. All rights reserved. · Demo website, bookings & payments are simulated.</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link to="/privacy" className="hover:text-navy">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-navy">Terms & Conditions</Link>
              <Link to="/cancellation-policy" className="hover:text-navy">Cancellation Policy</Link>
              <button type="button" onClick={() => scrollToTop(false)} className="ml-auto grid size-9 place-items-center rounded-[9px] bg-white text-navy ring-1 ring-line transition hover:-translate-y-0.5 hover:bg-navy hover:text-white md:ml-0" aria-label="Back to top">
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}
