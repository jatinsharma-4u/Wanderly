import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Package, ArrowRight, X } from 'lucide-react'
import { Modal } from '../common/Modal'
import { destinations } from '../../data/destinations'
import { useApp } from '../../context/AppContext'
import { img, formatINR } from '../../utils/format'

const popular = ['Ladakh', 'Kerala', 'Udaipur', 'Andaman', 'Bali', 'Honeymoon']

export function SearchDialog({ open, onClose }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const { catalog } = useApp()

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return { dest: destinations.filter((d) => d.featured).slice(0, 4), pkgs: [] }
    return {
      dest: destinations.filter((d) => [d.name, d.location, d.category, d.tagline].join(' ').toLowerCase().includes(s)).slice(0, 5),
      pkgs: catalog.filter((p) => p.active && [p.title, p.category, p.destination].join(' ').toLowerCase().includes(s)).slice(0, 5),
    }
  }, [q, catalog])

  const go = (to) => {
    onClose()
    setQ('')
    navigate(to)
  }

  return (
    <Modal open={open} onClose={onClose} size="md" className="md:self-start md:mt-[8vh]">
      <div className="flex items-center gap-3 border-b border-line-2 px-4 py-3 sm:px-5">
        <Search className="size-5 text-faint" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && q.trim() && go(`/packages?q=${encodeURIComponent(q.trim())}`)}
          placeholder="Search destinations, packages, experiences…"
          className="h-11 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
          aria-label="Search"
        />
        <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-sand" aria-label="Close search">
          <X className="size-[18px]" />
        </button>
      </div>
      <div className="p-3 sm:p-4">
        {!q && (
          <div className="mb-4 px-1">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-faint">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {popular.map((p) => (
                <button type="button" key={p} className="chip" onClick={() => setQ(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {results.dest.length > 0 && (
          <div className="mb-2">
            <p className="mb-1 px-1 text-[12px] font-semibold uppercase tracking-wider text-faint">{q ? 'Destinations' : 'Trending destinations'}</p>
            {results.dest.map((d) => (
              <button type="button" key={d.slug} onClick={() => go(`/destinations/${d.slug}`)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-paper">
                <img src={img(d.image, 120, 120)} alt="" className="size-11 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{d.name}</p>
                  <p className="flex items-center gap-1 truncate text-[12.5px] text-muted">
                    <MapPin className="size-3" /> {d.location}
                  </p>
                </div>
                <ArrowRight className="size-4 text-faint" />
              </button>
            ))}
          </div>
        )}
        {results.pkgs.length > 0 && (
          <div>
            <p className="mb-1 px-1 text-[12px] font-semibold uppercase tracking-wider text-faint">Packages</p>
            {results.pkgs.map((p) => (
              <button type="button" key={p.slug} onClick={() => go(`/packages/${p.slug}`)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-paper">
                <span className="grid size-11 place-items-center rounded-lg bg-gold-soft text-gold-dark">
                  <Package className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold">{p.title}</p>
                  <p className="text-[12.5px] text-muted">
                    {p.days}D/{p.days - 1}N · from {formatINR(p.price)}
                  </p>
                </div>
                <ArrowRight className="size-4 text-faint" />
              </button>
            ))}
          </div>
        )}
        {q && !results.dest.length && !results.pkgs.length && (
          <div className="px-2 py-10 text-center">
            <p className="font-semibold">No matches for “{q}”</p>
            <p className="mt-1 text-[14px] text-muted">Try a state, a city or an experience like “beach”.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
