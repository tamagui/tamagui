import React, { useMemo } from 'react'

import { getHasConfigured } from '../conf'
import { GET_DEFAULT_THEME } from '../constants/constants'
import { useIsomorphicLayoutEffect } from '../constants/platform'
import { getThemeParentClassName } from '../helpers/getThemeParentClassName'
import { Theme } from './Theme'
import { ThemeContext } from './ThemeContext'

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
  useIsomorphicLayoutEffect(() => {
    if (props.disableRootThemeClass) {
      return
    }
    if (typeof document !== 'undefined') {
      const cns = getThemeParentClassName(`${props.defaultTheme}`).split(' ')
      cns.forEach((cn) => document.body.classList.add(cn))
      return () => {
        cns.forEach((cn) => document.body.classList.remove(cn))
      }
    }
  }, [])

  const themeContext = useMemo(() => {
    return new Proxy(props.themes, {
      get(target, key) {
        if (key === GET_DEFAULT_THEME) return props.defaultTheme
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
