import { MutableRefObject, useRef } from 'react'

export function useLazyRef<T>(fn: () => T): MutableRefObject<T> {
  const ref = useRef<T>()
  if (!ref.current) ref.current = fn()
  return ref as MutableRefObject<T>
}
