import type { ScaledSize } from 'react-native'

export type Size = {
  width: number
  height: number
}

export type WindowSize = ScaledSize

export type WindowSizeListener = (size: WindowSize) => void
