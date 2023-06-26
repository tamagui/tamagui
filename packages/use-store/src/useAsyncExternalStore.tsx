import { startTransition, useLayoutEffect, useState } from 'react'

export function useAsyncExternalStore(
  subscribe: (cb: Function) => () => void,
  getSnapshot: (state: any) => any,
  getServerSnapshot?: (state: any) => any
) {
  const [storeState, setStoreState] = useState(getServerSnapshot)

  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      return subscribe((next: any) => {
        startTransition(() => {
          setStoreState(getSnapshot(next))
        })
      })
    }, [subscribe])
  }

  return storeState
}
