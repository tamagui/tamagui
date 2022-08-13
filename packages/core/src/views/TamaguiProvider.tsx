import * as React from 'react'

import { getConfig } from '../conf'
import { isClient, isSSR } from '../constants/platform'
import { ButtonInsideButtonContext } from '../contexts/ButtonInsideButtonContext'
import { TextAncestorProvider } from '../contexts/TextAncestorContext'
import { useMediaQueryListeners } from '../hooks/useMedia'
import type { TamaguiProviderProps } from '../types'
import { ThemeProvider } from './ThemeProvider'

// @ts-ignore
const isRSC = process.env.ENABLE_RSC ? import.meta.env.SSR : false

export function TamaguiProvider({
  children,
  disableInjectCSS,
  config,
  ...themePropsProvider
}: TamaguiProviderProps) {
  if (isRSC) {
    return <>{children}</>
  }

  if (!isSSR) {
    useMediaQueryListeners()
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
          themes={config.themes}
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
