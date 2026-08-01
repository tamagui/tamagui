import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import React from 'react'
import { getConfig } from '../config'
import { ComponentContext } from '../contexts/ComponentContext'
import { GroupContext } from '../contexts/GroupContext'
import { useSplitStyles } from '../helpers/getSplitStyles'
import { subscribeToSafeArea } from '../helpers/resolveSafeAreaVariable'
import { subscribeToContextGroup } from '../helpers/subscribeToContextGroup'
import type { SplitStyleProps, StaticConfig, ThemeParsed, UseMediaState } from '../types'
import type { ViewProps, ViewStyle } from '../views/View'
import { View } from '../views/View'
import { useComponentState } from './useComponentState'
import { mediaState } from '../helpers/mediaState'
import { useMedia } from './useMedia'
import { useThemeWithState } from './useTheme'

type UsePropsOptions = Pick<
  SplitStyleProps,
  'noExpand' | 'noNormalize' | 'noClass' | 'resolveValues'
> & {
  disableExpandShorthands?: boolean
  forComponent?: { staticConfig: StaticConfig }
  noClass?: boolean

  /**
   * Disable watching for media queries
   */
  noMedia?: boolean
}

export type PropsWithoutMediaStyles<A> = Partial<A>

type PropsLikeObject = (ViewProps & Record<string, any>) | object
type StyleLikeObject = (ViewStyle & Record<string, any>) | object

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
  const staticConfig = opts?.forComponent?.staticConfig ?? View.staticConfig
  const [theme, themeState] = useThemeWithState({
    componentName: staticConfig.componentName,
    name: 'theme' in props ? props.theme : undefined,
    needsUpdate() {
      return true
    },
  })
  const componentContext = React.useContext(ComponentContext)
  const groupContext = React.useContext(GroupContext)
  // useComponentState injects enter/exit presence variants onto a fresh copy
  // (it no longer mutates our `props` in place), so use the returned object for
  // style resolution below to keep those variants applied
  const {
    props: statefulProps,
    state,
    disabled,
    setState,
    setStateShallow,
  } = useComponentState(
    props,
    componentContext.animationDriver,
    staticConfig,
    getConfig()
  )

  const mediaStateNow = opts?.noMedia
    ? // not safe to use mediaState but really marginal to hit this
      mediaState
    : useMedia()

  const splitStyles = useSplitStyles(
    statefulProps,
    staticConfig,
    theme,
    themeState?.name || '',
    state,
    {
      isAnimated: false,
      mediaState: mediaStateNow,
      noSkip: true,
      noMergeStyle: true,
      noClass: true,
      resolveValues: 'auto',
      ...opts,
    },
    null,
    componentContext,
    groupContext
  )

  const { mediaGroups, pseudoGroups } = splitStyles || {}

  useIsomorphicLayoutEffect(() => {
    let disposeSafeArea: (() => void) | undefined
    if (splitStyles?.usesSafeArea) {
      const updateSafeArea = () => {
        setState((previous) => ({ ...previous }))
      }
      disposeSafeArea = subscribeToSafeArea(updateSafeArea)
      // close the render-to-subscribe race: the provider tracker may have
      // published new insets after this hook evaluated its styles.
      updateSafeArea()
    }

    if (disabled) {
      return disposeSafeArea
    }

    if (state.unmounted) {
      setStateShallow({ unmounted: false })
      return disposeSafeArea
    }

    if (groupContext) {
      const disposeGroup = subscribeToContextGroup({
        groupContext,
        setStateShallow,
        mediaGroups,
        pseudoGroups,
      })
      if (!disposeSafeArea) return disposeGroup
      return () => {
        disposeSafeArea()
        disposeGroup?.()
      }
    }
    return disposeSafeArea
  }, [
    disabled,
    groupContext,
    splitStyles?.usesSafeArea,
    pseudoGroups ? Object.keys([...pseudoGroups]).join('') : 0,
    mediaGroups ? Object.keys([...mediaGroups]).join('') : 0,
  ])

  return [
    splitStyles?.viewProps || {},
    splitStyles?.style || {},
    theme,
    mediaState,
  ] as any
}
