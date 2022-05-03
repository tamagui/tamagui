import { useState } from 'react'

import { isTouchDevice, useIsomorphicLayoutEffect } from '../constants/platform'

// ssr friendly

export const useIsTouchDevice = () => {
  const [touchOnly, setTouchOnly] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (isTouchDevice) {
      setTouchOnly(true)
    }
  }, [])

  return touchOnly
}
