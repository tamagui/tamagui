import React from 'react'

import { isWeb } from '../constants/platform'
import { getThemeParentClassName } from '../helpers/getThemeParentClassName'
import { useChangeThemeEffect } from '../static'
import { ThemeManagerContext } from '../ThemeManager'
import { ThemeName } from '../types'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type ThemeProps = {
  disableThemeClass?: boolean
  name: Exclude<ThemeName, number> | null
  children?: any
}

export const Theme = (props: ThemeProps) => {
  const { name, theme, themeManager, themes, className } = useChangeThemeEffect(props.name)

  if (!themes) {
    console.warn('Error, no themes in context', props)
    return props.children
  }

  if (!name || !theme) {
    if (process.env.NODE_ENV === 'development' && name && !theme) {
      console.warn(`No theme found by name ${name}`)
    }
    return props.children
  }

  const contents = themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>
      {props.children}
    </ThemeManagerContext.Provider>
  ) : (
    props.children
  )

  if (isWeb) {
    if (props.disableThemeClass) {
      return contents
    }
    // console.log('??', className, 'is wrong light-blue when should be dark-blue')
    return (
      <div
        className={getThemeParentClassName(props.name)}
        style={{
          display: 'contents',
          // in order to provide currentColor, set color by default
          color: themes[name]?.color?.toString(),
        }}
      >
        {contents}
      </div>
    )
  }

  return contents
}
