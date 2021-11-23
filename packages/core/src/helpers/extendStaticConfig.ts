import React from 'react'

import { StaticComponent, StaticConfig, StaticConfigParsed } from '../types'
import { createPropMapper } from './createPropMapper'

export function extendStaticConfig(
  // can be undefined when loading with @tamagui/fake-react-native
  // could be fixed a bit cleaner
  Component?: StaticComponent | React.Component<any>,
  config: StaticConfig = {}
): StaticConfigParsed | null {
  const parent = (Component || {}) as any
  if (!parent.staticConfig) {
    // if no static config, we are extending an external component
    parent.staticConfig = {
      Component,
    }
  }

  const variants = {
    ...parent.staticConfig.variants,
  }

  // merge variants without clobbering previous... can we tho (typed??
  if (config.variants) {
    for (const key in config.variants) {
      if (variants[key]) {
        variants[key] = {
          ...variants[key],
          ...config.variants[key],
        }
      } else {
        variants[key] = config.variants[key]
      }
    }
  }

  return parseStaticConfig({
    ...parent.staticConfig,
    isZStack: config.isZStack || parent.staticConfig.isZStack,
    variants,
    isText: config.isText || parent.staticConfig.isText || false,
    neverFlatten: config.neverFlatten ?? parent.staticConfig.neverFlatten,
    ensureOverriddenProp: config.ensureOverriddenProp ?? parent.staticConfig.ensureOverriddenProp,
    validStyles: config.validStyles
      ? {
          ...parent.staticConfig.validStyles,
          ...config.validStyles,
        }
      : parent.staticConfig.validStyles,
    validPropsExtra: {
      ...parent.staticConfig.validPropsExtra,
      ...config.validPropsExtra,
    },
    defaultProps: {
      ...parent.staticConfig.defaultProps,
      ...config.defaultProps,
    },
  })
}

export const parseStaticConfig = (config: StaticConfig): StaticConfigParsed => {
  return {
    ...config,
    parsed: true,
    propMapper: createPropMapper(config),
  }
}
