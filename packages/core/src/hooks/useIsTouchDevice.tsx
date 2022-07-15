import { useState } from 'react'

import { isSSR, isTouchable, isWeb, useIsomorphicLayoutEffect } from '../constants/platform'

// ssr friendly

export const useIsTouchDevice = () => {
  const [touchOnly, setTouchOnly] = useState(false)

  if (isWeb && !isSSR) {
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
