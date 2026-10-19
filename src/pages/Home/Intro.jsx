import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from 'framer-motion'
import { ShieldCheck, Sparkles } from 'lucide-react'
import { Img, Avatar } from '../../components/common/Img'
import { ButtonLink } from '../../components/common/Button'
import { Reveal } from '../../components/common/Reveal'
import { avatars } from '../../data/reviews'
import { TextReveal } from '../../components/common/TextReveal'

const statement = 'Wanderly means going places, slowly, beautifully, and with people who genuinely care about every mile.'

// "Visa Travels means Going Places" reference: scroll-scrubbed word reveal + staggered image trio.
export function Intro() {
  const root = useRef(null)
  const reduce = useReducedMotion()

  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-word]',
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.08, ease: 'none', scrollTrigger: { trigger: '[data-statement]', start: 'top 82%', end: 'bottom 45%', scrub: 0.6 } },
      )
      gsap.utils.toArray('[data-float]').forEach((el, k) => {
        gsap.fromTo(el, { y: 40 + k * 30 }, { y: -20 - k * 10, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduce])

  return (
    <section ref={root} className="container-x pt-16 md:pt-24">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-2">
          <ShieldCheck className="size-3.5 text-sea" /> We are Wanderly
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-2">
          <Sparkles className="size-3.5 text-gold" /> 48K+ travellers satisfied
        </span>
        <span className="flex -space-x-2">
          {[avatars.ananya, avatars.vikram, avatars.sneha].map((a) => (
            <Avatar key={a} id={a} size={28} />
          ))}
          <span className="grid size-7 place-items-center rounded-full bg-ink text-[10px] font-semibold text-white ring-2 ring-white">+3</span>
        </span>
      </div>

      <p data-statement className="mx-auto mt-7 max-w-4xl text-center text-[clamp(1.35rem,2.7vw,2.25rem)] font-semibold leading-[1.15] tracking-[-0.035em]">
        {statement.split(' ').map((w, k) => (
          <span key={k} data-word className="inline-block whitespace-pre">
            {w === 'places' || w === 'beautifully,' ? <span className="serif-accent text-gold">{w}</span> : w}{' '}
          </span>
        ))}
      </p>

      <div className="mt-14 grid items-center gap-10 md:mt-20 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-4">
          <span className="eyebrow">01 · Our value</span>
          <TextReveal as="h2" className="mt-4 block max-w-xs text-[clamp(1.5rem,2.4vw,2rem)] font-semibold" parts={[{ text: 'Not your boring travel agent' }]} />
          <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
            We plan unhurried, curated trips with handpicked stays, local storytellers and a trip host who’s on call from the moment you book until you’re home.
          </p>
          <ul className="mt-5 space-y-2 text-[14px] text-ink-2">
            {['No-fuss, all-inclusive pricing', 'Small groups & private departures', 'Free changes up to 30 days before'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-gold" /> {t}
              </li>
            ))}
          </ul>
          <ButtonLink to="/packages" className="mt-7" arrow>
            Book a seat
          </ButtonLink>
        </Reveal>

        <div className="grid grid-cols-3 items-start gap-2.5 sm:gap-4 md:col-span-8">
          {[
            { id: '1643368214091-6af1a029aee0', t: 'Pangong Tso', s: 'Lakeside camp under the stars', h: 'aspect-[3/4]' },
            { id: '1627894483216-2138af692e32', t: 'Varanasi', s: 'Ganga aarti from a private boat', h: 'aspect-[3/4.4] mt-10 sm:mt-16' },
            { id: '1785767021015-d8eac9f076cc', t: 'Munnar', s: 'Tea-estate morning walks', h: 'aspect-[3/3.6] mt-4 sm:mt-6' },
          ].map((c) => (
            <figure key={c.t} data-float className={c.h}>
              <div className="relative size-full overflow-hidden rounded-[16px] md:rounded-[14px]">
                <Img id={c.id} alt={c.t} className="absolute inset-0" sizes="(max-width: 768px) 33vw, 22vw" />
                <span className="absolute bottom-2 right-2 rounded-full bg-black/30 px-2 py-0.5 text-[10.5px] font-semibold text-white backdrop-blur-md sm:bottom-3 sm:right-3 sm:text-[11.5px]">{c.t}</span>
              </div>
              <figcaption className="mt-2 hidden text-[12.5px] text-muted sm:block">{c.s}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
