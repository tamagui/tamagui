import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useState } from 'react'
import { ScaledSize, useWindowDimensions as useWindowDimensionsRN } from 'react-native'

/**
 * SSR safe useWindowDimensions
 */

const initialValue: ScaledSize = {
  fontScale: 1,
  height: 800,
  width: 600,
  scale: 1,
}

export function configureInitialWindowDimensions(next: Partial<ScaledSize>) {
  Object.assign(initialValue, next)
}

export function useWindowDimensions({ initial }: { initial?: Partial<ScaledSize> } = {}) {
  const current = useWindowDimensionsRN()

  if (process.env.TAMAGUI_TARGET != 'web') {
    return current
  }

  const [state, setState] = useState(
    initial ? { ...initialValue, ...initial } : initialValue
  )

  useIsomorphicLayoutEffect(() => {
    setState(current)
  }, Object.values(current))

  return state
}
