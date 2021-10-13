import React from 'react'

import { isWeb, useIsomorphicLayoutEffect } from '../constants/platform'
import { addMediaQueryListener, removeMediaQueryListener } from './useMedia'

// only needed on native
// dynamic loading of features to avoid heavy views

const createDefinition = ({ Component, propNames }: { Component; propNames: string[] }) => ({
  isEnabled: (props: any) => propNames.some((name) => !!props[name]),
  Component,
})

const mediaQueryPropNames = [
  '$xs',
  '$sm',
  '$md',
  '$lg',
  '$xl',
  '$xxl',
  '$pointerCoarse',
  '$hoverNone',
  '$tall',
  '$short',
  '$gtSm',
  '$notXs',
  '$gtMd',
  '$gtLg',
]

const featureDefinitions = {
  measureLayout: createDefinition({
    Component: (props) => {
      console.log('measure', props)
      return null
    },
    propNames: ['onLayout'],
  }),

  // will update the parent whenever media query changes
  mediaQuery: createDefinition({
    Component: (props) => {
      if (isWeb) {
        // no need for media queries are inserted and run in css
        return
      }

      const keys = mediaQueryPropNames.flatMap((x) => (x in props ? x.slice(1) : []))
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
    propNames: mediaQueryPropNames,
  }),
}

const featureNames = Object.keys(featureDefinitions)
const numFeatures = featureNames.length

export const useFeatures = (props: any, utils?: { forceUpdate?: Function }) => {
  const features: JSX.Element[] = []
  for (let i = 0; i < numFeatures; i++) {
    const name = featureNames[i]
    const { isEnabled, Component } = featureDefinitions[name] as any //FeatureDefinition
    if (isEnabled(props) && Component) {
      features.push(<Component key={name} {...props} _utils={utils} />)
    }
  }
  return features
}
