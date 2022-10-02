import { isClient } from '@tamagui/constants'
import React, { useLayoutEffect, useMemo } from 'react'

import { getConfig, getHasConfigured } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { ThemeContext } from '../contexts/ThemeContext'
import { Theme } from './Theme'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type ThemeProviderProps = {
  className?: string
  defaultTheme: string
  disableRootThemeClass?: boolean
  themeClassNameOnRoot?: boolean
  children?: any
  reset?: boolean
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  if (process.env.NODE_ENV === 'development') {
    if (!getHasConfigured()) {
      throw new Error(`Missing configureThemes() call, add to your root file`)
    }
  }

  // ensure theme is attached to root body node as well to work with modals by default
  if (isClient) {
    useLayoutEffect(() => {
      if (props.disableRootThemeClass) {
        return
      }
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target = props.themeClassNameOnRoot ? document.documentElement : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, props.disableRootThemeClass, props.themeClassNameOnRoot])
  }

  const themeContext = useMemo(() => {
    return {
      get themes() {
        return getConfig().themes
      },
      defaultTheme: props.defaultTheme,
    }
  }, [props.defaultTheme])

  return (
    <ThemeContext.Provider value={themeContext}>
      <Theme
        className={props.className}
        name={props.defaultTheme}
        disableThemeClass={props.disableRootThemeClass}
      >
        {props.children}
      </Theme>
    </ThemeContext.Provider>
  )
}
