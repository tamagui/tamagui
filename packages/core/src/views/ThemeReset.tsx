import React, { useContext, useLayoutEffect, useState } from 'react'

import { ThemeManagerContext } from '../ThemeManager'
import { Theme } from './Theme'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

// resets the theme to the parent theme
export const ThemeReset = (props: { children?: any }) => {
  const themeManager = useContext(ThemeManagerContext)
  const [name, setName] = useState<string | null>(null)

  // this component doesn't work with SSR, so must run only client side
  // we could at least prevent more flickering by having the ssr head script
  // that changes to dark initially also go through and change all of these

  if (typeof document !== 'undefined') {
    useLayoutEffect(() => {
      if (name !== themeManager.parentName) {
        setName(themeManager.parentName)
      }
    }, [themeManager.parentName])

    useLayoutEffect(() => {
      return themeManager.onChangeTheme(() => {
        setName(themeManager.parentName)
      })
    }, [])
  }

  if (!themeManager || !props.children) {
    return props.children || null
  }

  return (
    <Theme className="tui-theme-reset" name={name}>
      {props.children}
    </Theme>
  )
}
