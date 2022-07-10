import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

const isWeb = process.env.TAMAGUI_TARGET === 'web'
const isClient = typeof window !== 'undefined'
const useIsomorphicLayoutEffect = !isWeb || isClient ? useLayoutEffect : useEffect

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
