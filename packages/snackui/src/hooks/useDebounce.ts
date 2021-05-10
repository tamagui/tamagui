import { useEffect, useMemo, useRef, useState } from 'react'

export function debounce<A extends Function>(
  func: A,
  wait?: number,
  immediate?: boolean
): A & {
  cancel: Function
} {
  var timeout
  var isCancelled
  function debounced() {
    // @ts-ignore
    var context = this,
      args = arguments
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      timeout = null
      if (!immediate && !isCancelled) {
        func.apply(context, args)
      }
      isCancelled = false
    }, wait)
    if (immediate && !timeout) {
      func.apply(context, args)
    }
  }
  debounced.cancel = () => {
    isCancelled = true
  }
  return debounced as any
}

type DebounceSettings = {
  leading?: boolean
}

const defaultOpts = { leading: false }

export function useDebounce<
  A extends (...args: any) => any,
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
    dbEffect.current = (debounce(fn, wait, options.leading) as unknown) as DebouncedFn
    return dbEffect.current
  }, [JSON.stringify(options), ...mountArgs])
}

/**
 * Returns a value once it stops changing after "amt" time.
 * Note: you may need to memo or this will keep re-rendering
 */
export function useDebounceValue<A>(val: A, amt = 0): A {
  const [state, setState] = useState(val)

  useEffect(() => {
    let tm = setTimeout(() => {
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
