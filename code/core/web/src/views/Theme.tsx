import { createRefComponent } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { MutableRefObject } from 'react'
import React, { Children, cloneElement, isValidElement, useRef } from 'react'
import { getConfig, getSetting } from '../config'
import { variableToString } from '../createVariable'
import {
  insertStyleRules,
  shouldInsertStyleRules,
  updateRules,
} from '../helpers/insertStyleRule'
import {
  removeNativeStyleScope,
  updateNativeStyleScope,
} from '../helpers/nativeStyleEngine'
import { getInlineValuesFromProps, getVariablesCSSRules } from '../helpers/variables'
import { useThemeWithState } from '../hooks/useTheme'
import {
  getThemeState,
  hasThemeUpdatingProps,
  ThemeStateContext,
} from '../hooks/useThemeState'
import type {
  ReservedThemePropName,
  RulesToInsert,
  ThemeKeys,
  ThemeProps,
  ThemeState,
  UseThemeWithStateProps,
  VariableValIn,
} from '../types'
import { ThemeDebug } from './ThemeDebug'

/**
 * Theme values set inline for a subtree: `<Theme background-hover="blue4">`.
 * Values use the same flat grammar as style props, narrowed to the modifiers a
 * whole subtree can honor: theme (`dark:`) and platform (`ios:`).
 *
 * Without a config augmentation `ThemeKeys` is `string`, which would make this
 * a catch-all index signature that every one of Theme's own props collides
 * with. There are no known theme keys to offer in that case, so it contributes
 * nothing instead.
 */
type InlineThemeValueProps = string extends ThemeKeys
  ? {}
  : {
      [Key in Exclude<ThemeKeys, ReservedThemePropName>]?: VariableValIn
    }

type ThemeComponentPropsOnly = UseThemeWithStateProps &
  InlineThemeValueProps & { contain?: boolean }

const useInsertEffectCompat = isWeb
  ? React.useInsertionEffect || useIsomorphicLayoutEffect
  : () => {}

export const Theme = createRefComponent(function Theme(
  props: ThemeComponentPropsOnly,
  ref
) {
  'use no memo'

  if (props.disable) {
    return props.children
  }

  const { passThrough } = props

  const isRoot = !!props['_isRoot']

  // theme-key props (<Theme background-hover="blue4 dark:blue2">) become an
  // inline layer merged over the parent theme. null for a plain <Theme>, which
  // costs one loop over its two or three props and allocates nothing.
  const config = getConfig()
  const inlineValues = getInlineValuesFromProps(props, config)

  // on web the same layer also compiles to custom properties on this node, so
  // styled descendants restyle through the cascade instead of re-rendering
  let inlineCSS: ReturnType<typeof getVariablesCSSRules> = null
  let rulesToInsert: RulesToInsert | null = null
  if (process.env.TAMAGUI_TARGET !== 'native' && inlineValues) {
    inlineCSS = getVariablesCSSRules(inlineValues, config)
    if (inlineCSS && shouldInsertStyleRules(inlineCSS.identifier)) {
      updateRules(inlineCSS.identifier, inlineCSS.rules)
      rulesToInsert = {
        [inlineCSS.identifier]: [
          'variables',
          '',
          inlineCSS.identifier,
          undefined,
          inlineCSS.rules,
        ],
      }
    }
  }

  useInsertEffectCompat(() => {
    if (rulesToInsert) insertStyleRules(rulesToInsert)
  }, [inlineCSS?.identifier])

  const themeProps: ThemeComponentPropsOnly = inlineValues
    ? { ...props, inlineValues, inlineClassName: inlineCSS?.identifier }
    : props

  // pass forThemeView=true so the descendant-cascade effect is installed —
  // <Theme> pushes themeState.id into ThemeStateContext, so children subscribe
  // under this id and need to be notified when our propsKey changes.
  const [_, themeState] = useThemeWithState(themeProps, isRoot, true)

  useIsomorphicLayoutEffect(() => {
    if (process.env.TAMAGUI_TARGET !== 'native') return
    updateNativeStyleScope(themeState.id, themeState.name, themeState.theme)
    return () => removeNativeStyleScope(themeState.id)
  }, [themeState.id, themeState.name, themeState.theme])

  const disableDirectChildTheme = props['disable-child-theme']

  let finalChildren = disableDirectChildTheme
    ? Children.map(props.children, (child) =>
        passThrough || !isValidElement(child)
          ? child
          : cloneElement(child, { ['data-disable-theme']: true } as any)
      )
    : props.children

  if (ref) {
    try {
      React.Children.only(finalChildren)
      // TODO deprecate react 18 and then avoid clone here and just pass prop
      finalChildren = cloneElement(finalChildren, { ref })
    } catch {
      //ok
    }
  }

  const stateRef = useRef({
    hasEverThemed: false,
  })

  return getThemedChildren(
    themeState,
    finalChildren,
    themeProps,
    isRoot,
    stateRef,
    passThrough
  )
})

Theme['avoidForwardRef'] = true

