import { useContext } from 'react'

import { ComponentContext } from '../contexts/ComponentContext'
import { defaultComponentStateMounted } from '../defaultComponentState'
import { useSplitStyles } from '../helpers/getSplitStyles'
import { ResolveVariableAs, StaticConfig } from '../types'
import { Stack } from '../views/Stack'
import { useMedia } from './useMedia'
import { useThemeWithState } from './useTheme'

type UsePropsOptions = {
  disableExpandShorthands?: boolean
  resolveValues?: ResolveVariableAs
  forComponent?: { staticConfig: StaticConfig }
}

type FlattenedProps<A> = {
  // remove all media
  [Key in keyof A extends `$${string}` ? never : keyof A]?: A[Key]
}

/**
 * Returns props and style as a single object, expanding and merging shorthands and media queries.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export function useProps<A extends Object>(
  props: A,
  opts?: UsePropsOptions
): FlattenedProps<A> {
  const [propsOut, styleOut] = usePropsAndStyle(props, {
    ...opts,
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
export function useStyle<A extends Object>(
  props: A,
  opts?: UsePropsOptions
): FlattenedProps<A> {
  return usePropsAndStyle(props, opts)[1]
}

/**
 * Returns [props, styles] fully resolved and flattened with merged media queries and shorthands with all theme and token values resolved.
 *
 * Use sparingly, it will loop props and trigger re-render on all media queries you access.
 *
 * */
export function usePropsAndStyle<A extends Object>(
  props: A,
  opts?: UsePropsOptions
): [FlattenedProps<A>, FlattenedProps<A>] {
  const staticConfig = opts?.forComponent?.staticConfig ?? Stack.staticConfig
  const [themeState, theme] = useThemeWithState({
    componentName: staticConfig.componentName,
  })
  const componentContext = useContext(ComponentContext)
  const media = useMedia()
  const splitStyles = useSplitStyles(
    props,
    staticConfig,
    theme,
    themeState.state.name,
    defaultComponentStateMounted,
    {
      isAnimated: false,
      noExpand: true,
      mediaState: media,
      noClassNames: true,
      noNormalize: true,
      ...opts,
    },
    null,
    componentContext
  )
  return [splitStyles.viewProps, splitStyles.style] as any
}
