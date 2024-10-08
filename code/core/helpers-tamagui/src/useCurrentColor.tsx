import type { ColorTokens, UnionableString, Variable } from '@tamagui/web'
import { getVariable, useTheme } from '@tamagui/web'
import type { TextStyle } from 'react-native'

export const useCurrentColor = (colorProp: ColorProp) => {
  const theme = useTheme()
  const out = getVariable(
    // TODO can remove 'web' here, will return DynamicColor for iOS for ListItem icons, which is supported in newer react-native-svg versions
    colorProp || theme[colorProp as any]?.get('web') || theme.color?.get('web')
  )
  return out
}

export type ColorProp =
  | UnionableString
  | Variable
  | ColorTokens
  | TextStyle['color']
  | undefined
