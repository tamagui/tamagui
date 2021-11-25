import React from 'react'

import { isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { addMediaQueryListener, mediaState, removeMediaQueryListener } from './useMedia'

type FeatureDefinition = {
  isEnabled: (props: any) => boolean
  Component: any
}

const createDefinition = ({
  Component,
  propNames,
}: {
  Component: any
  propNames: string[]
}): FeatureDefinition => ({
  isEnabled: (props: any) => propNames.some((name) => !!props[name]),
  Component,
})

let featureDefinitions: Record<string, FeatureDefinition> | null = null

export const useFeatures = (props: any, utils?: { forceUpdate?: Function }) => {
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
    // TODO
    // measureLayout: createDefinition({
    //   Component: (props) => {
    //     console.log('measure', props)
    //     return null
    //   },
    //   propNames: ['onLayout'],
    // }),

    // will update the parent whenever media query changes
    // no need on web, media queries are inserted and run in css
    ...(!isWeb && {
      mediaQuery: loadMediaQueryFeature(),
    }),
  }
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
