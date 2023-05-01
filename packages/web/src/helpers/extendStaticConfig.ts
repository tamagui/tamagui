import { stylePropsView } from '@tamagui/helpers'

import type { StaticConfig, StaticConfigParsed, StylableComponent } from '../types.js'
import { createPropMapper } from './createPropMapper.js'
import { mergeProps } from './mergeProps.js'

export function extendStaticConfig(
  config: Partial<StaticConfig>,
  parent?: StylableComponent
) {
  if (!(parent && 'staticConfig' in parent)) {
    return parseStaticConfig(config)
  }

  const parentStaticConfig = parent.staticConfig as StaticConfig
  const variants = {
    ...parentStaticConfig.variants,
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

  // console.log('variants', variants)

  // include our own
  const parentNames = [...(parentStaticConfig.parentNames || [])]
  if (parentStaticConfig.componentName) {
    parentNames.push(parentStaticConfig.componentName)
  }

  const deoptProps = config.deoptProps || new Set<string>()
  // deoptProps.add('style')

  const defaultProps = mergeProps(
    { ...parentStaticConfig.defaultProps },
    {
      ...config.defaultVariants,
      ...config.defaultProps,
    }
  )[0]

  return parseStaticConfig({
    ...parentStaticConfig,
    ...config,
    parentStaticConfig,
    deoptProps,
    variants,
    parentNames,
    validStyles: config.validStyles
      ? {
          ...parentStaticConfig.validStyles,
          ...config.validStyles,
        }
      : parentStaticConfig.validStyles || stylePropsView,
    defaultProps,
  })
}

export const parseStaticConfig = (config: Partial<StaticConfig>): StaticConfigParsed => {
  const parsed = {
    defaultProps: {},
    ...config,
    parsed: true,
  } as const
  return {
    ...parsed,
    propMapper: createPropMapper(parsed as StaticConfigParsed),
  }
}
