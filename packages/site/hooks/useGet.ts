import { useCallback, useRef } from 'react'

// keeps a reference to the current value easily

export function useGet<A extends any>(currentValue: A): () => A {
  const curRef = useRef<any>(null)
  curRef.current = currentValue
  return useCallback(() => curRef.current, [curRef])
}
