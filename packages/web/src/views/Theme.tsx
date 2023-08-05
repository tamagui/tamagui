import { isWeb } from '@tamagui/constants'
import React, { Children, cloneElement, forwardRef, isValidElement, useRef } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme'
import type { DebugProp, ThemeProps } from '../types'
import { ThemeDebug } from './ThemeDebug'

export const Theme = forwardRef(function Theme(props: ThemeProps, ref) {
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

  if (ref) {
    try {
      React.Children.only(children)
      children = cloneElement(children, { ref })
    } catch {
      //ok
    }
  }

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
})

Theme['avoidForwardRef'] = true

export function useThemedChildren(
  themeState: ChangedThemeResponse,
  children: any,
  props: ThemeProps,
  isRoot = false
) {
  const { themeManager, isNewTheme } = themeState
  const { shallow, forceClassName } = props
  const hasEverThemed = useRef(false)
  if (isNewTheme) {
    hasEverThemed.current = true
  }

  const shouldRenderChildrenWithTheme =
    isNewTheme || props.inverse || hasEverThemed.current || forceClassName || isRoot

  if (!shouldRenderChildrenWithTheme) {
    return children
  }

  // be sure to memoize shouldReset to avoid reparenting

  // each children of these children wont get the theme
  if (shallow && themeManager) {
    let next = Children.toArray(children)
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

  const elementsWithContext = (
    <ThemeManagerContext.Provider value={themeManager}>
      {children}
    </ThemeManagerContext.Provider>
  )

  if (forceClassName === false) {
    return elementsWithContext
  }

  if (isWeb) {
    return wrapThemeElements({
      children: elementsWithContext,
      themeState,
      forceClassName,
      isRoot,
    })
  }

  return elementsWithContext
}

export function wrapThemeElements({
  children,
  themeState,
  forceClassName,
  isRoot,
}: {
  children?: React.ReactNode
  themeState: ChangedThemeResponse
  forceClassName?: boolean
  isRoot?: boolean
}) {
  if (isRoot && forceClassName === false) {
    return children
  }

  if (!themeState.isNewTheme && !themeState.state.inverse && !forceClassName) {
    return <span className="_dsp_contents is_Theme">{children}</span>
  }

  // in order to provide currentColor, set color by default
  const themeColor =
    themeState.state.theme && themeState.isNewTheme
      ? variableToString(themeState.state.theme.color)
      : ''
  const colorStyle = themeColor
    ? {
        color: themeColor,
      }
    : undefined

  let className = themeState.state.className || ''

  if (isRoot) {
    className = className.replace('t_sub_theme', '')
  }

  let themedChildren = (
    <span className={`${className} _dsp_contents is_Theme`} style={colorStyle}>
      {children}
    </span>
  )

  if (themeState.state.inverse) {
    const scheme = themeState.state.name.startsWith('light')
      ? 'light'
      : themeState.state.name.startsWith('dark')
      ? 'dark'
      : ''
    themedChildren = (
      <span className={`t_${scheme} _dsp_contents is_inversed`}>{themedChildren}</span>
    )
  }

  return themedChildren
}
