import React, { useState } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'
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

export const ThemeInverse = ({
  children,
  disable,
}: {
  children: React.ReactNode
  disable?: boolean
}) => {
  const themeName = useThemeName()
  const defaultTheme = useDefaultThemeName()
  const [name, setName] = useState<null | string>(null)

  // ssr
  useIsomorphicLayoutEffect(() => {
    setName(inversions[themeName] || inversions[defaultTheme || ''] || null)
  }, [defaultTheme, themeName])

  if (disable) {
    return children as JSX.Element
  }

  return <Theme name={name}>{children}</Theme>
}
