import { stylePropsText, validStyles as validStylesView } from '@tamagui/helpers'
import type { StaticConfig, TamaguiInternalConfig } from '../types'
import { getConfigRevisionState } from './grammarConfig'

export type StyleStaticConfig = {
  baseStyle: Record<string, any> | undefined
  defaultProps: Record<string, any> | undefined
  styledContextKeys: Set<string> | null
  variants: StaticConfig['variants']
  passthroughClassName: string | undefined
}

const styleStaticConfigCache = new WeakMap<
  StaticConfig,
  WeakMap<TamaguiInternalConfig, { revision: number; value: StyleStaticConfig }>
>()

/**
 * styled() takes styles and props in one options object. The styles belong to the
 * base layer the style pass writes before any prop, so call-site props and
 * variants always land on top of them; everything else stays a prop.
 *
 * Split lazily rather than in styled(), because classifying a key needs
 * `conf.shorthands` and styled() runs at module scope before createTamagui.
 */
export function getStyleStaticConfig(
  staticConfig: StaticConfig,
  conf: TamaguiInternalConfig
): StyleStaticConfig {
  let configCache = styleStaticConfigCache.get(staticConfig)
  const revision = getConfigRevisionState(conf).revision
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
  let defaultProps: Record<string, any> | undefined
  if (authoredDefaultProps) {
    const validStyles =
      staticConfig.validStyles ||
      (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
    for (const key in authoredDefaultProps) {
      // a variant name resolves through the prop path, never as a style, so
      // defaultVariants keep working exactly as authored
      if (variants?.[key] || !(key in validStyles || key in conf.shorthands)) {
        ;(defaultProps ||= {})[key] = authoredDefaultProps[key]
      } else {
        ;(baseStyle ||= authoredBaseStyle ? { ...authoredBaseStyle } : {})[key] =
          authoredDefaultProps[key]
      }
    }
  }
  const keys = staticConfig.contextProps || staticConfig.context?.propKeys
  const value: StyleStaticConfig = {
    baseStyle: baseStyle || authoredBaseStyle,
    defaultProps,
    styledContextKeys: keys ? new Set(keys) : null,
    variants,
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
