import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useId } from 'react'
import { getSetting } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import type { ThemeProviderProps } from '../types'
import { Theme } from './Theme'

export const ThemeProvider = (props: ThemeProviderProps) => {
  'use no memo'

  const addThemeClassName = getSetting('addThemeClassName')

  // ensure theme is attached to root body node as well to work with modals by default
  if (process.env.TAMAGUI_TARGET === 'web') {
    useIsomorphicLayoutEffect(() => {
      if (addThemeClassName === false) return
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target =
        getSetting('addThemeClassName') === 'html'
          ? document.documentElement
          : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, addThemeClassName])
  }

  // we completely disable the className here if its set to any value, 'root', 'body', or false
  // because in all cases we are putting the classname elsewhere
  // if its undefined, then the default behavior applies and we use the className here
  const forceClassName = addThemeClassName === undefined

  return (
    <Theme
      className={props.className}
      name={props.defaultTheme}
      forceClassName={forceClassName}
      // @ts-expect-error
      _isRoot={useId}
    >
      {props.children}
    </Theme>
  )
}
