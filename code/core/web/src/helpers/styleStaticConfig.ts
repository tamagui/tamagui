import { stylePropsText, validStyles as validStylesView } from '@tamagui/helpers'
import type { StaticConfig, TamaguiInternalConfig } from '../types'
import { getConfigRevisionState } from './grammarConfig'

export type StyleStaticConfig = {
  baseStyle: Record<string, any> | undefined
  baseVariantProps: Record<string, any> | undefined
  defaultProps: Record<string, any> | undefined
  styledContextKeys: Set<string> | null
  variants: StaticConfig['variants']
  variantStyleResolver: any
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
  let baseVariantProps: Record<string, any> | undefined
  let defaultProps: Record<string, any> | undefined
  if (authoredDefaultProps) {
    const validStyles =
      staticConfig.validStyles ||
      (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
    for (const key in authoredDefaultProps) {
      const isVariant = Boolean(variants?.[key])
      // transition selects an animation driver preset. It stays a prop even
      // though the web style table recognizes the CSS property spelling.
      const isStyle =
        key !== 'transition' && (key in validStyles || key in conf.shorthands)
      if (isVariant || isStyle) {
        ;(baseStyle ||= authoredBaseStyle ? { ...authoredBaseStyle } : {})[key] =
          authoredDefaultProps[key]
      }
      // variants also stay in the merged props for context and HOC forwarding,
      // while their style contribution runs at its authored base position
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
