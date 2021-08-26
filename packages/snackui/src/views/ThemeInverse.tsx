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
  const name = inversions[themeName] || null
  return <Theme name={name}>{props.children}</Theme>
}
