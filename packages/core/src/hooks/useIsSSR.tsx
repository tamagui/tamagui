import { useEffect, useState } from 'react'

import { isSSR, isWeb } from '../constants/platform'
import { startTransition } from '../helpers/startTransition'

// because any change before first useEffect causes hydration / mismatch issues

export const useIsSSR = () => {
  const [val, setVal] = useState(isSSR)

  useEffect(() => {
    if (isWeb && !isSSR) {
      startTransition(() => {
        setVal(false)
      })
    }
  }, [])

  return val
}
