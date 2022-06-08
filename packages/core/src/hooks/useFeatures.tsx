import React, { RefObject } from 'react'
import { View, ViewStyle } from 'react-native'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { getSubStyle } from '../helpers/getSplitStyles'
import {
  PseudoStyles,
  SplitStyleState,
  StaticConfigParsed,
  TamaguiComponentState,
  UseAnimationHook,
  UseAnimationProps,
} from '../types'
import { addMediaQueryListener, mediaState, removeMediaQueryListener } from './useMedia'

type FeatureDefinition = {
  isEnabled: (props: any) => boolean
  Component: any
}

type FeatureUtils = {
  forceUpdate: Function
  state: SplitStyleState
  setStateShallow: (next: Partial<TamaguiComponentState>) => void
  useAnimations?: UseAnimationHook
  pseudos: PseudoStyles
  style: ViewStyle | null | undefined
  staticConfig: StaticConfigParsed
  theme: any
  onDidAnimate?: () => void
  hostRef: RefObject<HTMLElement | View>
}

const createDefinition = ({
  Component,
  propNames,
}: {
  Component: (props: { _utils: FeatureUtils; [key: string]: any }) => void
  propNames: string[]
}): FeatureDefinition => ({
  isEnabled: (props: any) => propNames.some((name) => !!props[name]),
  Component,
})

let featureDefinitions: Record<string, FeatureDefinition> | null = null

type FeatureKeys = keyof ReturnType<typeof loadFeatures>

export const useFeatures = (props: any, utils?: FeatureUtils) => {
  if (!featureDefinitions) {
    featureDefinitions = loadFeatures()
  }
  const elements: JSX.Element[] = []
  const enabled: { [key in FeatureKeys]?: boolean } = {}
  for (const name in featureDefinitions) {
    const { isEnabled, Component } = featureDefinitions[name]
    if (isEnabled(props) && Component) {
      enabled[name] = true
      elements.push(<Component key={name} {...props} _utils={utils} />)
    }
  }
  return {
    elements,
    enabled,
  }
}

function loadFeatures() {
  return {
    // loads animations and sets state with the results
    animation: loadAnimationFeature(),

    // will update the parent whenever media query changes
    // no need on web, media queries are inserted and run in css
    mediaQuery: loadMediaQueryFeature(),
  } as const
}

function loadAnimationFeature() {
  return createDefinition({
    Component: ({ _utils, ...props }) => {
      const {
        state,
        useAnimations,
        pseudos,
        style: inStyle,
        setStateShallow,
        staticConfig,
        theme,
        onDidAnimate,
      } = _utils

      if (!useAnimations) {
        console.error('no useAnimations hook provided')
        return null
      }

      // we always have .animation set
      const propsWithAnimation = props as UseAnimationProps

      const res = useAnimations(propsWithAnimation, {
        state,
        pseudos,
        onDidAnimate,
        staticConfig,
        getStyle({ isEntering, exitVariant, enterVariant } = {}) {
          // we have to merge such that transforms keys all exist
          const style = inStyle || {}

          const enterStyle =
            isEntering === true || state.mounted === false
              ? enterVariant && staticConfig.variants?.[enterVariant]['true']
                ? getSubStyle(
                    staticConfig.variants?.[enterVariant]['true'],
                    staticConfig,
                    theme,
                    props,
                    state
                  ) || pseudos.enterStyle
                : null || pseudos.enterStyle
              : null

          const exitStyle =
            isEntering === false
              ? exitVariant && staticConfig.variants?.[exitVariant]['true']
                ? getSubStyle(
                    staticConfig.variants?.[exitVariant]['true'],
                    staticConfig,
                    theme,
                    props,
                    state
                  ) || pseudos.exitStyle
                : null || pseudos.exitStyle
              : null

          // if you have hoverStyle={{ scale: 1.1 }} and don't have scale set on the base style
          // no animation will run! this is really confusing. this will look at all variants,
          // and fill in base styles if they don't exist. eg:
          // input:
          //   base: {}
          //   hoverStyle: { scale: 2 }
          //   enterStyle: { x: 100 }
          // output:
          //   base: { x: 0, scale: 1 }
          ensureBaseHasDefaults(
            style,
            enterStyle,
            pseudos.hoverStyle,
            pseudos.focusStyle,
            pseudos.pressStyle,
            pseudos.pressStyle
          )

          enterStyle && merge(style, enterStyle)
          state.hover && pseudos.hoverStyle && merge(style, pseudos.hoverStyle)
          state.focus && pseudos.focusStyle && merge(style, pseudos.focusStyle)
          state.press && pseudos.pressStyle && merge(style, pseudos.pressStyle)
          exitStyle && merge(style, exitStyle)

          return style
        },
        //, delay
      })

      useIsomorphicLayoutEffect(() => {
        setStateShallow({
          animation: res,
        })
      }, [res])

      return null
    },
    propNames: ['animation'],
  })
}

const defaults = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  opacity: 1,
  translateX: 0,
  translateY: 0,
  skew: 0,
  skewX: 0,
  skewY: 0,
  scale: 1,
  rotate: '0deg',
  rotateY: '0deg',
  rotateX: '0deg',
}

function ensureBaseHasDefaults(base: ViewStyle, ...pseudos: (ViewStyle | null | undefined)[]) {
  for (const pseudo of pseudos) {
    if (!pseudo) continue
    for (const key in pseudo) {
      const val = pseudo[key]
      if (key === 'transform') {
        for (const t of val) {
          const tkey = Object.keys(t)[0]
          const defaultVal = defaults[tkey]
          const tDefaultVal = { [tkey]: defaultVal } as any
          if (!base.transform) {
            base.transform = [tDefaultVal]
          } else {
            if (!base.transform.find((x) => x[tkey])) {
              base.transform.push(tDefaultVal)
            }
          }
        }
      } else {
        if (!(key in base)) {
          base[key] = defaults[key]
        }
      }
    }
  }
}

function merge(base: ViewStyle, next: ViewStyle) {
  if (!next.transform || !base.transform) {
    Object.assign(base, next)
    return
  }
  const { transform, ...rest } = next
  Object.assign(base, rest)
  for (const t of transform) {
    const key = Object.keys(t)[0]
    const existing = base.transform.find((x) => key in x)
    if (existing) {
      existing[key] = t[key]
    } else {
      base.transform.push(t)
    }
  }
}

function loadMediaQueryFeature() {
  const mediaPropNames = Object.keys(mediaState)

  return createDefinition({
    Component: (props: any) => {
      const mediaKeys = mediaPropNames.filter((x) => x in props)

      useIsomorphicLayoutEffect(() => {
        for (const key of mediaKeys) {
          addMediaQueryListener(key, props._utils.forceUpdate)
        }
        return () => {
          for (const key of mediaKeys) {
            removeMediaQueryListener(key, props._utils.forceUpdate)
          }
        }
      }, [mediaKeys.join(',')])

      return null
    },
    propNames: mediaPropNames,
  })
}

// TODO
// measureLayout: createDefinition({
//   Component: (props) => {
//     console.log('measure', props)
//     return null
//   },
//   propNames: ['onLayout'],
// }),
