import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import * as React from 'react'

// keeps a reference to the current value easily

export function useGet<A>(
  currentValue: A,
  initialValue?: any,
  forwardToFunction?: boolean
): () => A {
  const curRef = React.useRef<any>(initialValue ?? currentValue)
  useIsomorphicLayoutEffect(() => {
    curRef.current = currentValue
  })

  return React.useCallback(
    forwardToFunction
      ? (...args) => curRef.current?.apply(null, args)
      : () => curRef.current,
    []
  )
}
