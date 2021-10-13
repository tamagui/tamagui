import React, { useMemo } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { getHasConfigured, getThemeParentClassName } from '../createTamagui'
import { Theme } from './Theme'
import { ThemeContext } from './ThemeContext'

export type ThemeProviderProps = {
  themes: any
  defaultTheme: string
  disableRootThemeClass?: boolean
  children?: any
}

export const GET_DEFAULT_THEME = '___TGUI'

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

  return (
    <ThemeContext.Provider
      value={useMemo(() => {
        return new Proxy(props.themes, {
          get(target, key) {
            if (key === GET_DEFAULT_THEME) return props.defaultTheme
            return Reflect.get(target, key)
          },
        })
      }, [props.themes])}
    >
      <Theme name={props.defaultTheme} disableThemeClass={props.disableRootThemeClass}>
        {props.children}
      </Theme>
    </ThemeContext.Provider>
  )
}
