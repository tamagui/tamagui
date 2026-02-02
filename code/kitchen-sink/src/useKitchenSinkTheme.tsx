import React from 'react'
import type { ColorSchemeName } from 'react-native'
import { Appearance } from 'react-native'

export type ThemeMode = 'system' | 'light' | 'dark'

export const ThemeContext = React.createContext({
  mode: 'system' as ThemeMode,
  resolvedTheme: Appearance.getColorScheme() as ColorSchemeName,
  set(next: ThemeMode) {},
})

export const useThemeControl = () => {
  return React.useContext(ThemeContext)
}
