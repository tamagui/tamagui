import React, { useMemo } from 'react'
import { ViewStyle } from 'react-native'

import { isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { ComponentState } from '../defaultComponentState'
import { PseudoStyles } from '../static'
import { UseAnimationHook } from '../types'
import { addMediaQueryListener, mediaState, removeMediaQueryListener } from './useMedia'

type FeatureDefinition = {
  isEnabled: (props: any) => boolean
  Component: any
}

type FeatureUtils = {
  forceUpdate: Function
  state: ComponentState
  setStateShallow: (next: Partial<ComponentState>) => void
  useAnimations?: UseAnimationHook
  pseudos: PseudoStyles
  style: ViewStyle | null | undefined
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

export const useFeatures = (props: any, utils?: FeatureUtils) => {
  if (!featureDefinitions) {
    featureDefinitions = loadFeatures()
  }
  const features: JSX.Element[] = []
  for (const name in featureDefinitions) {
    const { isEnabled, Component } = featureDefinitions[name]
    if (isEnabled(props) && Component) {
      features.push(<Component key={name} {...props} _utils={utils} />)
    }
  }
  return features
}

function loadFeatures(): Record<string, FeatureDefinition> {
  return {
    // loads animations and sets state with the results
    animation: loadAnimationFeature(),

    // will update the parent whenever media query changes
    // no need on web, media queries are inserted and run in css
    ...(!isWeb && {
      mediaQuery: loadMediaQueryFeature(),
    }),
  }
}

function loadAnimationFeature() {
  return createDefinition({
    Component: ({ _utils, ...props }) => {
      const { state, useAnimations, pseudos, style, setStateShallow } = _utils

      if (!useAnimations) {
        console.error('no useAnimations hook provided')
        return null
      }

      const animatedStyleIn = {
        ...style,
        ...(state.hover && pseudos.hoverStyle),
        ...(state.focus && pseudos.focusStyle),
        ...(state.press && pseudos.pressStyle),
      }
      console.log('animatedStyleIn', animatedStyleIn)

      const res = useAnimations(props as any, {
        isMounted: state.mounted,
        style: animatedStyleIn,
        exitStyle: pseudos?.exitStyle,
        // onDidAnimate, delay
      })

      useIsomorphicLayoutEffect(() => {
        setStateShallow({
          animation: res,
        })
      }, [JSON.stringify(style)])

      return null
    },
    propNames: ['animation'],
  })
}

function loadMediaQueryFeature() {
  const mediaPropNames = Object.keys(mediaState)

  return createDefinition({
    Component: (props: any) => {
      const keys = mediaPropNames.flatMap((x) => (x in props ? x.slice(1) : []))

      useIsomorphicLayoutEffect(() => {
        for (const key of keys) {
          addMediaQueryListener(key, props._utils.forceUpdate)
        }
        return () => {
          for (const key of keys) {
            removeMediaQueryListener(key, props._utils.forceUpdate)
          }
        }
      }, [keys.join(',')])

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
