import { isClient, isServer, isWeb } from '@tamagui/constants'
import * as React from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import { useMediaListeners } from '../hooks/useMedia'
import type { TamaguiProviderProps } from '../types'
import { ThemeProvider } from './ThemeProvider'

export function TamaguiProvider({
  children,
  disableInjectCSS,
  config,
  ...themePropsProvider
}: TamaguiProviderProps) {
  if (!(isWeb && isServer)) {
    useMediaListeners(config)
  }

  if (isClient) {
    // inject CSS if asked to (not SSR compliant)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(() => {
      // for easier support of hidden-until-js mount animations
      // user must set t_unmounted on documentElement from SSR
      if (document.documentElement.classList.contains('t_unmounted')) {
        document.documentElement.classList.remove('t_unmounted')
      }

      if (disableInjectCSS) return
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(config.getCSS()))
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }, [config, disableInjectCSS])
  }

  return (
    <ComponentContext.Provider animationDriver={config.animations}>
      <ThemeProvider
        themeClassNameOnRoot={config.themeClassNameOnRoot}
        disableRootThemeClass={config.disableRootThemeClass}
        {...themePropsProvider}
        defaultTheme={themePropsProvider.defaultTheme ?? Object.keys(config.themes)[0]}
      >
        {children}
      </ThemeProvider>
    </ComponentContext.Provider>
  )
}
