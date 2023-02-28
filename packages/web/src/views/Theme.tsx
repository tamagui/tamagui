import { isWeb } from '@tamagui/constants'
import { Children, cloneElement } from 'react'

import { variableToString } from '../createVariable.js'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext.js'
import { useServerRef } from '../hooks/useServerHooks.js'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme.js'
import type { ThemeProps } from '../types.js'

export function Theme(props: ThemeProps) {
  // @ts-expect-error only for internal views
  if (props.disable) return props.children
  const isRoot = !!props['_isRoot']
  const themeState = useChangeThemeEffect(props, isRoot)
  const children = props['data-themeable']
    ? Children.map(props.children, (child) =>
        cloneElement(child, { ['data-themeable']: true })
      )
    : props.children

  return useThemedChildren(themeState, children, props)
}

export function useThemedChildren(
  themeState: ChangedThemeResponse,
  children: any,
  options: {
    forceClassName?: boolean
    shallow?: boolean
    passPropsToChildren?: boolean
  }
) {
  const { themeManager, isNewTheme, className, theme } = themeState
  const { shallow, forceClassName } = options

  const hasEverThemed = useServerRef(false)
  if (isNewTheme) {
    hasEverThemed.current = true
  }

  // once a theme is set it always passes the context to avoid reparenting
  // until then no context to avoid lots of context
  if (!isNewTheme && !hasEverThemed.current && !forceClassName && !shallow) {
    return children
  }

  // be sure to memoize shouldReset to avoid reparenting
  let next = children

  if (shallow && themeManager) {
    next = Children.map(next, (child) => {
      return cloneElement(
        child,
        undefined,
        <Theme name={themeManager.state.parentName}>{child.props.children}</Theme>
      )
    })
  }

  const shouldAttachClassName = isWeb && (forceClassName || isNewTheme)

  // in order to provide currentColor, set color by default
  const themeColor = theme && isNewTheme ? variableToString(theme.color) : ''

  if (theme && shouldAttachClassName && options.passPropsToChildren) {
    next = cloneElement(next, {
      className: (next.props.className ?? '') + ' ' + className,
      style: {
        color: themeColor,
        ...next.props?.style,
      },
    })
  }

  next = (
    <ThemeManagerContext.Provider value={themeManager}>
      {next}
    </ThemeManagerContext.Provider>
  )

  if (forceClassName === false) {
    return next
  }

  if (isWeb && !options.passPropsToChildren) {
    return (
      <span
        className={`${className || ''} _dsp_contents`}
        style={{
          color: themeColor,
        }}
      >
        {next}
      </span>
    )
  }

  return next
}
