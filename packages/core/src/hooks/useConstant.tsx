import { useMemo, useRef } from 'react'

type ResultBox<T> = { v: T }

export function useConstant<T>(fn: () => T): T {
  // RSC compat
  if (typeof document === 'undefined') {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(() => fn(), [])
  }

  const ref = useRef<ResultBox<T>>()

  if (!ref.current) {
    ref.current = { v: fn() }
  }

  return ref.current.v
}
