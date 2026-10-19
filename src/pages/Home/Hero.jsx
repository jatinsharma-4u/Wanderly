import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { Star } from 'lucide-react'
import { ButtonLink } from '../../components/common/Button'
import { Avatar } from '../../components/common/Img'
import { TripSearchForm } from '../../components/forms/TripSearchForm'
import { avatars } from '../../data/reviews'
import { img, srcSet } from '../../utils/format'

const slides = [
  { word: 'Ladakh', image: '1674187219704-be3cd35a80b7', pos: '50% 60%' },
  { word: 'Kerala', image: '1602216056096-3b40cc0c9944', pos: '50% 55%' },
  { word: 'Udaipur', image: '1589901164570-f9de6556e1c1', pos: '50% 50%' },
  { word: 'Spiti', image: '1653844573020-71f77a0ccb8c', pos: '50% 45%' },
]
const DURATION = 6500

// Full-bleed hero: one immersive image, one headline, one CTA. The navbar floats transparently on top.
export function Hero() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  const root = useRef(null)
  const media = useRef(null)
  const copy = useRef(null)

  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setI((x) => (x + 1) % slides.length), DURATION)
    return () => clearTimeout(t)
  }, [i, reduce])

  useEffect(() => {
    slides.forEach((s) => {
      const im = new Image()
      im.src = img(s.image, 1800)
    })
  }, [])

  useLayoutEffect(() => {
    if (reduce) return
    const ctx = gsap.context(() => {
      gsap.to(media.current, { yPercent: 14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(copy.current, { y: -50, opacity: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom 30%', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [reduce])

  const s = slides[i]

  return (
    <>
      <section ref={root} className="relative -mt-16 h-[74svh] min-h-[500px] max-h-[720px] overflow-hidden bg-ink md:-mt-[72px] md:h-[86vh] md:max-h-[880px] md:min-h-[620px]">
        <div ref={media} className="absolute inset-0 will-change-transform">
          <AnimatePresence initial={false}>
            <motion.img
              key={s.image}
              src={img(s.image, 1800)}
              srcSet={srcSet(s.image, [640, 1000, 1400, 1800, 2400])}
              sizes="100vw"
              alt=""
              fetchPriority={i === 0 ? 'high' : 'auto'}
              style={{ objectPosition: s.pos }}
              className="absolute inset-0 size-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1.02 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2 }, scale: { duration: DURATION / 1000 + 1.4, ease: 'linear' } }}
            />
          </AnimatePresence>
        </div>
        {/* Black overlays: light scrim behind the nav, smooth transparent-to-black fade behind the headline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0))' }} />
        {/* Phones: taller, deeper fade because the headline sits over more of the image */}
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 22%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0) 88%)' }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[85%] md:block"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.42) 42%, rgba(0,0,0,0.14) 68%, rgba(0,0,0,0) 100%)' }}
        />
        <div className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0) 75%)' }} />

        <div ref={copy} className="container-x relative flex h-full flex-col justify-end pb-12 md:pb-24 lg:pb-32">
          <h1 className="max-w-5xl text-left text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]" aria-live="polite">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="block text-[clamp(1.02rem,1.6vw,1.3rem)] font-light tracking-[0.01em] text-white/90"
            >
              Slow, soulful journeys through
            </motion.span>
            <span className="mt-2 block h-[1.12em] overflow-hidden text-[clamp(3.1rem,7.4vw,6.2rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={s.word} className="flex">
                  {s.word.split('').map((ch, k) => (
                    <motion.span
                      key={k}
                      initial={{ y: '105%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '-105%' }}
                      transition={{ duration: 0.75, delay: k * 0.035, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block"
                    >
                      {ch}
                    </motion.span>
                  ))}
                  <span className="text-[#d3ebf9]">.</span>
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }} className="mt-6">
            <ButtonLink to="/planner" variant="white" arrow>
              Plan your journey
            </ButtonLink>
          </motion.div>
        </div>
      </section>

      {/* Search sits just below the hero so the hero itself stays uncluttered */}
      <section className="container-x relative z-10 mt-5 lg:-mt-14">
        <TripSearchForm />
        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {[avatars.priya, avatars.rohan, avatars.meera, avatars.kabir].map((a) => (
                <Avatar key={a} id={a} size={32} />
              ))}
            </div>
            <p className="text-[13px] text-muted">
              <b className="font-semibold text-ink">48,000+</b> travellers ·{' '}
              <span className="inline-flex items-center gap-0.5 font-semibold text-ink">
                <Star className="size-3.5 fill-gold text-gold" /> 4.9
              </span>{' '}
              on Google
            </p>
          </div>
          <p className="hidden text-[13px] text-muted sm:block">Featured in Condé Nast Traveller · Outlook Traveller · Lonely Planet India</p>
        </div>
      </section>
    </>
  )
}
