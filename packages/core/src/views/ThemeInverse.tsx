import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React, { useState } from 'react'

import { useDefaultThemeName, useThemeName } from '../hooks/useTheme'
import { Theme } from './Theme'

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
    if (themeName.startsWith('dark')) {
      setName('light')
    } else if (themeName.startsWith('light')) {
      setName('dark')
    }
  }, [defaultTheme, themeName])

  if (disable) {
    return children as JSX.Element
  }

  return <Theme name={name}>{children}</Theme>
}
