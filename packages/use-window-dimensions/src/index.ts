import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
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

export function useWindowDimensions() {
  const next = useWindowDimensionsRN()
  const didFinishSSR = useDidFinishSSR()
  return didFinishSSR ? initialValue : next
}
