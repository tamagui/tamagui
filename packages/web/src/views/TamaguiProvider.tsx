import { isClient, isRSC, isServer, isWeb } from '@tamagui/constants'
import * as React from 'react'

import { ButtonNestingContext } from '../contexts/ButtonNestingContext.js'
import { TextAncestorContext } from '../contexts/TextAncestorContext.js'
import { useMediaListeners } from '../hooks/useMedia.js'
import type { TamaguiProviderProps } from '../types.js'
import { ThemeProvider } from './ThemeProvider.js'
import { AnimationDriverContext } from '../contexts/AnimationDriverContext.js'

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
    <ButtonNestingContext.Provider value={false}>
      <TextAncestorContext.Provider value={false}>
        <AnimationDriverContext.Provider value={config.animations}>
          <ThemeProvider
            themeClassNameOnRoot={config.themeClassNameOnRoot}
            disableRootThemeClass={config.disableRootThemeClass}
            {...themePropsProvider}
            defaultTheme={
              themePropsProvider.defaultTheme ?? Object.keys(config.themes)[0]
            }
          >
            {children}
          </ThemeProvider>
        </AnimationDriverContext.Provider>
      </TextAncestorContext.Provider>
    </ButtonNestingContext.Provider>
  )
}
