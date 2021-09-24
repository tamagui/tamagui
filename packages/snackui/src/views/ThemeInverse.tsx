import React from 'react'

import { Theme, useThemeName, useDefaultThemeName } from '../hooks/useTheme'

type StringRecord = { [key: string]: string }

let inversions: StringRecord = {
  light: 'dark',
  dark: 'light',
}

export function setThemeInversions(next: StringRecord) {
  inversions = next
}

export const ThemeInverse = (props: { children: any }) => {
  const themeName = useThemeName()
  const defaultTheme = useDefaultThemeName()
  const name = inversions[themeName] || inversions[defaultTheme] || null
  return <Theme name={name}>{props.children}</Theme>
}
