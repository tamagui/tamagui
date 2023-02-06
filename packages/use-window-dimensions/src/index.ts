import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useState } from 'react'
import {
  ScaledSize,
  useWindowDimensions as useWindowDimensionsRN
} from 'react-native'

/**
 * SSR safe useWindowDimensions
 */

const initialValue: ScaledSize = {
  fontScale: 1,
  height: 800,
  width: 600,
  scale: 1,
}

export function useWindowDimensions() {
  const current = useWindowDimensionsRN()
  
  if (process.env.TAMAGUI_TARGET != 'web') return current
  
  const [state, setState] = useState(initialValue)

  useIsomorphicLayoutEffect(() => {
    setState(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.height, current.width, current.fontScale, current.scale])

  return state
}
