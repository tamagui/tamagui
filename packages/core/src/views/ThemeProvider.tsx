import React, { useLayoutEffect, useMemo } from 'react'

import { getHasConfigured } from '../conf'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { ThemeContext } from '../contexts/ThemeContext'
import { Theme } from './Theme'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type ThemeProviderProps = {
  className?: string
  themes: any
  defaultTheme: string
  disableRootThemeClass?: boolean
  themeClassNameOnRoot?: boolean
  children?: any
  reset?: boolean
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
      const target = props.themeClassNameOnRoot ? document.documentElement : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, props.disableRootThemeClass, props.themeClassNameOnRoot])
  }

  const themeContext = useMemo(() => {
    return {
      themes: props.themes,
      defaultTheme: props.defaultTheme,
    }
  }, [props.defaultTheme, props.themes])

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
