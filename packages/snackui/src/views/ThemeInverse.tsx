import React from 'react'

import { Theme, useThemeName } from '../hooks/useTheme'

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
  return <Theme name={inversions[themeName] || null}>{props.children}</Theme>
}
