import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useId } from 'react'

import { getSetting } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Theme } from './Theme'

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
  const disableRootThemeClass =
    props.disableRootThemeClass ?? getSetting('disableRootThemeClass')
  const themeClassNameOnRoot =
    props.themeClassNameOnRoot ?? getSetting('themeClassNameOnRoot')

  // ensure theme is attached to root body node as well to work with modals by default
  if (isClient) {
    useIsomorphicLayoutEffect(() => {
      if (disableRootThemeClass) return
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target = themeClassNameOnRoot ? document.documentElement : document.body
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
      forceClassName={!disableRootThemeClass && !themeClassNameOnRoot}
      // @ts-expect-error
      _isRoot={useId}
    >
      {props.children}
    </Theme>
  )
}
