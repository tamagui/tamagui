import { stylePropsView } from '@tamagui/helpers'

import { StaticConfig, StaticConfigParsed, StylableComponent } from '../types'
import { createPropMapper } from './createPropMapper'

export function extendStaticConfig(
  // can be undefined when loading with @tamagui/fake-react-native
  // could be fixed a bit cleaner
  parent?: StylableComponent,
  config: StaticConfig = {}
): StaticConfigParsed | null {
  if (!parent) {
    throw new Error('no parent')
  }

  if (!('staticConfig' in parent)) {
    return parseStaticConfig(config)
  }

  const variants = {
    ...parent.staticConfig.variants,
  }

  // merge variants... can we type this?
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
    ...config,
    variants,
    isZStack: config.isZStack || parent.staticConfig.isZStack,
    isText: config.isText || parent.staticConfig.isText || false,
    isInput: config.isInput || parent.staticConfig.isInput || false,
    neverFlatten: config.neverFlatten || parent.staticConfig.neverFlatten,
    ensureOverriddenProp: config.ensureOverriddenProp ?? parent.staticConfig.ensureOverriddenProp,
    validStyles: config.validStyles
      ? {
          ...parent.staticConfig.validStyles,
          ...config.validStyles,
        }
      : parent.staticConfig.validStyles || stylePropsView,
    defaultProps: {
      ...parent.staticConfig.defaultProps,
      ...parent.staticConfig.defaultVariants,
      ...config.defaultProps,
      ...config.defaultVariants,
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
