import { useState } from 'react'

import { isTouchable, useIsomorphicLayoutEffect } from '../constants/platform'

// ssr friendly

export const useIsTouchDevice = () => {
  const [touchOnly, setTouchOnly] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (isTouchable) {
      setTouchOnly(true)
    }
  }, [])

  return touchOnly
}
