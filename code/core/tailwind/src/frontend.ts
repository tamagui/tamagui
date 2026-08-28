import {
  type FrontendStaticConfig,
  type StyleFrontend,
  type StyleFrontendConfig,
} from '@tamagui/core/internal-runtime'
import { configRevisionSymbol } from '@tamagui/style-grammar/runtime'
import {
  getTailwindClassPlan,
  resolveTailwindClassName,
} from './candidate'

/**
 * The Tailwind frontend descriptor.
 *
 * The shared style cursor tokenizes `className` once and asks this descriptor for
 * an immutable plan per candidate.
 * Everything after this point — value programs,
 * per-longhand forward merging, web lowering, native evaluation — is shared.
 *
 * Owned candidates are never string-merged: each contributes at its authored
 * position and the shared resolver's last-contribution-wins rule decides. That is
 * why `tailwind-merge` is not a dependency here.
 */

/**
 * Parse a static class string (a `styled()` base, a string variant value, a string
 * compound-variant style) into ordinary style props.
 */
export function parseStaticStyle(
  input: string,
  config: StyleFrontendConfig
): Record<string, any> {
  return resolveTailwindClassName(input, config)
}

const normalizedStaticConfigCache = new WeakMap<
  FrontendStaticConfig,
  WeakMap<StyleFrontendConfig, { revision: number; value: FrontendStaticConfig }>
>()
const normalizedStaticConfigs = new WeakSet<FrontendStaticConfig>()

function normalizeTailwindStaticConfig<Config extends FrontendStaticConfig>(
  staticConfig: Config,
  config: StyleFrontendConfig
): Config {
  if (normalizedStaticConfigs.has(staticConfig)) {
    return staticConfig
  }
  let configCache = normalizedStaticConfigCache.get(staticConfig)
  const cached = configCache?.get(config)
  const revision = (config as any)[configRevisionSymbol]?.revision || 0
  if (cached && cached.revision === revision) return cached.value as Config

  let variants = staticConfig.variants
  if (variants) {
    variants = Object.fromEntries(
      Object.entries(variants).map(([variantName, definition]) => [
        variantName,
        typeof definition === 'object' && definition
          ? Object.fromEntries(
              Object.entries(definition).map(([matcher, value]) => [
                matcher,
                typeof value === 'string' ? parseStaticStyle(value, config) : value,
              ])
            )
          : definition,
      ])
    )
  }

  const compoundVariants = staticConfig.compoundVariants?.map((compoundVariant) => ({
    ...compoundVariant,
    style:
      typeof compoundVariant.style === 'string'
        ? parseStaticStyle(compoundVariant.style, config)
        : compoundVariant.style,
  }))

  // A class base is the one class string with no authored position, so its unclaimed
  // classes cannot ride the forward pass the way a call-site className does. Partition
  // them out: `baseStyle` holds styles only, and the raw remainder goes to
  // `passthroughClassName` for the renderer to prepend.
  let baseStyle = staticConfig.baseStyle
  let passthroughClassName = staticConfig.passthroughClassName
  if (staticConfig.baseClassName) {
    const { className, ...styles } = parseStaticStyle(staticConfig.baseClassName, config)
    baseStyle = styles
    passthroughClassName = className
  }

  const normalized = {
    ...staticConfig,
    baseStyle,
    passthroughClassName,
    variants,
    compoundVariants,
  } as Config
  normalizedStaticConfigs.add(normalized)
  configCache ||= new WeakMap()
  configCache.set(config, { revision, value: normalized })
  normalizedStaticConfigCache.set(staticConfig, configCache)
  return normalized
}

export const tailwindStyleFrontend: StyleFrontend = {
  getClassPlan: getTailwindClassPlan,
  normalizeStaticConfig: normalizeTailwindStaticConfig,
}
