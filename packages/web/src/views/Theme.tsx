import { isWeb } from '@tamagui/constants'
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { variableToString } from '../createVariable'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import { ChangedThemeResponse, useChangeThemeEffect } from '../hooks/useTheme'
import type { ThemeProps } from '../types'
import { ThemeDebug } from './ThemeDebug'

export const Theme = forwardRef(function Theme(props: ThemeProps, ref) {
  // @ts-expect-error only for internal views
  if (props.disable) {
    return props.children
  }

  const isRoot = !!props['_isRoot']
  const disableDirectChildTheme = props['disable-child-theme']
  const themeState = useChangeThemeEffect(props, isRoot)

  const children = useMemo(() => {
    let children = disableDirectChildTheme
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

    return children
  }, [props.children, disableDirectChildTheme])

  return useThemedChildren(themeState, children, props, isRoot)
})

Theme['avoidForwardRef'] = true

export function useThemedChildren(
  themeState: ChangedThemeResponse,
  children: any,
  props: ThemeProps,
  isRoot = false,
  avoidWrap = false
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

  let next = children

  // each children of these children wont get the theme
  if (shallow && themeManager) {
    next = Children.toArray(children).map((child) => {
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

  const elementsWithContext = themeManager ? (
    <ThemeManagerContext.Provider value={themeManager}>
      {next}
    </ThemeManagerContext.Provider>
  ) : (
    next
  )

  if (forceClassName === false) {
    return elementsWithContext
  }

  if (isWeb && !avoidWrap) {
    return wrapThemeElements({
      children: elementsWithContext,
      themeState,
      forceClassName,
      isRoot,
    })
  }

  return elementsWithContext
}

function wrapThemeElements({
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

  const inverse = themeState.inversed
  const requiresExtraWrapper = inverse != null || forceClassName

  if (!themeState.isNewTheme && !requiresExtraWrapper) {
    return <span className="_dsp_contents is_Theme">{children}</span>
  }

  const { className, style } = getThemeClassNameAndStyle(themeState, isRoot)

  let themedChildren = (
    <span className={`${className} _dsp_contents is_Theme`} style={style}>
      {children}
    </span>
  )

  // to prevent tree structure changes always render this if inverse is true or false
  if (requiresExtraWrapper) {
    const name = themeState.state?.name || ''
    const inverseClassName = name.startsWith('light')
      ? 't_light is_inversed'
      : name.startsWith('dark')
      ? 't_dark is_inversed'
      : ''
    themedChildren = (
      <span className={`${inverse ? inverseClassName : ''} _dsp_contents`}>
        {themedChildren}
      </span>
    )
  }

  return themedChildren
}

function getThemeClassNameAndStyle(themeState: ChangedThemeResponse, isRoot = false) {
  // in order to provide currentColor, set color by default
  const themeColor =
    themeState.state?.theme && themeState.isNewTheme
      ? variableToString(themeState.state.theme.color)
      : ''

  const style = themeColor
    ? {
        color: themeColor,
      }
    : undefined

  let className = themeState.state?.className || ''
  if (isRoot) {
    className = className.replace('t_sub_theme', '')
  }
  return { style, className }
}
