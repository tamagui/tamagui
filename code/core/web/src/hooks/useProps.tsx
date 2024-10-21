import React from 'react'
import { getConfig } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { useSplitStyles } from '../helpers/getSplitStyles'
import { subscribeToContextGroup } from '../helpers/subscribeToContextGroup'
import type { SplitStyleProps, StaticConfig, ThemeParsed, UseMediaState } from '../types'
import { Stack } from '../views/Stack'
import type { ViewProps, ViewStyle } from '../views/View'
import { useComponentState } from './useComponentState'
import { useMedia } from './useMedia'
import { useThemeWithState } from './useTheme'

type UsePropsOptions = Pick<
  SplitStyleProps,
  'noExpand' | 'noNormalize' | 'noClass' | 'resolveValues'
> & {
  disableExpandShorthands?: boolean
  forComponent?: { staticConfig: StaticConfig }
  noClass?: boolean
}

export type PropsWithoutMediaStyles<A> = {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key]
}

type PropsLikeObject = (ViewProps & Record<string, any>) | Object
type StyleLikeObject = (ViewStyle & Record<string, any>) | Object

/**
 * Returns props and style as a single object, expanding and merging shorthands and media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export function useProps<A extends PropsLikeObject>(
  props: A,
  opts?: UsePropsOptions
): PropsWithoutMediaStyles<A> {
  const [propsOut, styleOut] = usePropsAndStyle(props, {
    ...opts,
    noExpand: true,
    noNormalize: true,
    resolveValues: 'none',
  })
  return {
    ...propsOut,
    ...styleOut,
  }
}

/**
 * Returns only style values fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export function useStyle<A extends StyleLikeObject>(
  props: A,
  opts?: UsePropsOptions
): PropsWithoutMediaStyles<A> {
  return usePropsAndStyle(props, opts)[1] || {}
}

/**
 * Returns [props, styles, theme, media] fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export function usePropsAndStyle<A extends PropsLikeObject>(
  props: A,
  opts?: UsePropsOptions
): [PropsWithoutMediaStyles<A>, PropsWithoutMediaStyles<A>, ThemeParsed, UseMediaState] {
  const staticConfig = opts?.forComponent?.staticConfig ?? Stack.staticConfig
  const [themeState, theme] = useThemeWithState({
    componentName: staticConfig.componentName,
    name: 'theme' in props ? props.theme : undefined,
    inverse: 'themeInverse' in props ? props.themeInverse : undefined,
  })
  const componentContext = React.useContext(ComponentContext as any) as any
  const { state, disabled, setStateShallow } = useComponentState(
    props,
    componentContext,
    staticConfig,
    getConfig()
  )

  const mediaState = useMedia()
  const splitStyles = useSplitStyles(
    props,
    staticConfig,
    theme,
    themeState.state?.name || '',
    state,
    {
      isAnimated: false,
      mediaState,
      noSkip: true,
      noMergeStyle: true,
      noClass: true,
      resolveValues: 'auto',
      ...opts,
    },
    null,
    componentContext
  )

  const { mediaGroups, pseudoGroups } = splitStyles

  React.useEffect(() => {
    if (disabled) {
      return
    }

    if (state.unmounted) {
      setStateShallow({ unmounted: false })
      return
    }

    return subscribeToContextGroup({
      disabled,
      componentContext,
      setStateShallow,
      state,
      mediaGroups,
      pseudoGroups,
    })
  }, [
    disabled,
    pseudoGroups ? Object.keys([...pseudoGroups]).join('') : 0,
    mediaGroups ? Object.keys([...mediaGroups]).join('') : 0,
  ])

  return [splitStyles.viewProps, splitStyles.style || {}, theme, mediaState] as any
}
