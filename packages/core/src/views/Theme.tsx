import React, { memo, useMemo } from 'react'

import { isWeb } from '../constants/platform'
import { wrapThemeManagerContext } from '../helpers/wrapThemeManagerContext'
import { useChangeThemeEffect } from '../hooks/useTheme'
import { ThemeName } from '../types'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type ThemeProps = {
  className?: string
  disableThemeClass?: boolean
  name: Exclude<ThemeName, number> | null
  componentName?: string
  children?: any
  debug?: boolean
}

export const Theme = memo(function Theme(props: ThemeProps) {
  const { name, theme, themeManager, themes, className } = useChangeThemeEffect(
    props.name,
    props.componentName,
    props
  )

  if (!themes || !name || !theme) {
    if (name && !theme && process.env.NODE_ENV === 'development') {
      console.warn(`No theme found by name ${name}`)
    }
    return props.children
  }

  // memo here, changing theme without re-rendering all children is a critical optimization
  // may require some effort of end user to memoize but without this memo they'd have no option
  const contents = useMemo(
    () => wrapThemeManagerContext(props.children, themeManager),
    [props.children, themeManager]
  )

  if (props.componentName === 'Drawer') {
    console.log('ok?', className, themeManager)
  }

  if (isWeb) {
    return (
      <span
        className={[
          `tui_Theme`,
          ...(!props.disableThemeClass ? [props.className, className].filter(Boolean) : []),
        ].join(' ')}
        style={{
          display: 'contents',
          // in order to provide currentColor, set color by default
          color: themes[name]?.color?.toString(),
        }}
      >
        {contents}
      </span>
    )
  }

  return contents
})
