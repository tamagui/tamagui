import { createContext, useContext, useState } from 'react'
import { Appearance, ColorSchemeName } from 'react-native'

export const ThemeContext = createContext({
  value: Appearance.getColorScheme(),
  set(next: ColorSchemeName) {},
})

export const useThemeControl = () => {
  return useContext(ThemeContext)
}
