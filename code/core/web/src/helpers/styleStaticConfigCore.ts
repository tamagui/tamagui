import { stylePropsText, validStyles as validStylesView } from '@tamagui/helpers'
import type { StaticConfig, TamaguiInternalConfig } from '../types'
import type { StyleStaticConfig } from './styleStaticConfig'

const styleStaticConfigCache = new WeakMap<
  StaticConfig,
  WeakMap<TamaguiInternalConfig, { revision: number; value: StyleStaticConfig }>
>()

export function resolveStyleStaticConfig(
  staticConfig: StaticConfig,
  conf: TamaguiInternalConfig,
  revision: number
): StyleStaticConfig {
  let configCache = styleStaticConfigCache.get(staticConfig)
  const cached = configCache?.get(conf)
  if (cached?.revision === revision) return cached.value

  const normalized = staticConfig.styleFrontend?.normalizeStaticConfig?.(
    staticConfig,
    conf
  )
  const variants = normalized ? normalized.variants : staticConfig.variants
  const authoredBaseStyle = normalized ? normalized.baseStyle : staticConfig.baseStyle
  const authoredDefaultProps = staticConfig.defaultProps
  let baseStyle: Record<string, any> | undefined
  let baseVariantProps: Record<string, any> | undefined
  let defaultProps: Record<string, any> | undefined
  if (authoredDefaultProps) {
    const validStyles =
      staticConfig.validStyles ||
      (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
    for (const key in authoredDefaultProps) {
      const isVariant = Boolean(variants?.[key])
      const isStyle =
        key !== 'transition' && (key in validStyles || key in conf.shorthands)
      if (isVariant || isStyle) {
        ;(baseStyle ||= authoredBaseStyle ? { ...authoredBaseStyle } : {})[key] =
          authoredDefaultProps[key]
      }
      if (isVariant || !isStyle) {
        ;(defaultProps ||= {})[key] = authoredDefaultProps[key]
      }
      if (isVariant) {
        ;(baseVariantProps ||= {})[key] = authoredDefaultProps[key]
      }
    }
  }
  const keys = staticConfig.contextProps || staticConfig.context?.propKeys
  const value: StyleStaticConfig = {
    baseStyle: baseStyle || authoredBaseStyle,
    baseVariantProps,
    defaultProps,
    styledContextKeys: keys ? new Set(keys) : null,
    variants,
    variantStyleResolver: (staticConfig as any).variantStyleResolver,
    passthroughClassName: normalized
      ? normalized.passthroughClassName
      : staticConfig.passthroughClassName,
  }

  if (!configCache) {
    configCache = new WeakMap()
    styleStaticConfigCache.set(staticConfig, configCache)
  }
  configCache.set(conf, { revision, value })
  return value
}
