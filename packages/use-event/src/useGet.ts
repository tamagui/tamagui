import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useCallback, useRef } from 'react'

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

  return useCallback(
    forwardToFunction
      ? (...args) => curRef.current?.apply(null, args)
      : () => curRef.current,
    []
  )
}
