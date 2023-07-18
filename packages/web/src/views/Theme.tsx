import { isWeb } from '@tamagui/constants'
import React, { Children, cloneElement, forwardRef, isValidElement, useMemo } from 'react'

import { variableToString } from '../createVariable'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { useServerRef } from '../hooks/useServerHooks'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme'
import type { DebugProp, ThemeProps } from '../types'
import { ThemeDebug } from './ThemeDebug'

export const Theme = forwardRef((props: ThemeProps, ref) => {
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
  props: {
    forceClassName?: boolean
    shallow?: boolean
    passPropsToChildren?: boolean
    debug?: DebugProp
  },
  isRoot = false
) {
  const { themeManager, isNewTheme } = themeState
  const { shallow, forceClassName } = props
  const hasEverThemed = useServerRef(false)
  if (isNewTheme) {
    hasEverThemed.current = true
  }

  const shouldRenderChildrenWithTheme =
    isNewTheme || hasEverThemed.current || forceClassName || isRoot

  const childrenMemo = useMemo(() => children, [children])

  if (!shouldRenderChildrenWithTheme) {
    return childrenMemo
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
      {childrenMemo}
    </ThemeManagerContext.Provider>
  )

  if (forceClassName === false) {
    return elementsWithContext
  }

  if (isWeb && !props.passPropsToChildren) {
    return wrapThemeElements({
      children: elementsWithContext,
      themeState,
    })
  }

  return elementsWithContext
}

export function wrapThemeElements({
  children,
  themeState,
}: {
  children?: React.ReactNode
  themeState: ChangedThemeResponse
}) {
  if (!themeState.isNewTheme) {
    return <span className="_dsp_contents is_Theme">{children}</span>
  }

  // in order to provide currentColor, set color by default
  const themeColor =
    themeState.theme && themeState.isNewTheme
      ? variableToString(themeState.theme.color)
      : ''
  const colorStyle = themeColor
    ? {
        color: themeColor,
      }
    : undefined

  const parentScheme = themeState.themeManager?.parentManager?.scheme
  const scheme = themeState.themeManager?.scheme
  const isInversing = scheme && parentScheme && scheme !== parentScheme
  const className = themeState.className || ''

  let themedChildren = (
    <span className={`${className} _dsp_contents is_Theme`} style={colorStyle}>
      {children}
    </span>
  )

  if (isInversing) {
    themedChildren = (
      <span className={`t_${scheme} _dsp_contents is_inversed`}>{themedChildren}</span>
    )
  }

  return themedChildren
}
