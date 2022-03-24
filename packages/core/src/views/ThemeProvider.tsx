import React, { useLayoutEffect, useMemo } from 'react'

import { getHasConfigured } from '../conf'
import { GET_DEFAULT_THEME, THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { useIsomorphicLayoutEffect } from '../constants/platform'
import { ThemeContext } from '../ThemeContext'
import { Theme } from './Theme'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type ThemeProviderProps = {
  themes: any
  defaultTheme: string
  disableRootThemeClass?: boolean
  children?: any
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  if (!getHasConfigured()) {
    throw new Error(`Missing configureThemes() call, add to your root file`)
  }

  // ensure theme is attached to root body node as well to work with modals by default
  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      if (props.disableRootThemeClass) {
        return
      }
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      document.body.classList.add(cn)
      return () => {
        document.body.classList.remove(cn)
      }
    }, [])
  }

  const themeContext = useMemo(() => {
    return new Proxy(props.themes, {
      get(target, key) {
        if (key === GET_DEFAULT_THEME) {
          return props.defaultTheme
        }
        return Reflect.get(target, key)
      },
    })
  }, [props.themes])

  return (
    <ThemeContext.Provider value={themeContext}>
      <Theme name={props.defaultTheme} disableThemeClass={props.disableRootThemeClass}>
        {props.children}
      </Theme>
    </ThemeContext.Provider>
  )
}
