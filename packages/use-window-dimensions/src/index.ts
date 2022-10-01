import { useState } from 'react'
import { ScaledSize, useWindowDimensions as useWindowDimensionsRN } from 'react-native'

/**
 * SSR safe useWindowDimensions
 */

let lastKnownValue: ScaledSize = {
  fontScale: 1,
  height: 800,
  width: 600,
  scale: 1,
}

export function useWindowDimensions() {
  const next = useWindowDimensionsRN()
  const [current, setCurrent] = useState(lastKnownValue)

  if (next !== current) {
    setCurrent(next)
    lastKnownValue = next
  }

  return current
}
