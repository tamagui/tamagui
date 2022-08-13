import { useState } from 'react'

import { isSSR, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { startTransition } from '../helpers/startTransition'

// because any change before first useEffect causes hydration / mismatch issues

export const useIsSSR = () => {
  const [val, setVal] = useState(true)

  useIsomorphicLayoutEffect(() => {
    if (isWeb && !isSSR) {
      startTransition(() => {
        setVal(false)
      })
    }
  }, [])

  return val
}
