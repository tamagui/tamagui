import { isWeb } from '@tamagui/constants'
import React, { Children, cloneElement, useMemo } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManager } from '../helpers/ThemeManager'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { useChangeThemeEffect } from '../hooks/useTheme'
import { ThemeProps } from '../types'

export function Theme(props: ThemeProps) {
  // @ts-expect-error only for internal views
  if (props.disable) {
    return props.children
  }

  const isRoot = !!props['_isRoot']
  const { name, theme, themeManager, className } = useChangeThemeEffect(props, isRoot)
  const disableThemeClass = props.disableThemeClass
  const missingTheme = !(name && theme)

  // memo here, changing theme without re-rendering all children is a critical optimization
  // may require some effort of end user to memoize but without this memo they'd have no option
  let contents = useThemeManagerContext(
    props['data-themeable']
      ? Children.map(props.children, (child) =>
          cloneElement(child, { ['data-themeable']: true })
        )
      : props.children,
    themeManager
  )

  if (process.env.NODE_ENV === 'development' && missingTheme) {
    // eslint-disable-next-line no-console
    name && !theme && console.warn(`No theme found by name ${name}`)
    return props.children
  }

  if (disableThemeClass || missingTheme) {
    return contents
  }

  if (isWeb) {
    const cn = [props.className, className, '_dsp_contents'].filter(Boolean).join(' ')
    contents = (
      <span
        className={cn}
        style={{
          // in order to provide currentColor, set color by default
          color: variableToString(theme?.color),
        }}
      >
        {contents}
      </span>
    )
  }

  return contents
}

export function useThemeManagerContext(
  children: any,
  themeManager?: ThemeManager | null,
  shouldReset?: boolean
) {
  // disabled super memoize it - listener first strategy
  const value = themeManager // useMemo(() => themeManager, [!!themeManager])
  // be sure to memoize themeManager to avoid reparenting
  if (!value) return children
  // be sure to memoize shouldReset to avoid reparenting
  let next = children
  // TODO likely not necessary if we do reset logic now in useTheme?
  // reset to parent theme
  if (shouldReset && themeManager) {
    next = <Theme name={themeManager.state.parentName}>{next}</Theme>
  }
  return <ThemeManagerContext.Provider value={value}>{next}</ThemeManagerContext.Provider>
}
