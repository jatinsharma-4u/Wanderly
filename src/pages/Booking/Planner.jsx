import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Sparkles, Mountain, Waves, Landmark, Utensils, Camera, Heart, Gem, Trees, Tent, RefreshCw } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition, Reveal } from '../../components/common/Reveal'
import { Button, ButtonLink } from '../../components/common/Button'
import { Field } from '../../components/forms/Field'
import { Stepper } from '../../components/booking/TravellerStepper'
import { Lottie } from '../../components/common/Lottie'
import { PackageCard } from '../../components/cards/PackageCard'
import { destinations } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, toISODate, addDays, sleep, img, cn } from '../../utils/format'
import success from '../../assets/lottie/success.json'

const interests = [
  { v: 'Mountains', icon: Mountain },
  { v: 'Beaches', icon: Waves },
  { v: 'Heritage', icon: Landmark },
  { v: 'Food trails', icon: Utensils },
  { v: 'Photography', icon: Camera },
  { v: 'Romance', icon: Heart },
  { v: 'Luxury', icon: Gem },
  { v: 'Wildlife & nature', icon: Trees },
  { v: 'Adventure', icon: Tent },
]
const stays = ['Boutique hotels', 'Luxury resorts', 'Heritage palaces', 'Homestays', 'Mix of everything']
const paces = [
  { v: 'relaxed', t: 'Relaxed', d: '1 activity a day' },
  { v: 'balanced', t: 'Balanced', d: 'Mix of both' },
  { v: 'packed', t: 'Action-packed', d: 'See it all' },
]

const today = new Date()
const schema = z
  .object({
    destinations: z.array(z.string()).min(1, 'Pick at least one destination'),
    start: z.string().min(1, 'Choose a start date'),
    end: z.string().min(1, 'Choose an end date'),
    budget: z.number(),
    interests: z.array(z.string()).min(1, 'Pick at least one interest'),
    stay: z.string(),
    pace: z.string(),
    name: z.string().trim().min(2, 'Enter your name'),
    email: z.string().trim().email('Enter a valid email'),
    phone: z.string().trim().regex(/^[+\d\s-]{10,16}$/, 'Enter a valid mobile number'),
    notes: z.string().optional(),
  })
  .refine((v) => v.end > v.start, { path: ['end'], message: 'End date must be after the start date' })

