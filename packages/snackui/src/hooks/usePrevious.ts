import { useEffect, useRef } from 'react'

export function usePrevious<A>(value: A): A {
  const ref = useRef<A>(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
