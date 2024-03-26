import { useContext, useEffect, useState } from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import { defaultComponentStateMounted } from '../defaultComponentState'
import { useSplitStyles } from '../helpers/getSplitStyles'
import {
  isDisabled,
  subscribeToContextGroup,
  useComponentState,
} from '../createComponent'
import type {
  DisposeFn,
  SplitStyleProps,
  StaticConfig,
  ThemeParsed,
  UseMediaState,
} from '../types'
import { createShallowSetState } from '../helpers/createShallowSetState'
import { Stack } from '../views/Stack'
import { useMedia } from './useMedia'
import { useThemeWithState } from './useTheme'
import type { ViewProps, ViewStyle } from '../views/View'
import { getConfig } from '../config'

type UsePropsOptions = Pick<
  SplitStyleProps,
  'noExpand' | 'noNormalize' | 'noClassNames' | 'resolveValues'
> & {
  disableExpandShorthands?: boolean
  forComponent?: { staticConfig: StaticConfig }
  noClassNames?: boolean
}

export type PropsWithoutMediaStyles<A> = {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key]
}

type StyleLikeObject = ViewProps & Record<string, any>

/**
 * Returns props and style as a single object, expanding and merging shorthands and media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export function useProps<A extends StyleLikeObject>(
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
export function useStyle<A extends ViewStyle & Record<string, any>>(
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
export function usePropsAndStyle<A extends StyleLikeObject>(
  props: A,
  opts?: UsePropsOptions
): [PropsWithoutMediaStyles<A>, PropsWithoutMediaStyles<A>, ThemeParsed, UseMediaState] {
  const staticConfig = opts?.forComponent?.staticConfig ?? Stack.staticConfig
  const [themeState, theme] = useThemeWithState({
    componentName: staticConfig.componentName,
  })
  const componentContext = useContext(ComponentContext as any) as any
  const { state, disabled, setStateShallow } = useComponentState(
    props,
    componentContext,
    staticConfig,
    getConfig()
  )

  const media = useMedia()
  const splitStyles = useSplitStyles(
    props,
    staticConfig,
    theme,
    themeState.state?.name || '',
    state,
    {
      isAnimated: false,
      mediaState: media,
      noSkip: true,
      noMergeStyle: true,
      noClassNames: true,
      resolveValues: 'auto',
      ...opts,
    },
    null,
    componentContext
  )

  const { mediaGroups, pseudoGroups } = splitStyles

  useEffect(() => {
    if (disabled) {
      return
    }

    if (state.unmounted) {
      setStateShallow({ unmounted: false })
      return
    }

    // parent group pseudo listening
    let disposeGroupsListener: DisposeFn | undefined

    subscribeToContextGroup({
      disabled,
      componentContext,
      setStateShallow,
      state,
      disposeGroupsListener,
      mediaGroups,
      pseudoGroups,
    })

    return () => {
      disposeGroupsListener?.()
    }
  }, [
    disabled,
    pseudoGroups ? Object.keys([...pseudoGroups]).join('') : 0,
    mediaGroups ? Object.keys([...mediaGroups]).join('') : 0,
  ])

  return [splitStyles.viewProps, splitStyles.style || {}, theme, media] as any
}
