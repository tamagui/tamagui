import { isClient, isRSC, isServer, isWeb } from '@tamagui/constants'
import * as React from 'react'

import { ButtonNestingContext } from '../contexts/ButtonNestingContext'
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
      <span
        style={{ display: 'contents' }}
        className={`t_${Object.keys(config.themes)[0] || 'light'}`}
      >
        {children}
      </span>
    )
  }

  if (!isWeb || !isServer) {
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
    <ButtonNestingContext.Provider value={false}>
      <TextAncestorContext.Provider value={false}>
        <ThemeProvider
          themeClassNameOnRoot={config.themeClassNameOnRoot}
          disableRootThemeClass={config.disableRootThemeClass}
          {...themePropsProvider}
          defaultTheme={themePropsProvider.defaultTheme ?? Object.keys(config.themes)[0]}
        >
          {children}
        </ThemeProvider>
      </TextAncestorContext.Provider>
    </ButtonNestingContext.Provider>
  )
}
