import { stylePropsView } from '@tamagui/helpers'

import { StaticConfig, StaticConfigParsed, StylableComponent } from '../types'
import { createPropMapper } from './createPropMapper'
import { mergeProps } from './mergeProps'

export function extendStaticConfig(config: Partial<StaticConfig>, parent?: StylableComponent) {
  if (!parent || !('staticConfig' in parent)) {
    return parseStaticConfig(config)
  }

  const parentStaticConf = parent.staticConfig as StaticConfig
  const variants = {
    ...parentStaticConf.variants,
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

  // include our own
  const parentNames = [...(parentStaticConf.parentNames || [])]
  if (parentStaticConf.componentName) {
    parentNames.push(parentStaticConf.componentName)
  }

  return parseStaticConfig({
    ...parentStaticConf,
    ...config,
    variants,
    parentNames,
    isZStack: config.isZStack || parentStaticConf.isZStack,
    isText: config.isText || parentStaticConf.isText || false,
    isInput: config.isInput || parentStaticConf.isInput || false,
    neverFlatten: config.neverFlatten || parentStaticConf.neverFlatten,
    ensureOverriddenProp: config.ensureOverriddenProp ?? parentStaticConf.ensureOverriddenProp,
    validStyles: config.validStyles
      ? {
          ...parentStaticConf.validStyles,
          ...config.validStyles,
        }
      : parentStaticConf.validStyles || stylePropsView,
    defaultProps: mergeProps(
      {
        ...parentStaticConf.defaultProps,
        ...parentStaticConf.defaultVariants,
      },
      {
        ...config.defaultProps,
        ...config.defaultVariants,
      }
    )[0],
  })
}

export const parseStaticConfig = (config: Partial<StaticConfig>): StaticConfigParsed => {
  return {
    ...config,
    parsed: true,
    propMapper: createPropMapper(config),
  }
}
