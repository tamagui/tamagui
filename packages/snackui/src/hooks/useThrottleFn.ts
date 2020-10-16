import { useCallback, useRef } from 'react'

import { useOnUnmount } from './useOnUnmount'

export function useThrottledFn<Args extends any[], Returns extends any>(
  fn: (...args: Args) => Returns,
  props: { amount: number; ignoreFirst?: boolean },
  mountArgs?: any[]
): (...args: Args) => Returns {
  const last = useRef<any>(null)
  const tm = useRef<any>(null)
  const throttledFn = (...args: Args) => {
    clearTimeout(tm.current)
    const now = Date.now()
    const since = now - last.current
    if (since > props.amount) {
      last.current = now
      if (props.ignoreFirst) return
      fn(...args)
    } else {
      tm.current = setTimeout(() => fn(...args), since)
    }
  }

  useOnUnmount(() => {
    clearTimeout(tm.current)
  })

  return useCallback(throttledFn as any, mountArgs || [fn])
}
