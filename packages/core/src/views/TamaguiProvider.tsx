import * as React from 'react'

import { isClient, isRSC, isServer } from '../constants/platform'
import { ButtonInsideButtonContext } from '../contexts/ButtonInsideButtonContext'
import { TextAncestorProvider } from '../contexts/TextAncestorContext'
import { useMediaQueryListeners } from '../hooks/useMedia'
import type { TamaguiProviderProps } from '../types'
import { ThemeProvider } from './ThemeProvider'

export function TamaguiProvider({
  children,
  disableInjectCSS,
  config,
  ...themePropsProvider
}: TamaguiProviderProps) {
  if (isRSC) {
    return (
      <span style={{ display: 'contents' }} className={`t_${config.defaultTheme || 'light'}`}>
        {children}
      </span>
    )
  }

  if (!isServer) {
    useMediaQueryListeners(config)
  }

  if (isClient) {
    // inject CSS if asked to (not SSR compliant)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useLayoutEffect(() => {
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
    <ButtonInsideButtonContext.Provider value={false}>
      <TextAncestorProvider>
        <ThemeProvider
          defaultTheme={config.defaultTheme || 'light'}
          themeClassNameOnRoot={config.themeClassNameOnRoot}
          disableRootThemeClass={config.disableRootThemeClass}
          {...themePropsProvider}
        >
          {children}
        </ThemeProvider>
      </TextAncestorProvider>
    </ButtonInsideButtonContext.Provider>
  )
}
