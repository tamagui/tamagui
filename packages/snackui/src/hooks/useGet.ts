import { useCallback, useRef, useState } from 'react'

// keeps a reference to the current value easily

export function useGet<A extends any>(currentValue: A): () => A {
  const curRef = useRef<any>(null)
  curRef.current = currentValue
  return useCallback(() => curRef.current, [curRef])
}

// keeps a reference to the current function easily

export function useGetFn<Args extends any[], Returns extends any>(
  fn: (...args: Args) => Returns
): (...args: Args) => Returns {
  const getCur = useGet(fn)
  return (...args) => getCur()(...args)
}

export function useStateFn<A extends any>(currentValue: A) {
  const [state, setState] = useState(currentValue)
  const curRef = useRef<A>()
  curRef.current = state
  return [useCallback(() => curRef.current, []), setState] as const
}
