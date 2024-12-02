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
  const addThemeClassName = getSetting('addThemeClassName')

  // ensure theme is attached to root body node as well to work with modals by default
  if (isClient) {
    React.useLayoutEffect(() => {
      if (addThemeClassName === false) return
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target =
        getSetting('addThemeClassName') === 'body'
          ? document.documentElement
          : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, addThemeClassName])
  }

  return (
    <Theme
      className={props.className}
      name={props.defaultTheme}
      // if root class disabled, force class here
      forceClassName={addThemeClassName !== false}
      // @ts-expect-error
      _isRoot
    >
      {props.children}
    </Theme>
  )
}
