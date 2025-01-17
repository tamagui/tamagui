import { isWeb } from '@tamagui/constants'
import type { MutableRefObject } from 'react'
import React, { Children, cloneElement, forwardRef, isValidElement, useRef } from 'react'
import { variableToString } from '../createVariable'
import { log } from '../helpers/log'
import { ThemeManagerContext } from '../helpers/ThemeManagerContext'
import type { ChangedThemeResponse } from '../hooks/useTheme'
import { useChangeThemeEffect } from '../hooks/useTheme'
import type { ThemeProps } from '../types'
import { ThemeDebug } from './ThemeDebug'

export const Theme = forwardRef(function Theme({ children, ...props }: ThemeProps, ref) {
  // @ts-expect-error only for internal views
  if (props.disable) {
    return children
  }

  const isRoot = !!props['_isRoot']
  const themeState = useChangeThemeEffect(props, isRoot)
  const disableDirectChildTheme = props['disable-child-theme']

  let finalChildren = disableDirectChildTheme
    ? Children.map(children, (child) =>
        cloneElement(child, { ['data-disable-theme']: true })
      )
    : children

  if (ref) {
    try {
      React.Children.only(finalChildren)
      finalChildren = cloneElement(finalChildren, { ref })
    } catch {
      //ok
    }
  }

  if (process.env.NODE_ENV === 'development') {
    if (props.debug === 'visualize') {
      finalChildren = (
        <ThemeDebug themeState={themeState} themeProps={props}>
          {finalChildren}
        </ThemeDebug>
      )
    }
  }

  const stateRef = useRef({
    hasEverThemed: false,
  })

  return getThemedChildren(themeState, finalChildren, props, isRoot, stateRef)
})

Theme['avoidForwardRef'] = true

export function getThemedChildren(
  themeState: ChangedThemeResponse,
  children: any,
  props: ThemeProps,
  isRoot = false,
  stateRef: MutableRefObject<{ hasEverThemed?: boolean }>
) {
  const { themeManager, isNewTheme } = themeState

  // its always there.. should fix type
  if (!themeManager) {
    return children
    // throw new Error(
    //   process.env.NODE_ENV === 'development'
    //     ? `❌ No theme found, either incorrect name, potential duplicate tamagui deps, or TamaguiProvider not providing themes.`
    //     : `❌ 005`
    // )
  }

  const { shallow, forceClassName } = props

  // always be true if ever themed so we avoid re-parenting
  let shouldRenderChildrenWithTheme =
    isNewTheme ||
    isRoot ||
    'inverse' in props ||
    'name' in props ||
    'reset' in props ||
    'forceClassName' in props ||
    stateRef.current.hasEverThemed

  if (shouldRenderChildrenWithTheme) {
    stateRef.current.hasEverThemed = true
  }

  if (!shouldRenderChildrenWithTheme) {
    return children
  }

  if (process.env.NODE_ENV === 'development') {
    if (shouldRenderChildrenWithTheme && props.debug === 'verbose') {
      log(
        `adding theme: isRoot ${isRoot}, inverse ${'inverse' in props}, isNewTheme ${isNewTheme}, hasEver ${stateRef.current.hasEverThemed}`,
        props
      )
    }
  }

  let next = children

  // each children of these children wont get the theme
  if (shallow) {
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

  const elementsWithContext = (
    <ThemeManagerContext.Provider value={themeManager}>
      {next}
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
  const requiresExtraWrapper = typeof inverse === 'boolean' || forceClassName

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

const emptyObj = {}

function getThemeClassNameAndStyle(themeState: ChangedThemeResponse, isRoot = false) {
  if (!themeState.isNewTheme) {
    return { className: '', style: emptyObj }
  }

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
