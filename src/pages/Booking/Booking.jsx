import { useMemo, useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, CalendarDays, Users, Tag, ShieldCheck, Smartphone, CreditCard, Landmark, Plane, Umbrella, BedDouble, Lock, X } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Img } from '../../components/common/Img'
import { Field } from '../../components/forms/Field'
import { Lottie } from '../../components/common/Lottie'
import { Stepper, priceFor } from '../../components/booking/TravellerStepper'
import { PageTransition } from '../../components/common/Reveal'
import { getDestination } from '../../data/destinations'
import { applyCoupon } from '../../data/content'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate, addDays, sleep, cn } from '../../utils/format'
import dots from '../../assets/lottie/dots.json'
import NotFound from '../Info/NotFound'

const schema = z.object({
  name: z.string().trim().min(2, 'Enter the lead traveller’s full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().regex(/^[+\d\s-]{10,16}$/, 'Enter a valid 10-digit mobile number'),
  city: z.string().trim().min(2, 'Enter your city'),
  travellers: z.array(z.object({ name: z.string().trim().min(2, 'Enter name'), age: z.coerce.number().min(1, 'Age?').max(99, 'Age?') })),
  room: z.enum(['standard', 'deluxe', 'suite']),
  requests: z.string().optional(),
  insurance: z.boolean(),
  pickup: z.boolean(),
  payment: z.enum(['upi', 'card', 'netbanking']),
  plan: z.enum(['advance', 'full']),
  agree: z.literal(true, { message: 'Please accept the terms to continue' }),
})

const rooms = [
  { value: 'standard', label: 'Standard', desc: 'As per itinerary', add: 0 },
  { value: 'deluxe', label: 'Deluxe upgrade', desc: 'Better views & space', add: 2500 },
  { value: 'suite', label: 'Suite upgrade', desc: 'Best room in each stay', add: 6500 },
]
const steps = ['Travellers', 'Preferences', 'Review & pay']

export default function Booking() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { catalog, user, createBooking } = useApp()
  const toast = useToast()
  const p = catalog.find((x) => x.slug === slug)
  useDocumentTitle(p ? `Book · ${p.title}` : 'Booking')

  const [step, setStep] = useState(0)
  const [adults, setAdults] = useState(Math.max(1, Number(params.get('adults')) || 2))
  const [children, setChildren] = useState(Number(params.get('children')) || 0)
  const [couponInput, setCouponInput] = useState('')
  const [coupon, setCoupon] = useState(null)
  const [couponMsg, setCouponMsg] = useState(null)
  const [processing, setProcessing] = useState(false)
  const date = params.get('date') || new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)

  const { register, control, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      travellers: Array.from({ length: adults + children - 1 }, () => ({ name: '', age: '' })),
      room: 'standard',
      requests: '',
      insurance: false,
      pickup: true,
      payment: 'upi',
      plan: 'advance',
      agree: false,
    },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'travellers' })

  // Keep the co-traveller rows in sync with the stepper counts.
  const syncTravellers = (a, c) => {
    const need = a + c - 1
    if (fields.length < need) for (let i = fields.length; i < need; i++) append({ name: '', age: '' }, { shouldFocus: false })
    else for (let i = fields.length - 1; i >= need; i--) remove(i)
  }

  const room = watch('room')
  const insurance = watch('insurance')
  const pickup = watch('pickup')
  const plan = watch('plan')
  const payment = watch('payment')

  const totals = useMemo(() => {
    if (!p) return null
    const pax = adults + children
    const { base, taxes } = priceFor(p.price, adults, children)
    const roomAdd = (rooms.find((r) => r.value === room)?.add || 0) * (p.days - 1)
    const insAdd = insurance ? 399 * pax : 0
    const pickAdd = pickup ? 1200 : 0
    const subtotal = base + taxes + roomAdd + insAdd + pickAdd
    const discount = coupon ? applyCoupon(coupon, base, p.category).discount : 0
    const total = subtotal - discount
    return { base, taxes, roomAdd, insAdd, pickAdd, discount, total, due: plan === 'advance' ? Math.round(total * 0.25) : total }
  }, [p, adults, children, room, insurance, pickup, coupon, plan])

  if (!p) return <NotFound />
  const d = getDestination(p.destination)
  const end = addDays(date, p.days - 1)

  const doApply = () => {
    const res = applyCoupon(couponInput, totals.base, p.category)
    setCouponMsg(res)
    if (res.ok) {
      setCoupon(couponInput.trim().toUpperCase())
      toast(res.message)
    }
  }

  const next = async () => {
    const fieldsByStep = [['name', 'email', 'phone', 'city', 'travellers'], ['room'], []]
    const ok = await trigger(fieldsByStep[step])
    if (!ok) {
      toast('Please fix the highlighted fields', 'error')
      return
    }
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data) => {
    setProcessing(true)
    await sleep(1800)
    const booking = createBooking({
      customer: data.name,
      email: data.email,
      phone: data.phone,
      packageSlug: p.slug,
      startDate: date,
      travelers: { adults, children },
      amount: totals.total,
      paid: totals.due,
      coupon,
      discount: totals.discount,
      room: data.room,
      addons: { insurance: data.insurance, pickup: data.pickup },
      paymentMethod: data.payment,
      coTravellers: data.travellers,
      requests: data.requests,
      status: 'confirmed',
      stage: 1,
    })
    navigate(`/booking/confirmation/${booking.id}`, { replace: true })
  }

  const onInvalid = () => toast('Please accept the terms and check your details', 'error')

  return (
    <PageTransition>
      <section className="container-x pt-5 md:pt-8">
        <Link to={`/packages/${p.slug}`} className="inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-ink">
          <ChevronLeft className="size-4" /> Back to package
        </Link>
        <h1 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)]">Complete your booking</h1>

        {/* Progress */}
        <ol className="mt-5 flex items-center gap-2" aria-label="Booking steps">
          {steps.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span className={cn('grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-bold transition', i < step ? 'bg-success text-white' : i === step ? 'bg-ink text-white' : 'border border-line bg-white text-faint')}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn('hidden text-[13px] font-semibold sm:block', i <= step ? 'text-ink' : 'text-faint')}>{s}</span>
              {i < steps.length - 1 && <span className={cn('h-px flex-1', i < step ? 'bg-success' : 'bg-line')} />}
            </li>
          ))}
        </ol>
      </section>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="container-x mt-6 grid gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="card p-5">
                  <h2 className="font-sans text-[17px]">Who’s travelling?</h2>
                  <div className="mt-2 divide-y divide-line-2">
                    <Stepper label="Adults" hint="12+ years" value={adults} min={1} onChange={(v) => { setAdults(v); syncTravellers(v, children) }} />
                    <Stepper label="Children" hint="5–11 years · 60% fare" value={children} onChange={(v) => { setChildren(v); syncTravellers(adults, v) }} />
                  </div>
                </div>
                <div className="card p-5">
                  <h2 className="font-sans text-[17px]">Lead traveller</h2>
                  <p className="text-[13px] text-muted">We’ll send vouchers and updates to these details.</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name (as on ID)" error={errors.name}>
                      <input className="input" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} />
                    </Field>
                    <Field label="Email" error={errors.email}>
                      <input className="input" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} />
                    </Field>
                    <Field label="Mobile number" error={errors.phone}>
                      <input className="input" type="tel" autoComplete="tel" placeholder="+91 98XXX XXXXX" {...register('phone')} aria-invalid={!!errors.phone} />
                    </Field>
                    <Field label="City" error={errors.city}>
                      <input className="input" autoComplete="address-level2" {...register('city')} aria-invalid={!!errors.city} />
                    </Field>
                  </div>
                </div>
                {fields.length > 0 && (
                  <div className="card p-5">
                    <h2 className="font-sans text-[17px]">Co-travellers</h2>
                    <div className="mt-4 space-y-3">
                      {fields.map((f, i) => (
                        <div key={f.id} className="grid grid-cols-[1fr_88px] gap-3">
                          <Field label={`Traveller ${i + 2} name`} error={errors.travellers?.[i]?.name}>
                            <input className="input" {...register(`travellers.${i}.name`)} aria-invalid={!!errors.travellers?.[i]?.name} />
                          </Field>
                          <Field label="Age" error={errors.travellers?.[i]?.age}>
                            <input className="input" inputMode="numeric" {...register(`travellers.${i}.age`)} aria-invalid={!!errors.travellers?.[i]?.age} />
                          </Field>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="card p-5">
                  <h2 className="font-sans flex items-center gap-2 text-[17px]"><BedDouble className="size-5 text-gold" /> Room preference</h2>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                    {rooms.map((r) => (
                      <label key={r.value} className={cn('cursor-pointer rounded-xl border p-3.5 transition', room === r.value ? 'border-ink bg-paper ring-1 ring-ink' : 'border-line hover:border-ink/30')}>
                        <input type="radio" value={r.value} {...register('room')} className="sr-only" />
                        <span className="block text-[14px] font-semibold">{r.label}</span>
                        <span className="block text-[12.5px] text-muted">{r.desc}</span>
                        <span className="mt-2 block text-[13px] font-semibold text-gold-dark">{r.add ? `+${formatINR(r.add)}/night` : 'Included'}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <h2 className="font-sans text-[17px]">Add-ons</h2>
                  <div className="mt-3 divide-y divide-line-2">
                    {[
                      { k: 'pickup', icon: Plane, t: 'Airport pickup & drop', d: 'Private transfer on arrival and departure', price: '₹1,200' },
                      { k: 'insurance', icon: Umbrella, t: 'Travel insurance', d: 'Medical, cancellation & baggage cover', price: '₹399 / person' },
                    ].map((a) => (
                      <label key={a.k} className="flex cursor-pointer items-center gap-3 py-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sand"><a.icon className="size-[18px]" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-semibold">{a.t}</span>
                          <span className="block text-[12.5px] text-muted">{a.d} · {a.price}</span>
                        </span>
                        <span className="relative">
                          <input type="checkbox" {...register(a.k)} className="peer sr-only" />
                          <span className="block h-6 w-11 rounded-full bg-line transition peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-gold" />
                          <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <Field label="Special requests" optional hint="Dietary needs, celebrations, accessibility, we’ll do our best.">
                    <textarea rows={3} className="input h-auto py-3" placeholder="e.g. It’s our anniversary on day 3!" {...register('requests')} />
                  </Field>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="card p-5">
                  <h2 className="font-sans text-[17px]">Payment plan</h2>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {[
                      { v: 'advance', t: 'Pay 25% now', d: `${formatINR(Math.round(totals.total * 0.25))} today, rest 21 days before travel` },
                      { v: 'full', t: 'Pay in full', d: `${formatINR(totals.total)} today, nothing more to pay` },
                    ].map((o) => (
                      <label key={o.v} className={cn('cursor-pointer rounded-xl border p-3.5 transition', plan === o.v ? 'border-ink bg-paper ring-1 ring-ink' : 'border-line hover:border-ink/30')}>
                        <input type="radio" value={o.v} {...register('plan')} className="sr-only" />
                        <span className="block text-[14px] font-semibold">{o.t}</span>
                        <span className="block text-[12.5px] text-muted">{o.d}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <h2 className="font-sans text-[17px]">Payment method</h2>
                  <p className="text-[13px] text-muted">Demo only, no real payment is taken.</p>
                  <div className="mt-4 grid grid-cols-3 gap-2.5">
                    {[
                      { v: 'upi', t: 'UPI', icon: Smartphone },
                      { v: 'card', t: 'Card', icon: CreditCard },
                      { v: 'netbanking', t: 'Net banking', icon: Landmark },
                    ].map((m) => (
                      <label key={m.v} className={cn('flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3.5 text-center transition', payment === m.v ? 'border-ink bg-paper ring-1 ring-ink' : 'border-line hover:border-ink/30')}>
                        <input type="radio" value={m.v} {...register('payment')} className="sr-only" />
                        <m.icon className="size-5" />
                        <span className="text-[13px] font-semibold">{m.t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="card p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" {...register('agree')} className="mt-0.5 size-[18px] accent-[var(--color-ink)]" />
                    <span className="text-[13.5px] text-ink-2">
                      I agree to the <Link to="/terms" className="font-semibold underline" target="_blank">terms & conditions</Link> and <Link to="/cancellation-policy" className="font-semibold underline" target="_blank">cancellation policy</Link>.
                    </span>
                  </label>
                  {errors.agree && <p className="mt-2 text-[12.5px] font-medium text-danger" role="alert">{errors.agree.message}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-5 flex items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="size-4" /> Back
              </Button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <Button onClick={next} arrow>
                Continue
              </Button>
            ) : (
              <Button type="submit" variant="gold" size="lg" loading={processing}>
                <Lock className="size-4" /> Pay {formatINR(totals.due)}
              </Button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="card no-scrollbar sticky top-24 overflow-hidden lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto" data-lenis-prevent>
            <div className="flex gap-3 border-b border-line-2 p-4">
              <Img id={p.image} alt="" className="size-20 shrink-0 rounded-xl" sizes="80px" w={200} widths={[200]} />
              <div className="min-w-0">
                <p className="text-[12px] text-muted">{d?.location}</p>
                <p className="text-[15px] font-semibold leading-snug">{p.title}</p>
                <p className="mt-1 text-[12.5px] text-muted">{p.days}D / {p.days - 1}N · {p.category}</p>
              </div>
            </div>
            <div className="space-y-2 border-b border-line-2 p-4 text-[13.5px]">
              <p className="flex items-center gap-2"><CalendarDays className="size-4 text-gold" /> {formatDate(date)} – {formatDate(end)}</p>
              <p className="flex items-center gap-2"><Users className="size-4 text-gold" /> {adults} adult{adults > 1 && 's'}{children ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}</p>
            </div>
            <div className="border-b border-line-2 p-4">
              <label htmlFor="coupon" className="label flex items-center gap-1.5"><Tag className="size-3.5" /> Coupon code</label>
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border border-dashed border-success/50 bg-success-soft px-3 py-2.5 text-[13px]">
                  <span className="font-bold tracking-wider text-success">{coupon}</span>
                  <button type="button" onClick={() => { setCoupon(null); setCouponMsg(null); setCouponInput('') }} className="flex items-center gap-1 text-[12.5px] font-semibold text-muted hover:text-ink">
                    <X className="size-3.5" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input id="coupon" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), doApply())} placeholder="WANDER10" className="input h-10 uppercase" />
                  <Button size="sm" variant="outline" className="h-10" onClick={doApply} disabled={!couponInput.trim()}>
                    Apply
                  </Button>
                </div>
              )}
              {couponMsg && !couponMsg.ok && <p className="mt-1.5 text-[12.5px] font-medium text-danger" role="alert">{couponMsg.message}</p>}
              {!coupon && <p className="mt-1.5 text-[12px] text-faint">Try WANDER10, HONEYMOON15, WINTER5K or FAMILY8</p>}
            </div>
            <dl className="space-y-1.5 p-4 text-[13.5px]">
              <div className="flex justify-between text-muted"><dt>Package fare</dt><dd>{formatINR(totals.base)}</dd></div>
              {totals.roomAdd > 0 && <div className="flex justify-between text-muted"><dt>Room upgrade</dt><dd>{formatINR(totals.roomAdd)}</dd></div>}
              {totals.pickAdd > 0 && <div className="flex justify-between text-muted"><dt>Airport transfers</dt><dd>{formatINR(totals.pickAdd)}</dd></div>}
              {totals.insAdd > 0 && <div className="flex justify-between text-muted"><dt>Insurance</dt><dd>{formatINR(totals.insAdd)}</dd></div>}
              <div className="flex justify-between text-muted"><dt>GST & taxes</dt><dd>{formatINR(totals.taxes)}</dd></div>
              <AnimatePresence>
                {totals.discount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-between font-semibold text-success">
                    <dt>Coupon discount</dt><dd>− {formatINR(totals.discount)}</dd>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex justify-between border-t border-line-2 pt-2.5 text-[17px] font-bold"><dt>Total</dt><dd>{formatINR(totals.total)}</dd></div>
              <div className="flex justify-between rounded-xl bg-gold-soft px-3 py-2 text-[13.5px] font-semibold text-gold-dark"><dt>Due today</dt><dd>{formatINR(totals.due)}</dd></div>
            </dl>
            <p className="flex items-center justify-center gap-1.5 border-t border-line-2 p-3 text-[12px] text-muted">
              <ShieldCheck className="size-3.5 text-success" /> 256-bit secure · Free changes up to 30 days
            </p>
          </div>
        </aside>
      </form>

      <AnimatePresence>
        {processing && (
          <motion.div className="fixed inset-0 z-[95] grid place-items-center bg-paper/85 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">
            <div className="card flex flex-col items-center px-10 py-8 text-center shadow-[var(--shadow-lift)]">
              <Lottie data={dots} className="h-16 w-32" />
              <p className="mt-2 text-[16px] font-semibold">Confirming your booking…</p>
              <p className="text-[13px] text-muted">Securing seats and holding your hotels</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
