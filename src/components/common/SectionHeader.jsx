import { Reveal } from './Reveal'
import { TextReveal } from './TextReveal'
import { cn } from '../../utils/format'

export function SectionHeader({ eyebrow, title, accent, desc, action, align = 'split', className }) {
  const split = align === 'split'
  return (
    <div className={cn('mb-7 flex flex-col gap-4 md:mb-10', split ? 'md:flex-row md:items-end md:justify-between' : 'items-center text-center', className)}>
      <div className={cn('max-w-2xl', !split && 'mx-auto')}>
        {eyebrow && (
          <Reveal y={10}>
            <span className="eyebrow mb-4">{eyebrow}</span>
          </Reveal>
        )}
        <TextReveal as="h2" className="h-section" parts={[{ text: title }, ...(accent ? [{ text: accent, className: 'serif-accent text-gold' }] : [])]} />
        {desc && !split && (
          <Reveal delay={0.2}>
            <p className="mx-auto mt-3 max-w-xl text-[14.5px] text-muted">{desc}</p>
          </Reveal>
        )}
      </div>
      {(desc && split) || action ? (
        <Reveal delay={0.15} className="flex max-w-sm flex-col gap-4 md:items-end md:text-right">
          {desc && split && <p className="text-[13.5px] leading-relaxed text-muted">{desc}</p>}
          {action}
        </Reveal>
      ) : null}
    </div>
  )
}
