import { useEffect, useMemo, useRef, useState } from 'react'

type DebounceSettings = {
  leading?: boolean
}

export function debounce<A extends Function>(
  func: A,
  wait?: number,
  leading?: boolean
): A & {
  cancel: () => void
} {
  let timeout: any
  let isCancelled = false

  function debounced(this: any) {
    isCancelled = false
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    const args = arguments
    if (leading && !timeout) {
      func.apply(context, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!leading && !isCancelled) {
        func.apply(context, args)
      }
      isCancelled = false
    }, wait)
  }

  debounced.cancel = () => {
    isCancelled = true
  }

  return debounced as any
}

const defaultOpts = { leading: false }

export function useDebounce<
  A extends (...args: any) => any | undefined | null,
  DebouncedFn extends A & {
    cancel: () => void
  }
>(
  fn: A,
  wait: number,
  options: DebounceSettings = defaultOpts,
  mountArgs: any[] = []
): DebouncedFn {
  const dbEffect = useRef<DebouncedFn | null>(null)

  useEffect(() => {
    return () => {
      dbEffect.current?.cancel()
    }
  }, [])

  return useMemo(() => {
    dbEffect.current = debounce(fn, wait, options.leading) as unknown as DebouncedFn
    return dbEffect.current
  }, [options.leading, ...mountArgs])
}

/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */
export function useDebounceValue<A>(val: A, amt = 0): A {
  const [state, setState] = useState(val)

  useEffect(() => {
    const tm = setTimeout(() => {
      setState((prev) => {
        if (prev === val) return prev
        return val
      })
    }, amt)

    return () => {
      clearTimeout(tm)
    }
  }, [val])

  return state
}
