import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useRef } from 'react'

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
