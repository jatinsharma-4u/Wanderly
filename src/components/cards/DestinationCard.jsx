import { Link } from 'react-router-dom'
import { ArrowUpRight, Star, MapPin } from 'lucide-react'
import { Img } from '../common/Img'
import { WishButton } from '../common/Bits'
import { formatINR, cn } from '../../utils/format'

// Photo-led postcard: label and save on top, serif name with a quiet info line over a deep black fade.
export function DestinationCard({ d, className, aspect = 'aspect-[3/4]', sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw', showPrice = true, large }) {
  return (
    <Link
      to={`/destinations/${d.slug}`}
      className={cn('group relative block overflow-hidden rounded-[14px] bg-sand-2 transition duration-500 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[0_24px_44px_-26px_rgb(0_0_0/0.55)]', aspect, className)}
    >
      <Img id={d.image} alt={d.name} sizes={sizes} className="absolute inset-0" imgClassName="scale-[1.03] group-hover:scale-[1.08]" />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 32%, rgba(0,0,0,0) 62%), linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(0,0,0,0) 26%)' }} />

      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5 sm:p-3">
        <span className="pt-1.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-white/90 sm:text-[10.5px]">
          {d.country === 'India' ? d.category : d.country}
        </span>
        <WishButton id={d.slug} className="size-7 bg-white/85 sm:size-8 [&_svg]:size-[14px]" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
        <h3 className={cn('truncate font-display font-semibold leading-tight tracking-[-0.02em] !text-white', large ? 'text-[22px] sm:text-[30px]' : 'text-[17px] sm:text-[20px]')}>{d.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 truncate text-[10.5px] text-white/70 sm:text-[12px]">
          <MapPin className="size-3 shrink-0" /> {d.location}
        </p>
        {showPrice && (
          <div className="mt-2 flex items-center justify-between border-t border-white/15 pt-2 text-[10.5px] text-white/85 sm:text-[11.5px]">
            <span className="flex items-center gap-1">
              <Star className="size-3 fill-[#d3ebf9] text-[#d3ebf9]" /> {d.rating.toFixed(1)}
              <span className="hidden text-white/55 sm:inline">· {d.bestTime}</span>
            </span>
            <span>
              <span className="hidden text-white/60 sm:inline">from </span>
              <b className="font-semibold text-white">{formatINR(d.startingPrice)}</b>
            </span>
          </div>
        )}
        {large && (
          <span className="mt-4 hidden items-center gap-1.5 text-[13px] font-medium text-white sm:inline-flex">
            Explore {d.name}
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  )
}