export default function Planner() {
  useDocumentTitle('Custom trip planner')
  const [params] = useSearchParams()
  const { user, addEnquiry, catalog } = useApp()
  const toast = useToast()
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [result, setResult] = useState(null)
  const [q, setQ] = useState('')

  const { register, control, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      destinations: params.get('destination') ? [params.get('destination')] : [],
      start: toISODate(addDays(today, 30)),
      end: toISODate(addDays(today, 36)),
      budget: 40000,
      interests: [],
      stay: 'Boutique hotels',
      pace: 'balanced',
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      notes: '',
    },
  })

  const picked = watch('destinations')
  const budget = watch('budget')
  const start = watch('start')
  const end = watch('end')
  const nights = Math.max(0, Math.round((new Date(end) - new Date(start)) / 864e5))

  const destList = useMemo(() => {
    const s = q.trim().toLowerCase()
    return destinations.filter((d) => !s || d.name.toLowerCase().includes(s) || d.location.toLowerCase().includes(s))
  }, [q])

  const onSubmit = async (data) => {
    await sleep(1400)
    addEnquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Custom trip: ${data.destinations.map((s) => destinations.find((d) => d.slug === s)?.name).join(', ')}`,
      message: `${nights} nights from ${data.start}, ${adults} adults ${children} children, budget ${formatINR(data.budget)}/person. Interests: ${data.interests.join(', ')}. Stay: ${data.stay}. Pace: ${data.pace}. ${data.notes || ''}`,
      type: 'Custom trip',
    })
    const matches = catalog.filter((p) => p.active && data.destinations.includes(p.destination))
    const estimate = Math.round((data.budget * (adults + children * 0.6)) / 1000) * 1000
    setResult({ ...data, matches, estimate })
    toast('Trip brief received. Expect your plan within 4 hours.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    return (
      <PageTransition>
        <section className="container-x max-w-4xl pt-10 text-center md:pt-14">
          <Lottie data={success} loop={false} className="mx-auto size-32" />
          <h1 className="text-[clamp(1.7rem,4vw,2.5rem)]">
            Thanks {result.name.split(' ')[0]}, your <span className="serif-accent text-gold">trip brief</span> is in!
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-[15px] text-muted">
            A travel designer will send a personalised day-by-day plan to <b className="text-ink">{result.email}</b> within 4 working hours.
          </p>
          <div className="card mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-4 p-5 text-left sm:grid-cols-4">
            <div><p className="text-[12px] text-muted">Destinations</p><p className="text-[14px] font-semibold">{result.destinations.length}</p></div>
            <div><p className="text-[12px] text-muted">Duration</p><p className="text-[14px] font-semibold">{nights} nights</p></div>
            <div><p className="text-[12px] text-muted">Travellers</p><p className="text-[14px] font-semibold">{adults + children}</p></div>
            <div><p className="text-[12px] text-muted">Est. total</p><p className="text-[14px] font-semibold">{formatINR(result.estimate)}</p></div>
          </div>
        </section>
        {result.matches.length > 0 && (
          <section className="container-x pt-14">
            <h2 className="mb-5 text-[20px]">Meanwhile, these ready itineraries match your picks</h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {result.matches.slice(0, 3).map((p) => (
                <PackageCard key={p.slug} p={p} />
              ))}
            </div>
          </section>
        )}
        <div className="mt-10 flex justify-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null)
              reset()
            }}
          >
            <RefreshCw className="size-4" /> Plan another trip
          </Button>
          <ButtonLink to="/packages" arrow>Browse packages</ButtonLink>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <PageHeader
        image="1653844573020-71f77a0ccb8c"
        title="Design your"
        accent="dream trip"
        desc="Tell us what you love. Our travel designers craft a private, day-by-day itinerary, free, with no obligation."
        crumbs={[{ label: 'Trip planner' }]}
      />

      <form onSubmit={handleSubmit(onSubmit, () => toast('Please complete the highlighted sections', 'error'))} noValidate className="container-x mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-5 lg:col-span-8">
          {/* 1. Destinations */}
          <Reveal className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-sans text-[17px]"><span className="mr-2 text-gold">01</span>Where to?</h2>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter places…" className="input h-9 w-full sm:w-52" aria-label="Filter destinations" />
            </div>
            <Controller
              control={control}
              name="destinations"
              render={({ field }) => (
                <div className="no-scrollbar mt-4 grid max-h-[340px] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5" data-lenis-prevent>
                  {destList.map((d) => {
                    const on = field.value.includes(d.slug)
                    return (
                      <button
                        type="button"
                        key={d.slug}
                        onClick={() => field.onChange(on ? field.value.filter((x) => x !== d.slug) : [...field.value, d.slug])}
                        className={cn('group relative aspect-square overflow-hidden rounded-xl text-left transition', on ? 'ring-2 ring-ink ring-offset-2' : '')}
                        aria-pressed={on}
                      >
                        <img src={img(d.image, 240, 240)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition group-hover:scale-105" />
                        <span className="img-shade absolute inset-0" />
                        <span className="absolute bottom-1.5 left-2 right-2 truncate text-[12px] font-semibold text-white">{d.name}</span>
                        {on && (
                          <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-white text-ink">
                            <Check className="size-3" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.destinations && <p className="mt-2 text-[12.5px] font-medium text-danger" role="alert">{errors.destinations.message}</p>}
          </Reveal>

          {/* 2. When & who */}
          <Reveal className="card p-5">
            <h2 className="font-sans text-[17px]"><span className="mr-2 text-gold">02</span>When & who</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Start date" error={errors.start}>
                <input type="date" className="input" min={toISODate(today)} {...register('start')} />
              </Field>
              <Field label="End date" error={errors.end} hint={nights > 0 ? `${nights} nights` : undefined}>
                <input type="date" className="input" min={start} {...register('end')} aria-invalid={!!errors.end} />
              </Field>
            </div>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <Stepper label="Adults" value={adults} onChange={setAdults} min={1} />
              <Stepper label="Children" value={children} onChange={setChildren} />
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="budget" className="text-[13px] font-medium text-ink-2">Budget per person</label>
                <span className="text-[15px] font-bold">{budget >= 200000 ? '₹2,00,000+' : formatINR(budget)}</span>
              </div>
              <Controller
                control={control}
                name="budget"
                render={({ field }) => <input id="budget" type="range" min={10000} max={200000} step={5000} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} className="w-full accent-[var(--color-ink)]" />}
              />
            </div>
          </Reveal>

          {/* 3. Preferences */}
          <Reveal className="card p-5">
            <h2 className="font-sans text-[17px]"><span className="mr-2 text-gold">03</span>What do you love?</h2>
            <Controller
              control={control}
              name="interests"
              render={({ field }) => (
                <div className="mt-4 flex flex-wrap gap-2">
                  {interests.map(({ v, icon: Icon }) => {
                    const on = field.value.includes(v)
                    return (
                      <button type="button" key={v} className="chip" data-active={on} aria-pressed={on} onClick={() => field.onChange(on ? field.value.filter((x) => x !== v) : [...field.value, v])}>
                        <Icon className="size-4" /> {v}
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.interests && <p className="mt-2 text-[12.5px] font-medium text-danger" role="alert">{errors.interests.message}</p>}

            <p className="mb-2 mt-6 text-[13px] font-medium text-ink-2">Preferred stays</p>
            <div className="flex flex-wrap gap-2">
              {stays.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input type="radio" value={s} {...register('stay')} className="peer sr-only" />
                  <span className="chip peer-checked:border-ink peer-checked:bg-ink peer-checked:text-white">{s}</span>
                </label>
              ))}
            </div>

            <p className="mb-2 mt-6 text-[13px] font-medium text-ink-2">Pace</p>
            <div className="grid grid-cols-3 gap-2">
              {paces.map((s) => (
                <label key={s.v} className="cursor-pointer">
                  <input type="radio" value={s.v} {...register('pace')} className="peer sr-only" />
                  <span className="block rounded-xl border border-line p-3 text-center transition peer-checked:border-ink peer-checked:bg-paper peer-checked:ring-1 peer-checked:ring-ink">
                    <span className="block text-[13.5px] font-semibold">{s.t}</span>
                    <span className="block text-[11.5px] text-muted">{s.d}</span>
                  </span>
                </label>
              ))}
            </div>
          </Reveal>

          {/* 4. Contact */}
          <Reveal className="card p-5">
            <h2 className="font-sans text-[17px]"><span className="mr-2 text-gold">04</span>Where should we send your plan?</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input className="input" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <input className="input" type="tel" autoComplete="tel" {...register('phone')} aria-invalid={!!errors.phone} />
              </Field>
              <Field label="Email" error={errors.email} className="sm:col-span-2">
                <input className="input" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} />
              </Field>
              <Field label="Anything else?" optional className="sm:col-span-2">
                <textarea rows={3} className="input h-auto py-3" placeholder="Celebrations, mobility needs, must-see places…" {...register('notes')} />
              </Field>
            </div>
          </Reveal>
        </div>

        <aside className="lg:col-span-4">
          <div className="card sticky top-24 p-5">
            <p className="flex items-center gap-2 text-[15px] font-semibold"><Sparkles className="size-4 text-gold" /> Your trip so far</p>
            <div className="mt-4 flex min-h-[44px] flex-wrap gap-1.5">
              <AnimatePresence>
                {picked.length ? (
                  picked.map((s) => (
                    <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="rounded-full bg-sand px-2.5 py-1 text-[12.5px] font-semibold">
                      {destinations.find((d) => d.slug === s)?.name}
                    </motion.span>
                  ))
                ) : (
                  <p className="text-[13px] text-faint">No destinations picked yet</p>
                )}
              </AnimatePresence>
            </div>
            <dl className="mt-4 space-y-2 border-t border-line-2 pt-4 text-[13.5px]">
              <div className="flex justify-between"><dt className="text-muted">Duration</dt><dd className="font-semibold">{nights} nights</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Travellers</dt><dd className="font-semibold">{adults} adults{children ? `, ${children} kids` : ''}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Est. total budget</dt><dd className="font-semibold">{formatINR(budget * (adults + children * 0.6))}</dd></div>
            </dl>
            <Button type="submit" className="mt-5 w-full" size="lg" loading={isSubmitting}>
              {isSubmitting ? 'Sending your brief…' : 'Get my free plan'}
            </Button>
            <p className="mt-3 text-center text-[12px] text-muted">No payment needed · Reply within 4 hours</p>
          </div>
        </aside>
      </form>
    </PageTransition>
  )
}
