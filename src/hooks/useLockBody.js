import { useEffect } from 'react'
import { lockScroll } from './useSmoothScroll'

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return
    lockScroll(true)
    return () => lockScroll(false)
  }, [locked])
}
