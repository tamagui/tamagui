import { isWeb } from '@tamagui/constants'
import { Children, cloneElement, isValidElement, useEffect, useId, useMemo } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { useServerRef } from '../hooks/useServerHooks'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme'
import type { DebugProp, ThemeProps } from '../types'
import { ThemeDebug } from './ThemeDebug'

export function Theme(props: ThemeProps) {
  // @ts-expect-error only for internal views
  if (props.disable) {
    return props.children
  }

  const isRoot = !!props['_isRoot']
  const themeState = useChangeThemeEffect(props, isRoot)

  let children = props['disable-child-theme']
    ? Children.map(props.children, (child) =>
        cloneElement(child, { ['data-disable-theme']: true })
      )
    : props.children

  if (process.env.NODE_ENV === 'development') {
    if (props.debug === 'visualize') {
      children = (
        <ThemeDebug themeState={themeState} themeProps={props}>
          {children}
        </ThemeDebug>
      )
    }
  }

  return useThemedChildren(themeState, children, props, isRoot)
}

export function useThemedChildren(
  themeState: ChangedThemeResponse,
  children: any,
  props: {
    forceClassName?: boolean
    shallow?: boolean
    passPropsToChildren?: boolean
    debug?: DebugProp
  },
  isRoot = false
) {
  const { themeManager, className, theme, isNewTheme } = themeState
  const { shallow, forceClassName } = props
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

    if (isWeb && !props.passPropsToChildren) {
      // in order to provide currentColor, set color by default
      const themeColor = theme && isNewTheme ? variableToString(theme.color) : ''
      const colorStyle = themeColor
        ? {
            color: themeColor,
          }
        : undefined

      return (
        <span className={`${className || ''} _dsp_contents is_Theme`} style={colorStyle}>
          {wrapped}
        </span>
      )
    }

    return wrapped
  }, [
    forceClassName,
    props.passPropsToChildren,
    shouldRenderChildrenWithTheme,
    themeManager,
    children,
    theme,
    isNewTheme,
    className,
  ])
}
