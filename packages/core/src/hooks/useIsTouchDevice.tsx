import { useEffect, useState } from 'react'

import { isTouchDevice } from '../constants/platform'

// ssr friendly

export const useIsTouchDevice = () => {
  const [touchOnly, setTouchOnly] = useState(false)

  if (isTouchDevice) {
    useEffect(() => {
      setTouchOnly(true)
    }, [])
  }

  return touchOnly
}
