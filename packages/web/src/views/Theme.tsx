import { isWeb } from '@tamagui/constants'
import { Children, cloneElement, isValidElement, useId, useMemo } from 'react'

import { variableToString } from '../createVariable.js'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext.js'
import { useServerRef } from '../hooks/useServerHooks.js'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme.js'
import type { ThemeProps } from '../types.js'

export function Theme(props: ThemeProps) {
  // @ts-expect-error only for internal views
  if (props.disable) return props.children
  const isRoot = !!props['_isRoot']
  const id = useId()
  const themeState = useChangeThemeEffect(props, isRoot)
  const children = props['data-themeable']
    ? Children.map(props.children, (child) =>
        cloneElement(child, { ['data-themeable']: true })
      )
    : props.children

  return useThemedChildren(themeState, children, props, isRoot)
}

export function useThemedChildren(
  themeState: ChangedThemeResponse,
  children: any,
  options: {
    forceClassName?: boolean
    shallow?: boolean
    passPropsToChildren?: boolean
  },
  isRoot = false
) {
  const { themeManager, className, theme, isNewTheme } = themeState
  const { shallow, forceClassName } = options
  const hasEverThemed = useServerRef(false)
  if (isNewTheme) {
    hasEverThemed.current = true
  }

  const shouldRenderChildrenWithTheme =
    isNewTheme || hasEverThemed.current || forceClassName || isRoot

  return useMemo(() => {
    if (!shouldRenderChildrenWithTheme) {
      return children
    }

    // be sure to memoize shouldReset to avoid reparenting
    let next = Children.toArray(children)

    // each children of these children wont get the theme
    if (shallow && themeManager) {
      next = next.map((child) => {
        return isValidElement(child)
          ? cloneElement(
              child,
              undefined,
              <Theme name={themeManager.state.parentName}>
                {(child as any).props.children}
              </Theme>
            )
          : child
      })
    }

    const wrapped = (
      <ThemeManagerContext.Provider value={themeManager}>
        {next}
      </ThemeManagerContext.Provider>
    )

    if (forceClassName === false) {
      return wrapped
    }

    if (isWeb && !options.passPropsToChildren) {
      // in order to provide currentColor, set color by default
      const themeColor = theme && isNewTheme ? variableToString(theme.color) : ''
      const colorStyle = {
        color: themeColor,
      }

      return (
        <span className={`${className || ''} _dsp_contents is_Theme`} style={colorStyle}>
          {wrapped}
        </span>
      )
    }

    return wrapped
  }, [themeManager, children, theme, isNewTheme, className])
}
