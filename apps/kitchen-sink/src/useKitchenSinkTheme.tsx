import { createContext, useContext } from 'react'
import type { ColorSchemeName } from 'react-native';
import { Appearance } from 'react-native'

export const ThemeContext = createContext({
  value: Appearance.getColorScheme(),
  set(next: ColorSchemeName) {},
})

export const useThemeControl = () => {
  return useContext(ThemeContext)
}
