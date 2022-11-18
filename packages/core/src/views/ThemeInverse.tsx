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
  const curName = themeName || defaultTheme || ''

  if (isWeb) {
    // for SSR must be in effect
    useIsomorphicLayoutEffect(() => {
      setName(toggleTheme(curName))
    }, [defaultTheme, themeName])

    return props.disable ? null : name
  }

  return props.disable ? null : toggleTheme(curName)
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
