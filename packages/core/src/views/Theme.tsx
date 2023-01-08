import { isWeb } from '@tamagui/constants'
import React, { Children, cloneElement, useMemo } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManager } from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { useServerRef } from '../hooks/useServerHooks'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme'
import { ThemeParsed, ThemeProps } from '../types'

export function Theme(props: ThemeProps) {
  // @ts-expect-error only for internal views
  if (props.disable) {
    return props.children
  }

  const isRoot = !!props['_isRoot']
  const themeState = useChangeThemeEffect(props, isRoot)
  const disableThemeClass = props.disableThemeClass

  // memo here, changing theme without re-rendering all children is a critical optimization
  // may require some effort of end user to memoize but without this memo they'd have no option
  const children = props['data-themeable']
    ? Children.map(props.children, (child) =>
        cloneElement(child, { ['data-themeable']: true })
      )
    : props.children

  return useThemedChildren(themeState, {
    children,
    disableThemeClass,
  })
}

export function useThemedChildren(
  { themeManager, isNewTheme, className, theme }: ChangedThemeResponse,
  { children, disableThemeClass }: { children: any; disableThemeClass?: boolean }
) {
  const hasEverThemed = useServerRef(false)
  if (isNewTheme) {
    hasEverThemed.current = true
  }

  // once a theme is set it always passes the context to avoid reparenting
  if (!isNewTheme && !hasEverThemed.current) {
    return children
  }

  // be sure to memoize shouldReset to avoid reparenting
  let next = children

  // TODO likely not necessary if we do reset logic now in useTheme?
  // reset to parent theme
  // if (shouldReset && themeManager) {
  //   next = <Theme name={themeManager.state.parentName}>{next}</Theme>
  // }

  next = (
    <ThemeManagerContext.Provider value={themeManager}>
      {next}
    </ThemeManagerContext.Provider>
  )

  if (isWeb) {
    if (theme && isNewTheme && !disableThemeClass) {
      return (
        <span
          className={`${className} _dsp_contents`}
          style={{
            // in order to provide currentColor, set color by default
            color: variableToString(theme.color),
          }}
        >
          {next}
        </span>
      )
    } else {
      // avoid re-parenting
      return <span className="_dsp_contents">{next}</span>
    }
  }

  return next
}
