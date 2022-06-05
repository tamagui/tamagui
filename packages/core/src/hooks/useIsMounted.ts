import { useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'

export function useIsMounted() {
  const isMounted = useRef(false)

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
