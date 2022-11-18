import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import React, { useState } from 'react'

import { useDefaultThemeName, useThemeName } from '../hooks/useTheme'
import { Theme } from './Theme'

export type ThemeInverseProps = {
  disable?: boolean
}

const toggleTheme = (themeName: string) => {
  return themeName.startsWith('light') ? 'dark' : 'light'
}

export const useThemeInverse = (props: ThemeInverseProps = {}) => {
  const themeName = useThemeName()
  const defaultTheme = useDefaultThemeName()
  const [name, setName] = useState<null | string>(null)

  if (isWeb) {
    // for SSR must be in effect
    useIsomorphicLayoutEffect(() => {
      setName(toggleTheme(themeName || defaultTheme || ''))
    }, [defaultTheme, themeName])
  }

  return props.disable ? null : name
}

export const ThemeInverse = ({
  children,
  disable,
}: ThemeInverseProps & {
  children: React.ReactNode
}) => {
  const inverseTheme = useThemeInverse({
    disable,
  })
  return <Theme name={inverseTheme}>{children}</Theme>
}
