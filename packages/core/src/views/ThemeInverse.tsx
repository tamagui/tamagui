import React from 'react'

import { useDefaultThemeName, useThemeName } from '../hooks/useTheme'
import { Theme } from './Theme'

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
  console.log('todo fixme invert', { themeName, defaultTheme, next: name })
  return <Theme name={name}>{props.children}</Theme>
}
