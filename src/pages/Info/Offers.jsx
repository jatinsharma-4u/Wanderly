import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Timer, Tag, Calculator, Gift } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition, Reveal, Stagger, StaggerItem } from '../../components/common/Reveal'
import { Img } from '../../components/common/Img'
import { Button, ButtonLink } from '../../components/common/Button'
import { Badge } from '../../components/common/Bits'
import { PackageCard } from '../../components/cards/PackageCard'
import { SectionHeader } from '../../components/common/SectionHeader'
import { offers, flashDeals, applyCoupon } from '../../data/content'
import { packages, getPackage } from '../../data/packages'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatINR, formatDate } from '../../utils/format'
import { Select } from '../../components/common/Select'

function CouponCalculator() {
  const [slug, setSlug] = useState(packages[1].slug)
  const [pax, setPax] = useState(2)
  const [code, setCode] = useState('')
  const [res, setRes] = useState(null)
  const p = getPackage(slug)
  const base = p.price * pax

  const check = (e) => {
    e.preventDefault()
    setRes(applyCoupon(code, base, p.category))
  }

  return (
    <div className="card grid gap-6 p-5 md:grid-cols-2 md:p-7">
      <div className="min-w-0">
        <span className="grid size-11 place-items-center rounded-xl bg-gold-soft text-gold-dark"><Calculator className="size-5" /></span>
        <h2 className="mt-4 text-[22px]">Check your savings</h2>
        <p className="mt-1.5 text-[14px] text-muted">Pick a package, enter a code and see exactly what you’ll pay, before you book.</p>
        <form onSubmit={check} className="mt-5 grid gap-3">
          <p className="label !mb-0">Package</p>
          <Select label="Package" value={slug} onChange={(v) => { setSlug(v); setRes(null) }} options={packages.map((x) => ({ value: x.slug, label: `${x.title}, ${formatINR(x.price)}` }))} />
          <div className="grid grid-cols-[100px_1fr] gap-3">
            <div>
              <label className="label" htmlFor="calc-pax">Travellers</label>
              <input id="calc-pax" type="number" min={1} max={12} value={pax} onChange={(e) => { setPax(Math.max(1, Math.min(12, Number(e.target.value) || 1))); setRes(null) }} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="calc-code">Coupon code</label>
              <div className="flex gap-2">
                <input id="calc-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="WANDER10" className="input uppercase" />
                <Button type="submit" disabled={!code.trim()} className="h-11">Apply</Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-col justify-center rounded-xl bg-paper p-5">
        <dl className="space-y-2.5 text-[14px]">
          <div className="flex justify-between"><dt className="text-muted">{pax} × {formatINR(p.price)}</dt><dd className="font-semibold">{formatINR(base)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Coupon</dt><dd className={res?.ok ? 'font-semibold text-success' : 'text-faint'}>{res?.ok ? `− ${formatINR(res.discount)}` : '—'}</dd></div>
          <div className="flex justify-between border-t border-line pt-2.5 text-[18px] font-bold"><dt>You pay</dt><dd>{formatINR(base - (res?.ok ? res.discount : 0))}</dd></div>
        </dl>
        {res && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 rounded-xl px-3 py-2 text-[13px] font-medium ${res.ok ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`} role="status">
            {res.message}
          </motion.p>
        )}
        <ButtonLink to={`/packages/${p.slug}`} variant="outline" className="mt-5" arrow>View this package</ButtonLink>
      </div>
    </div>
  )
}

export default function Offers() {
  useDocumentTitle('Offers & deals')
  const toast = useToast()
  const [copied, setCopied] = useState(null)
  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* ignore */
    }
    setCopied(code)
    toast(`Code ${code} copied, apply it at checkout`)
    setTimeout(() => setCopied(null), 1800)
  }

  return (
    <PageTransition>
      <PageHeader image="1519307212971-dd9561667ffb" title="Offers &" accent="seasonal deals" desc="Members-only fares, festive savings and limited-time flash deals on our most-loved trips." crumbs={[{ label: 'Offers' }]} />

      <section className="container-x mt-10">
        <SectionHeader title="Coupon codes" desc="Copy a code and apply it on the booking page. One code per booking." />
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {offers.map((o) => (
            <StaggerItem key={o.code} className="card flex flex-col overflow-hidden sm:flex-row">
              <Img id={o.image} alt="" className="h-36 shrink-0 sm:h-auto sm:w-44" sizes="200px" />
              <div className="flex flex-1 flex-col p-5">
                <Badge tone="gold" className="self-start">{o.tag}</Badge>
                <h3 className="mt-2 text-[17px] font-semibold">{o.title}</h3>
                <p className="mt-1 text-[13.5px] text-muted">{o.desc}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
                  <button type="button" onClick={() => copy(o.code)} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-gold bg-gold-soft px-3 py-2 text-[13px] font-bold tracking-wider text-gold-dark transition hover:bg-gold hover:text-white">
                    <Tag className="size-3.5" /> {o.code} {copied === o.code ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </button>
                  <span className="text-[12px] text-muted">Valid till {formatDate(o.validTill)}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="container-x pt-20">
        <SectionHeader title="Flash deals" accent="ending soon" desc="Limited seats at these prices. Once they’re gone, they’re gone." />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {flashDeals.map((f) => {
            const p = getPackage(f.slug)
            return (
              <div key={f.slug} className="flex flex-col">
                <p className="mb-2.5 flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-1.5 font-medium text-danger">
                    <Timer className="size-3.5" /> Ends in {f.endsIn} days
                  </span>
                  <span className="text-muted">Save {f.off}%</span>
                </p>
                <PackageCard p={p} className="flex-1" />
              </div>
            )
          })}
        </div>
      </section>

      <section className="container-x pt-20">
        <Reveal>
          <CouponCalculator />
        </Reveal>
      </section>

      <section className="container-x pt-20">
        <Reveal className="flex flex-col items-start gap-5 rounded-[16px] bg-navy p-6 text-white md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/10"><Gift className="size-6 text-[#d3ebf9]" /></span>
            <div>
              <h2 className="text-[22px] !text-white">Refer a friend, both get ₹2,000</h2>
              <p className="text-[14px] text-white/70">Share your code from the dashboard. Credits apply on their first booking.</p>
            </div>
          </div>
          <ButtonLink to="/dashboard" variant="white" arrow>Get my code</ButtonLink>
        </Reveal>
      </section>
    </PageTransition>
  )
}
