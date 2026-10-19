import { Link } from 'react-router-dom'
import { CalendarDays, Users, Star, MapPin, ArrowUpRight, Flame } from 'lucide-react'
import { Img } from '../common/Img'
import { WishButton } from '../common/Bits'
import { getDestination } from '../../data/destinations'
import { formatINR, cn } from '../../utils/format'

// Lightweight framed card: inset photo, compact info, hairline stat row, quiet text CTA.
export function PackageCard({ p, className, compact }) {
  const d = getDestination(p.destination)
  const off = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0
  const place = d ? (d.country === 'India' || d.country === d.name ? d.name : `${d.name}, ${d.country}`) : ''

  return (
    <Link
      to={`/packages/${p.slug}`}
      className={cn(
        'group flex h-full flex-col rounded-[16px] bg-white p-1.5 shadow-[0_1px_2px_rgb(18_49_63/0.05),0_14px_34px_-24px_rgb(18_49_63/0.35)] transition duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_2px_4px_rgb(18_49_63/0.04),0_28px_54px_-28px_rgb(18_49_63/0.5)]',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[12px]">
        <Img id={p.image} alt={p.title} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="absolute inset-0" imgClassName="scale-[1.02] group-hover:scale-[1.07]" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.35))' }} />
        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between">
          <span className="flex items-center gap-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white">
            {p.tag || p.category}
            {off > 0 && <span className="rounded-[4px] bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-normal text-navy">−{off}%</span>}
          </span>
          <WishButton id={p.slug} className="size-7 bg-white/85 [&_svg]:size-[14px]" />
        </div>
        {p.slotsLeft <= 4 && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 text-[10.5px] font-medium text-white">
            <Flame className="size-3 text-orange-300" /> Only {p.slotsLeft} slots left
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
        <p className="flex items-center gap-1 truncate text-[11px] uppercase tracking-[0.12em] text-muted">
          <MapPin className="size-3 shrink-0 text-gold" /> {place}
        </p>
        <h3 className="mt-1 line-clamp-1 text-[15px] font-semibold leading-snug transition-colors group-hover:text-gold-dark">{p.title}</h3>
        {!compact && <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted">{p.summary}</p>}

        <div className="mt-3 flex items-center gap-3 border-t border-line-2 pt-2.5 text-[11.5px] text-ink-2">
          <span className="flex items-center gap-1"><CalendarDays className="size-3.5 text-faint" /> {p.days}D/{p.days - 1}N</span>
          <span className="h-3 w-px bg-line" />
          <span className="flex items-center gap-1"><Users className="size-3.5 text-faint" /> {p.groupSize}</span>
          <span className="h-3 w-px bg-line" />
          <span className="flex items-center gap-1"><Star className="size-3.5 fill-gold text-gold" /> {p.rating.toFixed(1)}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className="leading-tight">
            {p.originalPrice && <span className="block text-[11px] text-faint line-through">{formatINR(p.originalPrice)}</span>}
            <span className="text-[15.5px] font-semibold text-navy">{formatINR(p.price)}</span>
            <span className="text-[11px] text-muted"> / person</span>
          </p>
          <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-navy">
            View trip
            <span className="grid size-7 place-items-center rounded-full bg-navy text-white transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-3.5" />
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}
