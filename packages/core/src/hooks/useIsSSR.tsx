import { useEffect, useState } from 'react'

import { isSSR, isWeb } from '../constants/platform'

// because any change before first useEffect causes hydration / mismatch issues

export const useIsSSR = () => {
  const [val, setVal] = useState(isSSR)

  useEffect(() => {
    if (isWeb && !isSSR) {
      setVal(false)
    }
  }, [])

  return val
}
