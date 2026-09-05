import type { ScaledSize } from '@tamagui/react-native-types'

export type Size = {
  width: number
  height: number
}

export type WindowSize = ScaledSize

export type WindowSizeListener = (size: WindowSize) => void
