import { isClient, isRSC, isServer } from '@tamagui/constants'
import * as React from 'react'

import { ButtonInsideButtonContext } from '../contexts/ButtonInsideButtonContext'
import { TextAncestorContext } from '../contexts/TextAncestorContext'
import { useMediaListeners } from '../hooks/useMedia'
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
    useMediaListeners(config)
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
      <TextAncestorContext.Provider value={false}>
        <ThemeProvider
          defaultTheme={config.defaultTheme || 'light'}
          themeClassNameOnRoot={config.themeClassNameOnRoot}
          disableRootThemeClass={config.disableRootThemeClass}
          {...themePropsProvider}
        >
          {children}
        </ThemeProvider>
      </TextAncestorContext.Provider>
    </ButtonInsideButtonContext.Provider>
  )
}
