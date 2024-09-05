import * as React from 'react'

type ResultBox<T> = { v: T }

export function useConstant<T>(fn: () => T): T {
  // RSC compat
  if (typeof document === 'undefined') {
    return React.useMemo(() => fn(), [])
  }

  const ref = React.useRef<ResultBox<T>>()

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}
