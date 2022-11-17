import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React, { useState } from 'react'
import { Platform } from 'react-native'

import { useDefaultThemeName, useThemeName } from '../hooks/useTheme'
import { Theme } from './Theme'

const toggleTheme = (themeName: string) => {
  if (themeName.startsWith('dark')) {
    return 'light'
  } else if (themeName.startsWith('light')) {
    return 'dark'
  }
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
  
  const themeWithFallback = themeName || defaultThemeName
  
  const [webThemeName, setWebThemeName] = useState<null | string>(null)

  // ssr 
  // it's ok to break this rule of hooks
  if (Platform.OS == 'web') {
    useIsomorphicLayoutEffect(() => {
      if (themeWithFallback.startsWith('dark')) {
        setWebThemeName('light')
      } else if (themeWithFallback.startsWith('light')) {
        setWebThemeName('dark')
      }
    }, [themeWithFallback])
  }

  return (
    <Theme 
      name={Platform.select({ 
        web: webThemeName, 
        default: disabled ? themeWithFallback : toggleTheme(themeWithFallback) || themeWithFallback
      })}
    >
      {children}
    </Theme>
  )
}
