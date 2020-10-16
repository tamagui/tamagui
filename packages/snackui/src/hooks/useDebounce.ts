import { debounce } from 'lodash'
import { useEffect, useMemo, useState } from 'react'

// copied from lodash because otherwise webpack-lodash gets mad
type DebounceSettings = {
  leading?: boolean
  maxWait?: number
  trailing?: boolean
}

export function useDebounce<A extends (...args: any) => any>(
  fn: A,
  wait: number,
  options: DebounceSettings = { leading: false },
  mountArgs: any[] = []
): A & {
  cancel: () => void
} {
  return useMemo(() => {
    return debounce(fn, wait, options) as any
  }, [options, ...mountArgs])
}

/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */
export function useDebounceValue<A>(val: A, amt = 0): A {
  const [state, setState] = useState(val)

  useEffect(() => {
    let tm = setTimeout(() => {
      setState(val)
    }, amt)

    return () => {
      clearTimeout(tm)
    }
  }, [val])

  return state
}
