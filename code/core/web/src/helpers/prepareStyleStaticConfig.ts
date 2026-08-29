import { stylePropsText, validStyles as validStylesView } from '@tamagui/helpers'
import type { StaticConfig, TamaguiInternalConfig } from '../types'
import { getCompiledVariantResolvers } from './variantResolvers'

// the keys a component reads from its styled context. styled() already merged
// `context` and `contextProps` up the inheritance chain, and createStyledContext
// sets propKeys from its `keys` option or its default values. cached because the
// style write path asks once per style key (issues #3670, #3676)
const contextPropSets = new WeakMap<StaticConfig, Set<string> | null>()

export function getContextPropSet(staticConfig: StaticConfig): Set<string> | null {
  let set = contextPropSets.get(staticConfig)
  if (set === undefined) {
    const keys = staticConfig.contextProps || staticConfig.context?.propKeys
    set = keys ? new Set(keys) : null
    contextPropSets.set(staticConfig, set)
  }
  return set
}

export type SplitStyledOptions = {
  baseStyle: Record<string, any> | undefined
  defaultProps: Record<string, any> | undefined
}

const splitStyledOptionsCache = new WeakMap<StaticConfig, SplitStyledOptions>()

/**
 * styled() takes styles and props in one options object. The styles belong to the
 * base layer the style pass writes before any prop, so call-site props and
 * variants always land on top of them; everything else stays a prop.
 *
 * Split lazily rather than in styled(), because classifying a key needs
 * `conf.shorthands` and styled() runs at module scope before createTamagui.
 */
export function splitStyledOptions(
  staticConfig: StaticConfig,
  conf: TamaguiInternalConfig
): SplitStyledOptions {
  let split = splitStyledOptionsCache.get(staticConfig)
  if (!split) {
    const { defaultProps, variants, baseStyle } = staticConfig
    const validStyles =
      staticConfig.validStyles ||
      (staticConfig.isText || staticConfig.isInput ? stylePropsText : validStylesView)
    let styles: Record<string, any> | undefined
    let props: Record<string, any> | undefined
    for (const key in defaultProps) {
      // a variant name resolves through the prop path, never as a style, so
      // defaultVariants keep working exactly as authored
      if (variants?.[key] || !(key in validStyles || key in conf.shorthands)) {
        ;(props ||= {})[key] = defaultProps[key]
      } else {
        ;(styles ||= baseStyle ? { ...baseStyle } : {})[key] = defaultProps[key]
      }
    }
    split = { baseStyle: styles || baseStyle, defaultProps: props }
    splitStyledOptionsCache.set(staticConfig, split)
  }
  return split
}

const preparedStyleStaticConfigs = new WeakSet<StaticConfig>()

export function prepareStyleStaticConfig(staticConfig: StaticConfig): StaticConfig {
  if (preparedStyleStaticConfigs.has(staticConfig)) return staticConfig
  preparedStyleStaticConfigs.add(staticConfig)
  const { variants } = staticConfig
  if (variants) {
    for (const key in variants) {
      const variant = variants[key]
      if (variant && typeof variant === 'object') getCompiledVariantResolvers(variant)
    }
  }
  return staticConfig
}
