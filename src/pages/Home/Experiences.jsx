import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import { Img } from '../../components/common/Img'
import { experiences } from '../../data/content'
import { useApp } from '../../context/AppContext'
import { prefersReducedMotion } from '../../hooks/useSmoothScroll'
import { TextReveal } from '../../components/common/TextReveal'

// Pinned horizontal scroll on desktop (GSAP ScrollTrigger); native swipe carousel on touch screens.
export function Experiences() {
  const root = useRef(null)
  const track = useRef(null)
  const { catalog } = useApp()

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const el = track.current
      const distance = () => el.scrollWidth - el.parentElement.clientWidth
      gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top+=40', end: () => `+=${distance()}`, scrub: 0.8, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={root} className="overflow-hidden pt-20 md:pt-24 lg:flex lg:min-h-[100vh] lg:flex-col lg:justify-center lg:pt-10">
      <div className="container-x mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow mb-4">Experiences & special trips</span>
          <TextReveal as="h2" className="h-section block max-w-xl" parts={[{ text: 'Travel the way' }, { text: 'you', className: 'serif-accent text-gold' }, { text: 'love to' }]} />
        </div>
        <p className="max-w-sm text-[14px] text-muted md:text-right">Adventure, honeymoon, family holidays, luxury escapes and spiritual journeys, each with its own handpicked collection.</p>
      </div>
      <div className="container-x">
        <div ref={track} className="no-scrollbar -mx-3 sm:-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 sm:px-4 pb-2 sm:gap-4 lg:mx-0 lg:snap-none lg:overflow-visible lg:px-0">
          {experiences.map((e, k) => {
            const count = catalog.filter((p) => p.active && p.category === e.key).length
            return (
              <Link
                key={e.key}
                to={`/packages?category=${e.key}`}
                className="group relative aspect-[3/4] w-[72%] shrink-0 snap-start overflow-hidden rounded-[14px] sm:w-[44%] lg:aspect-[3/4.1] lg:w-[340px]"
              >
                <Img id={e.image} alt={e.title} className="absolute inset-0" imgClassName="group-hover:scale-[1.06]" sizes="(max-width: 1024px) 72vw, 340px" />
                <div className="img-shade absolute inset-0" />
                <span className="absolute left-4 top-4 text-[26px] font-light leading-none text-white/90">0{k + 1}</span>
                <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-ink transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="size-[18px]" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/70">{count} trips</p>
                  <h3 className="mt-1 text-[24px] font-semibold !text-white">{e.title}</h3>
                  <p className="text-[13.5px] text-white/80">{e.desc}</p>
                </div>
              </Link>
            )
          })}
          <Link to="/offers" className="flex aspect-[3/4] w-[72%] shrink-0 snap-start flex-col justify-between rounded-[14px] bg-ink p-6 text-white sm:w-[44%] lg:aspect-[3/4.1] lg:w-[340px]">
            <span className="eyebrow self-start !border-white/15 !bg-white/10 !text-white">Seasonal offers</span>
            <div>
              <p className="text-[48px] font-light leading-none tracking-[-0.04em] text-[#d3ebf9]">15%</p>
              <h3 className="mt-2 text-[22px] font-semibold !text-white">Winter escapes are on sale</h3>
              <p className="mt-1.5 text-[13.5px] text-white/70">Use HONEYMOON15 or WINTER5K at checkout.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold">
                See all offers <ArrowUpRight className="size-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
