import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/**
 * Word-by-word masked reveal: each word rises out of its own clipped line as it scrolls into view.
 * `parts` lets one heading mix plain and accent-styled runs: [{ text, className }].
 */
export function TextReveal({ text, parts, as = 'span', className, delay = 0, stagger = 0.06, once = true }) {
  const reduce = useReducedMotion()
  const runs = parts || [{ text }]
  const Tag = motion[as]
  let i = 0
  return (
    <Tag className={className} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once, amount: 0.5 }} aria-label={runs.map((r) => r.text).join(' ')}>
      {runs.map((run, r) =>
        run.text.split(' ').filter(Boolean).map((word, w) => {
          const k = i++
          return (
            <span key={`${r}-${w}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className={`inline-block will-change-transform ${run.className || ''}`}
                variants={{
                  hidden: { y: '110%', rotate: 2, opacity: 0 },
                  show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.8, ease, delay: delay + k * stagger } },
                }}
              >
                {word}
              </motion.span>
              {' '}
            </span>
          )
        }),
      )}
    </Tag>
  )
}
