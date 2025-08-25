import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useId } from 'react'

import { getSetting } from '../config'
import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Theme } from './Theme'

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
    useIsomorphicLayoutEffect(() => {
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
      // we completely disable the className here if its set to any value, 'root', 'body', or false
      // because in all cases we are putting the classname elsewhere
      // if its undefined, then the default behavior applies and we use the className here
      forceClassName={addThemeClassName === undefined}
      // @ts-expect-error
      _isRoot={useId}
    >
      {props.children}
    </Theme>
  )
}