export function getThemedChildren(
  themeState: ThemeState,
  children: any,
  props: ThemeComponentPropsOnly,
  isRoot = false,
  stateRef: MutableRefObject<{ hasEverThemed?: boolean | 'wrapped' }>,
  passThrough = false
) {
  const { shallow, forceClassName } = props

  // always be true if ever themed so we avoid re-parenting
  const state = stateRef.current
  let hasEverThemed = state.hasEverThemed

  let shouldRenderChildrenWithTheme =
    hasEverThemed || themeState.isNew || isRoot || hasThemeUpdatingProps(props)

  if (process.env.NODE_ENV === 'development' && props.debug === 'visualize') {
    children = (
      <ThemeDebug themeState={themeState} themeProps={props}>
        {children}
      </ThemeDebug>
    )
  }

  if (!shouldRenderChildrenWithTheme) {
    return children
  }

  // from here on out we have to be careful not to re-parent
  children = (
    <ThemeStateContext.Provider value={themeState.id}>
      {children}
    </ThemeStateContext.Provider>
  )

  const { isInverse, name } = themeState
  const requiresExtraWrapper = isInverse || forceClassName

  // it only ever progresses from false => true => 'wrapped'
  if (!state.hasEverThemed) {
    state.hasEverThemed = true
  }
  if (
    requiresExtraWrapper ||
    // if the theme is exactly dark or light, its likely to change between dark/light
    // and that would require wrapping which would re-parent, so to avoid re-parenting do this
    themeState.name === 'dark' ||
    themeState.name === 'light'
  ) {
    state.hasEverThemed = 'wrapped'
  }

  // each children of these children wont get the theme
  if (shallow) {
    if (!themeState.parentId) {
      // they are doing shallow but didnt change actually change a theme theme?
    } else {
      const parentState = getThemeState(
        themeState.isNew ? themeState.id : themeState.parentId
      )
      if (!parentState) throw new Error(`‼️010`)
      children = Children.toArray(children).map((child) => {
        return isValidElement(child)
          ? passThrough
            ? child
            : cloneElement(
                child,
                undefined,
                <Theme name={parentState.name}>{(child as any).props.children}</Theme>
              )
          : child
      })
    }
  }

  if (process.env.NODE_ENV === 'development') {
    if (!passThrough && props.debug) {
      console.warn(` getThemedChildren`, {
        requiresExtraWrapper,
        forceClassName,
        themeState,
        state,
        themeSpanProps: getThemeClassNameAndColor(themeState, props, isRoot),
      })
    }
  }

  // this has to be after a few of the above items so it properly sets context (even if shallow set)
  if (forceClassName === false) {
    return children
  }

  if (isWeb) {
    const baseStyle = props.contain ? inertContainedStyle : inertStyle
    const { className = '', color } = passThrough
      ? {}
      : getThemeClassNameAndColor(themeState, props, isRoot)

    // inline theme values ride the same span as the theme class: one node for
    // <Theme name="dark" background="red">, and it lands even when the theme
    // itself didn't change (getThemeClassNameAndColor returns nothing then)
    const inlineClassName = passThrough ? undefined : props.inlineClassName

    children = (
      <span
        className={`${className} is_Theme${inlineClassName ? ` ${inlineClassName}` : ''}`}
        style={passThrough ? baseStyle : { color, ...baseStyle }}
      >
        {children}
      </span>
    )

    // to prevent tree structure changes always render this if inverse is true or false
    if (state.hasEverThemed === 'wrapped') {
      // but still calculate if we need the classnames
      const className = requiresExtraWrapper
        ? `${
            name.startsWith('light') ? 't_light' : name.startsWith('dark') ? 't_dark' : ''
          } _dsp_contents`
        : `_dsp_contents`
      children = <span className={className}>{children}</span>
    }

    return children
  }

  return children
}

const inertStyle = {
  display: 'contents',
}

const inertContainedStyle = {
  display: 'contents',
  contain: 'strict',
}

const empty = { className: '', color: undefined }

function getThemeClassNameAndColor(
  themeState: ThemeState,
  props: ThemeProps,
  isRoot = false
) {
  if (!themeState.isNew && !props.forceClassName) {
    return empty
  }

  // in order to provide currentColor, set color by default
  const themeColor =
    themeState?.theme && themeState.isNew ? variableToString(themeState.theme.color) : ''

  const style = themeColor
    ? {
        color: themeColor,
      }
    : undefined

  const themeClassName = themeState.name.replace(schemePrefix, '')
  const fullThemeClassName =
    themeState.name === themeClassName ? '' : ` t_${themeState.name}`

  // Build full hierarchy of theme classes for CSS variable inheritance
  // Examples:
  // - "red_surface1" → "t_red t_red_surface1"
  // - "green_active_Button" → "t_green t_green_active t_green_active_Button"
  const themeNameParts = themeClassName.split('_')
  let themeClasses = `t_${themeClassName}${fullThemeClassName}`

  if (themeNameParts.length > 1) {
    // Build full hierarchy for all multi-part themes (sub-themes, component themes, etc.)
    // This enables CSS variable inheritance through all levels
    const hierarchyClasses: string[] = []
    for (let i = 1; i <= themeNameParts.length; i++) {
      hierarchyClasses.push(`t_${themeNameParts.slice(0, i).join('_')}`)
    }
    themeClasses = `${hierarchyClasses.join(' ')}${fullThemeClassName}`
  }

  const className = `${isRoot ? '' : 't_sub_theme'} ${themeClasses}`

  return { color: themeColor, className }
}

const schemePrefix = /^(dark|light)_/
