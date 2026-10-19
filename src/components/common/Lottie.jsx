import { lazy, Suspense } from 'react'
import { useReducedMotion } from 'framer-motion'

// lottie-react v3 ships named exports only; LottieLight is the smaller SVG-only build.
const LottieReact = lazy(() => import('lottie-react').then((m) => ({ default: m.LottieLight ?? m.Lottie })))

export function Lottie({ data, loop = true, className, style }) {
  const reduce = useReducedMotion()
  return (
    <Suspense fallback={<div className={className} style={style} />}>
      <LottieReact src={data} loop={reduce ? false : loop} autoplay className={className} style={style} aria-hidden="true" />
    </Suspense>
  )
}
