import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Img } from './Img'
import { Reveal } from './Reveal'
import { TextReveal } from './TextReveal'
import { cn } from '../../utils/format'

// Compact header for inner pages. With an image it becomes a rounded banner like the references.
export function PageHeader({ title, accent, desc, crumbs = [], image, children, className }) {
  const Crumbs = (
    <nav aria-label="Breadcrumb" className={cn('mb-3 flex flex-wrap items-center gap-1 text-[12.5px]', image ? 'text-white/80' : 'text-muted')}>
      <Link to="/" className="hover:underline">
        Home
      </Link>
      {crumbs.map((c) => (
        <span key={c.label} className="flex items-center gap-1">
          <ChevronRight className="size-3.5 opacity-60" />
          {c.to ? (
            <Link to={c.to} className="hover:underline">
              {c.label}
            </Link>
          ) : (
            <span aria-current="page">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
  if (image) {
    return (
      <section className={cn('relative overflow-hidden', className)}>
        <div className="relative">
          <Img id={image} priority sizes="100vw" className="absolute inset-0" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/15" />
          <div className="container-x relative flex min-h-[280px] flex-col justify-end pb-9 pt-16 text-white md:min-h-[400px] md:pb-14">
            {Crumbs}
            <Reveal>
              <TextReveal as="h1" className="h-display block max-w-3xl !text-white" parts={[{ text: title }, ...(accent ? [{ text: accent, className: 'serif-accent text-[#d3ebf9]' }] : [])]} />
              {desc && <p className="mt-3 max-w-xl text-[14.5px] text-white/85 md:text-[15px]">{desc}</p>}
            </Reveal>
            {children}
          </div>
        </div>
      </section>
    )
  }
  return (
    <section className={cn('container-x pt-6 pb-2 md:pt-12', className)}>
      {Crumbs}
      <Reveal>
        <TextReveal as="h1" className="h-display block max-w-3xl" parts={[{ text: title }, ...(accent ? [{ text: accent, className: 'serif-accent text-gold' }] : [])]} />
        {desc && <p className="mt-3 max-w-2xl text-[15px] text-muted">{desc}</p>}
      </Reveal>
      {children}
    </section>
  )
}
