import React from 'react'
import { isClient } from '@tamagui/constants'

import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Theme } from './Theme'
import { getSetting } from '../config'

export type ThemeProviderProps = {
  className?: string
  defaultTheme: string
  children?: any
  reset?: boolean
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  const disableRootThemeClass = getSetting('disableRootThemeClass')
  const themeClassNameOnRoot = getSetting('themeClassNameOnRoot')

  // ensure theme is attached to root body node as well to work with modals by default
  if (isClient) {
    React.useLayoutEffect(() => {
      if (disableRootThemeClass) return
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target =
        (themeClassNameOnRoot ?? getSetting('themeClassNameOnRoot'))
          ? document.documentElement
          : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, disableRootThemeClass, themeClassNameOnRoot])
  }

  return (
    <Theme
      className={props.className}
      name={props.defaultTheme}
      // if root class disabled, force class here
      forceClassName={!disableRootThemeClass}
      // @ts-expect-error
      _isRoot
    >
      {props.children}
    </Theme>
  )
}
