import * as React from 'react'

// useInsertionEffect ensures the ref is updated before any useLayoutEffect
// reads the returned callback — fixes a React 19 timing issue where a
// consumer's useLayoutEffect could fire before this ref update, causing stale
// values. Falls back to useLayoutEffect for React < 18.3. No SSR branch: SSR
// doesn't run layout effects, so the non-SSR path is correct everywhere.
const useIsomorphicInsertionEffect = React.useInsertionEffect || React.useLayoutEffect

// keeps a reference to the current value easily

export function useGet<A>(
  currentValue: A,
  initialValue?: any,
  forwardToFunction?: boolean
): () => A {
  const curRef = React.useRef<any>(initialValue ?? currentValue)
  useIsomorphicInsertionEffect(() => {
    curRef.current = currentValue
  })

  return React.useCallback(
    forwardToFunction
      ? (...args) => curRef.current?.apply(null, args)
      : () => curRef.current,
    []
  )
}
