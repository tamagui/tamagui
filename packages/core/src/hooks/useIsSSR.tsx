import { useState } from 'react'

import { isSSR, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { startTransition } from '../helpers/startTransition'

// because any change before first useEffect causes hydration / mismatch issues

export const useIsSSR = (props?: { immediate?: boolean }) => {
  const [val, setVal] = useState(true)

  useIsomorphicLayoutEffect(() => {
    if (isWeb && !isSSR) {
      // could also have a global tamagui `config.immediateSSRTransition`
      if (props?.immediate) {
        setVal(false)
      } else {
        startTransition(() => {
          setVal(false)
        })
      }
    }
  }, [])

  return val
}
