import {
  type FrontendStaticConfig,
  type FrontendStaticConfigNormalization,
  type FrontendClassSink,
  type StyleFrontend,
  type StyleFrontendConfig,
} from '@tamagui/core/internal-runtime'
import { getTailwindClassPlan, resolveTailwindClassName } from './candidate'

/**
 * The Tailwind frontend descriptor.
 *
 * The shared style cursor tokenizes `className` once and asks this descriptor to
 * emit the entries for each candidate. Everything after this point — value programs,
 * per-longhand forward merging, web lowering, native evaluation — is shared.
 *
 * Owned candidates are never string-merged: each contributes at its authored
 * position and the shared resolver's last-contribution-wins rule decides. That is
 * why `tailwind-merge` is not a dependency here.
 */

/**
 * Parse a static class string (a `styled()` base, a string variant value) into
 * ordinary style props.
 */
export function parseStaticStyle(
  input: string,
  config: StyleFrontendConfig
): Record<string, any> {
  return resolveTailwindClassName(input, config)
}

function normalizeTailwindStaticConfig(
  staticConfig: FrontendStaticConfig,
  config: StyleFrontendConfig
): FrontendStaticConfigNormalization {
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

  return { baseStyle, passthroughClassName, variants }
}

function resolveTailwindCandidate(
  candidate: string,
  config: StyleFrontendConfig,
  sink: FrontendClassSink
): boolean | null {
  const plan = getTailwindClassPlan(candidate, config)
  if (plan === 'raw') return true
  if (plan === null) return null
  const parent = Array.isArray(plan) ? null : plan
  const entries = parent ? parent.entries : plan
  for (let index = 0; index < entries.length; index++) sink(entries[index])
  return parent?.preserveRawClass || false
}

export const tailwindStyleFrontend: StyleFrontend = {
  resolveClassName: resolveTailwindCandidate,
  normalizeStaticConfig: normalizeTailwindStaticConfig,
}
