import { useEffect, useRef, useState } from 'react'

// ensures no updates after unmount

export function useForceUpdate() {
  const setState = useState(0)[1]
  const internal = useRef<{ update: Function; isMounted: boolean }>()
  if (!internal.current) {
    internal.current = {
      isMounted: true,
      update: () => {
        if (internal.current!.isMounted) {
          setState(Math.random())
        }
      },
    }
  }

  useEffect(() => {
    return () => {
      internal.current!.isMounted = false
    }
  }, [])

  return internal.current.update
}
