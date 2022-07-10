import { useCallback, useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'

// keeps a reference to the current value easily

export function useGet<A>(
  currentValue: A,
  initialValue?: any,
  forwardToFunction?: boolean
): () => A {
  const curRef = useRef<any>(initialValue ?? currentValue)
  useIsomorphicLayoutEffect(() => {
    curRef.current = currentValue
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    forwardToFunction ? (...args) => curRef.current?.apply(null, args) : () => curRef.current,
    []
  )
}
