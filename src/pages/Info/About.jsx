import { Leaf, HeartHandshake, Compass, ShieldCheck, Award, Globe2 } from 'lucide-react'
import { PageTransition, Reveal, Stagger, StaggerItem } from '../../components/common/Reveal'
import { Img, Avatar } from '../../components/common/Img'
import { ButtonLink } from '../../components/common/Button'
import { Counter } from '../../components/common/Counter'
import { SectionHeader } from '../../components/common/SectionHeader'
import { team, stats } from '../../data/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const values = [
  { icon: Compass, t: 'Slow over rushed', d: 'Fewer stops, deeper experiences. We never cram an itinerary.' },
  { icon: HeartHandshake, t: 'Local first', d: '80% of our spend stays with local guides, drivers and homestays.' },
  { icon: Leaf, t: 'Lighter footprint', d: 'Plastic-free trips, offset flights and community-led tourism.' },
  { icon: ShieldCheck, t: 'Radically honest', d: 'Transparent pricing. No hidden fees, ever.' },
]
const milestones = [
  ['2014', 'Founded in Bengaluru with three Himalayan itineraries.'],
  ['2017', 'Crossed 5,000 travellers; launched Kerala & Rajasthan.'],
  ['2020', 'Built our 24/7 trip-host model and flexible bookings.'],
  ['2023', 'Opened international departures to Bali, Maldives & Europe.'],
  ['2026', '48,000+ travellers and 120+ destinations.'],
]

export default function About() {
  useDocumentTitle('About us')
  return (
    <PageTransition>
      <section className="container-x pt-8 md:pt-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h1 className="h-display mt-4">
              We’re travellers first, <span className="serif-accent text-gold">agents second.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[15.5px] leading-relaxed text-muted">
              Wanderly began in 2014 when three friends returned from Spiti convinced that India deserved better travel planning, trips that were thoughtful, unhurried and fair to the communities that host us. Twelve years on, we still personally scout every stay and walk every trail before it reaches you.
            </p>
          </Reveal>
        </div>
        <div className="mt-10 grid grid-cols-6 gap-2.5 md:gap-4">
          <Reveal className="col-span-6 md:col-span-3"><Img id="1653844573020-71f77a0ccb8c" alt="Key Monastery in Spiti" className="aspect-[4/3] rounded-[14px]" sizes="(max-width: 768px) 100vw, 50vw" /></Reveal>
          <Reveal delay={0.08} className="col-span-3 md:col-span-2"><Img id="1627894483216-2138af692e32" alt="Ganga aarti in Varanasi" className="aspect-[3/4] h-full rounded-[14px]" sizes="33vw" /></Reveal>
          <Reveal delay={0.16} className="col-span-3 md:col-span-1"><Img id="1629813538702-64c925934e19" alt="Tea gardens" className="aspect-[3/4] h-full rounded-[14px]" sizes="20vw" /></Reveal>
        </div>
      </section>

      <section className="container-x pt-16">
        <div className="grid grid-cols-2 gap-4 rounded-[16px] border border-line bg-white p-6 md:grid-cols-4 md:p-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[30px] font-bold tracking-tight md:text-[38px]"><Counter value={s.value} decimals={s.decimals} suffix={s.suffix} /></p>
              <p className="text-[13px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pt-16 md:pt-24">
        <SectionHeader title="What we" accent="believe in" />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <StaggerItem key={v.t} className="card p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-gold-soft text-gold-dark"><v.icon className="size-5" /></span>
              <h3 className="mt-4 text-[16px] font-semibold">{v.t}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{v.d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x pt-16 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow">Our journey</span>
            <h2 className="h-section mt-4">Twelve years, <span className="serif-accent text-gold">one obsession</span></h2>
            <p className="mt-3 text-[14.5px] text-muted">Building the kind of travel company we always wished existed.</p>
          </Reveal>
          <ol className="relative border-l border-line pl-6 lg:col-span-8">
            {milestones.map(([y, t], i) => (
              <Reveal as="li" key={y} delay={i * 0.06} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[31px] top-1 size-3 rounded-full border-2 border-paper bg-gold ring-1 ring-gold" />
                <p className="text-[13px] font-bold text-gold-dark">{y}</p>
                <p className="mt-1 text-[16px] font-medium">{t}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x pt-16 md:pt-24">
        <SectionHeader title="The people behind" accent="your trips" desc="A small team of obsessive travellers, storytellers and problem-solvers." />
        <Stagger className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {team.map((m) => (
            <StaggerItem key={m.name} className="card p-4 text-center md:p-5">
              <Avatar id={m.avatar} name={m.name} size={88} className="mx-auto ring-4 ring-sand" />
              <h3 className="mt-3 text-[15.5px] font-semibold">{m.name}</h3>
              <p className="text-[12.5px] font-medium text-gold-dark">{m.role}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{m.bio}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x pt-16 md:pt-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [Award, 'IATA accredited', 'Licensed & bonded tour operator'],
            [ShieldCheck, 'Ministry of Tourism', 'Approved domestic tour operator'],
            [Globe2, 'Responsible Travel', 'Certified sustainable partner 2026'],
          ].map(([Icon, t, d]) => (
            <div key={t} className="flex items-center gap-4 rounded-xl bg-sand p-5">
              <Icon className="size-8 shrink-0 text-gold-dark" strokeWidth={1.5} />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-[13px] text-muted">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          <ButtonLink to="/packages" arrow>Travel with us</ButtonLink>
          <ButtonLink to="/contact" variant="outline">Get in touch</ButtonLink>
        </div>
      </section>
    </PageTransition>
  )
}
