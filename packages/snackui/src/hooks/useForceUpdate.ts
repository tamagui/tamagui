import { useState } from 'react'

import { useConstant } from './useConstant'

export function useForceUpdate() {
  const setState = useState(0)[1]
  return useConstant(() => {
    return () => setState(Math.random())
  })
}
