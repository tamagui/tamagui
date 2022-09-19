import { useState } from 'react'

import { isServer, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { startTransition } from '../helpers/startTransition'

// because any change before first useEffect causes hydration / mismatch issues

export const useIsSSR = (props?: { immediate?: boolean }) => {
  const [val, setVal] = useState(true)

  if (isWeb && !isServer) {
    useIsomorphicLayoutEffect(() => {
      // could also have a global tamagui `config.immediateSSRTransition`
      if (props?.immediate) {
        setVal(false)
      } else {
        startTransition(() => {
          setVal(false)
        })
      }
    }, [])
  }

  return val
}
