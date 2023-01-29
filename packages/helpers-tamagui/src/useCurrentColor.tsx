import {
  ColorTokens,
  UnionableString,
  Variable,
  useTheme,
  variableToString,
} from '@tamagui/core'
import type { TextStyle } from 'react-native'

export const useCurrentColor = (colorProp: ColorProp) => {
  const theme = useTheme()
  return variableToString(theme[colorProp as any] || colorProp || theme.color)
}

export type ColorProp =
  | UnionableString
  | Variable
  | ColorTokens
  | TextStyle['color']
  | undefined
