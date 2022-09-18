import { useState } from 'react'

import { isServer, isTouchable, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'

// ssr friendly

export const useIsTouchDevice = () => {
  const [touchOnly, setTouchOnly] = useState(false)

  if (isWeb && !isServer) {
    // only ever false on web SSR (env), so run effect conditionally
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useIsomorphicLayoutEffect(() => {
      if (isTouchable) {
        setTouchOnly(true)
      }
    }, [])
  }

  return touchOnly
}
