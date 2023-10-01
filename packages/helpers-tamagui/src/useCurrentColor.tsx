import {
  ColorTokens,
  UnionableString,
  Variable,
  getVariable,
  useTheme,
} from '@tamagui/web'
import type { TextStyle } from 'react-native'

export const useCurrentColor = (colorProp: ColorProp) => {
  const theme = useTheme()
  const out = getVariable(colorProp || theme[colorProp as any] || theme.color)
  return out
}

export type ColorProp =
  | UnionableString
  | Variable
  | ColorTokens
  | TextStyle['color']
  | undefined
