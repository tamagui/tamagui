import { isWeb } from '@tamagui/constants'
import { Children, cloneElement } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { useServerRef } from '../hooks/useServerHooks'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme'
import { ThemeProps } from '../types'

export function Theme(props: ThemeProps) {
  // @ts-expect-error only for internal views
  if (props.disable) {
    return props.children
  }

  const isRoot = !!props['_isRoot']
  const themeState = useChangeThemeEffect(props, isRoot)

  // memo here, changing theme without re-rendering all children is a critical optimization
  // may require some effort of end user to memoize but without this memo they'd have no option
  const children = props['data-themeable']
    ? Children.map(props.children, (child) =>
        cloneElement(child, { ['data-themeable']: true })
      )
    : props.children

  return useThemedChildren(themeState, children, props)
}

export function useThemedChildren(
  { themeManager, isNewTheme, className, theme }: ChangedThemeResponse,
  children: any,
  { shallow, forceClassName }: { forceClassName?: boolean; shallow?: boolean }
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

  if (shallow && themeManager) {
    next = <Theme name={themeManager.state.parentName}>{next}</Theme>
  }

  next = (
    <ThemeManagerContext.Provider value={themeManager}>
      {next}
    </ThemeManagerContext.Provider>
  )

  if (isWeb) {
    const enableClassName =
      forceClassName === true || (forceClassName !== false && isNewTheme)
    return (
      <span
        className="_dsp_contents"
        {...(theme &&
          enableClassName && {
            className: `${className} _dsp_contents`,
            style: {
              // in order to provide currentColor, set color by default
              color: variableToString(theme.color),
            },
          })}
      >
        {next}
      </span>
    )
  }

  return next
}
