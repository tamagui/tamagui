import { stylePropsView } from '@tamagui/helpers'

import type {
  GenericVariantDefinitions,
  StaticConfig,
  StaticConfigParsed,
  StylableComponent,
} from '../types'
import { createPropMapper } from './createPropMapper'
import { mergeProps } from './mergeProps'

export function extendStaticConfig(
  config: Partial<StaticConfig>,
  parent?: StylableComponent
) {
  if (!(parent && 'staticConfig' in parent)) {
    return parseStaticConfig(config)
  }

  const parentStaticConfig = parent.staticConfig as StaticConfig

  // merge variants... can we type this?
  const variants = mergeVariants(parentStaticConfig.variants, config.variants)

  // include our own
  const parentNames = [...(parentStaticConfig.parentNames || [])]
  if (parentStaticConfig.componentName) {
    parentNames.push(parentStaticConfig.componentName)
  }

  const deoptProps = config.deoptProps || new Set<string>()

  const defaultProps = mergeProps(parentStaticConfig.defaultProps, {
    ...config.defaultProps,
    ...config.defaultVariants,
  })[0]

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

export const mergeVariants = (
  parentVariants?: GenericVariantDefinitions,
  ourVariants?: GenericVariantDefinitions
) => {
  const variants = {
    ...parentVariants,
  }

  if (ourVariants) {
    for (const key in ourVariants) {
      if (key in variants) {
        variants[key] = {
          ...variants[key],
          ...ourVariants[key],
        }
      } else {
        variants[key] = ourVariants[key]
      }
    }
  }

  return variants
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
