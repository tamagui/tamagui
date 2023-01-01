import { isClient } from '@tamagui/constants'
import { createContext, useLayoutEffect, useMemo } from 'react'

import { THEME_CLASSNAME_PREFIX } from '../constants/constants'
import { Theme } from './Theme'

export type ThemeProviderProps = {
  className?: string
  defaultTheme: string
  disableRootThemeClass?: boolean
  themeClassNameOnRoot?: boolean
  children?: any
  reset?: boolean
}

export const ThemeProviderRootContext = createContext<Pick<
  ThemeProviderProps,
  'defaultTheme'
> | null>(null)

export const ThemeProvider = (props: ThemeProviderProps) => {
  // ensure theme is attached to root body node as well to work with modals by default
  if (isClient) {
    useLayoutEffect(() => {
      if (props.disableRootThemeClass) return
      const cn = `${THEME_CLASSNAME_PREFIX}${props.defaultTheme}`
      const target = props.themeClassNameOnRoot ? document.documentElement : document.body
      target.classList.add(cn)
      return () => {
        target.classList.remove(cn)
      }
    }, [props.defaultTheme, props.disableRootThemeClass, props.themeClassNameOnRoot])
  }

  return (
    <ThemeProviderRootContext.Provider
      value={useMemo(() => {
        return {
          defaultTheme: props.defaultTheme,
        }
        // NOTE DON'T CHANGE THIS ITS ONLY USED BY useThemeName for SSR safety for now...
      }, [])}
    >
      <Theme
        className={props.className}
        name={props.defaultTheme}
        disableThemeClass={props.disableRootThemeClass}
        // @ts-expect-error
        _isRoot
      >
        {props.children}
      </Theme>
    </ThemeProviderRootContext.Provider>
  )
}
