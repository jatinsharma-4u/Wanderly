import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition, Reveal } from '../../components/common/Reveal'
import { Button } from '../../components/common/Button'
import { Field } from '../../components/forms/Field'
import { Lottie } from '../../components/common/Lottie'
import { WhatsAppIcon } from '../../components/common/SocialIcons'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { sleep } from '../../utils/format'
import success from '../../assets/lottie/success.json'

const topics = ['Package query', 'Custom trip', 'Booking change', 'Group booking', 'Visa', 'Feedback']
const schema = z.object({
  name: z.string().trim().min(2, 'Enter your name'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().regex(/^[+\d\s-]{10,16}$/, 'Enter a valid mobile number'),
  type: z.string(),
  subject: z.string().trim().min(3, 'Add a short subject'),
  message: z.string().trim().min(15, 'Please share a few more details (15+ characters)'),
})

export default function Contact() {
  useDocumentTitle('Contact us')
  const { addEnquiry, user } = useApp()
  const toast = useToast()
  const [sent, setSent] = useState(null)
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', type: 'Package query', subject: '', message: '' },
  })
  const type = watch('type')

  const onSubmit = async (data) => {
    await sleep(1000)
    const e = addEnquiry(data)
    setSent(e)
    toast('Message sent. We’ll be in touch shortly.')
    reset()
  }

  const channels = [
    { icon: Phone, t: 'Call us', d: '+91 80 4567 1234', href: 'tel:+918045671234', note: 'Mon–Sun, 8am–10pm' },
    { icon: WhatsAppIcon, t: 'WhatsApp', d: '+91 98450 00000', href: 'https://wa.me/919845000000', note: 'Replies in ~5 minutes' },
    { icon: Mail, t: 'Email', d: 'hello@wanderly.in', href: 'mailto:hello@wanderly.in', note: 'Replies within 4 hours' },
  ]

  return (
    <PageTransition>
      <PageHeader title="Let’s plan" accent="something lovely" desc="Questions, ideas or a half-formed dream trip, our travel experts would love to hear from you." crumbs={[{ label: 'Contact' }]} />

      <section className="container-x mt-8 grid gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {channels.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06}>
              <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="card flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-white"><c.icon className="size-5" width={20} height={20} /></span>
                <div className="min-w-0">
                  <p className="text-[12.5px] text-muted">{c.t}</p>
                  <p className="text-[16px] font-semibold">{c.d}</p>
                  <p className="text-[12px] text-faint">{c.note}</p>
                </div>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.2} className="card overflow-hidden">
            <div className="relative h-48 bg-sea-soft">
              <svg viewBox="0 0 400 200" className="absolute inset-0 size-full" aria-hidden="true">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#c9dedc" strokeWidth="1" /></pattern>
                </defs>
                <rect width="400" height="200" fill="url(#grid)" />
                <path d="M0 140 C80 120 120 160 200 130 S320 90 400 110" stroke="#fff" strokeWidth="10" fill="none" />
                <path d="M150 0 C160 60 140 120 170 200" stroke="#fff" strokeWidth="7" fill="none" />
                <circle cx="210" cy="96" r="38" fill="#c4883a" opacity=".15" />
              </svg>
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
                <span className="grid size-11 place-items-center rounded-full bg-ink text-white shadow-lg"><MapPin className="size-5" /></span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <div className="text-[13.5px]">
                <p className="font-semibold">Wanderly HQ</p>
                <p className="text-muted">3rd Floor, 100 Feet Road, Indiranagar, Bengaluru 560038</p>
                <p className="mt-1 flex items-center gap-1.5 text-muted"><Clock className="size-3.5" /> Visits by appointment, Mon–Sat</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="card p-5 md:p-7">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center py-10 text-center">
                  <Lottie data={success} loop={false} className="size-28" />
                  <h2 className="text-[22px]">Message received!</h2>
                  <p className="mt-1.5 max-w-sm text-[14px] text-muted">Your ticket <b className="text-ink">{sent.id}</b> is with our team. Expect a reply within 4 hours.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(null)}>Send another message</Button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-[20px]"><MessageCircle className="size-5 text-gold" /> Send us a message</h2>
                    <p className="mt-1 text-[13.5px] text-muted">What can we help with?</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <button key={t} type="button" className="chip text-[12.5px]" data-active={type === t} onClick={() => setValue('type', t)}>
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" error={errors.name}><input className="input" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} /></Field>
                    <Field label="Mobile" error={errors.phone}><input className="input" type="tel" autoComplete="tel" {...register('phone')} aria-invalid={!!errors.phone} /></Field>
                  </div>
                  <Field label="Email" error={errors.email}><input className="input" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} /></Field>
                  <Field label="Subject" error={errors.subject}><input className="input" placeholder="e.g. Kerala trip for 4 in December" {...register('subject')} aria-invalid={!!errors.subject} /></Field>
                  <Field label="Message" error={errors.message}><textarea rows={5} className="input h-auto py-3" {...register('message')} aria-invalid={!!errors.message} /></Field>
                  <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto sm:justify-self-start">
                    {!isSubmitting && <Send className="size-4" />} {isSubmitting ? 'Sending…' : 'Send message'}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  )
}
