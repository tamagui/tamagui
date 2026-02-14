import * as React from 'react'

const isServer = typeof window === 'undefined'

// Use useInsertionEffect on the client to ensure the ref is updated before any
// useLayoutEffect reads the returned callback. This fixes a React 19 timing
// issue where a consumer's useLayoutEffect could fire before this ref update,
// causing stale values. Falls back to useLayoutEffect for React < 18.3.
const useIsomorphicInsertionEffect = isServer
  ? React.useEffect
  : React.useInsertionEffect || React.useLayoutEffect

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
