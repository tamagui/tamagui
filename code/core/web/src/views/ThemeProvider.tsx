import React from 'react'
import { isClient } from '@tamagui/constants'

import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Theme } from './Theme'
import { getSetting } from '../config'

export type ThemeProviderProps = {
  className?: string
  defaultTheme: string
  /** @deprecated moved to createTamagui({ settings: { disableRootThemeClass } }) */
  disableRootThemeClass?: boolean
  /** @deprecated moved to createTamagui({ settings: { themeClassNameOnRoot } }) */
  themeClassNameOnRoot?: boolean
  children?: any
  reset?: boolean
}

export const ThemeProvider = (props: ThemeProviderProps) => {
  // ensure theme is attached to root body node as well to work with modals by default
  if (isClient) {
    React.useLayoutEffect(() => {
      if (props.disableRootThemeClass) return
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target =
        (props.themeClassNameOnRoot ?? getSetting('themeClassNameOnRoot'))
          ? document.documentElement
          : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, props.disableRootThemeClass, props.themeClassNameOnRoot])
  }

  return (
    <Theme
      className={props.className}
      name={props.defaultTheme}
      // if root class disabled, force class here
      forceClassName={!props.disableRootThemeClass}
      // @ts-expect-error
      _isRoot
    >
      {props.children}
    </Theme>
  )
}
