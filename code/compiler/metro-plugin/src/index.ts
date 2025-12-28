import { loadTamaguiBuildConfigSync, type TamaguiOptions } from '@tamagui/static'

export type MetroTamaguiOptions = TamaguiOptions & {
  /**
   * @deprecated CSS interop is no longer supported. Use `tamagui generate` instead.
   */
  cssInterop?: boolean
}

// Use a loose type for metro config to avoid version-specific type incompatibilities
type MetroConfigInput = {
  resolver?: any
  transformer?: any
  transformerPath?: string
  [key: string]: any
}

/**
 * Configure Metro for Tamagui.
 *
 * This is now a simplified wrapper that just ensures CSS is enabled and
 * loads your Tamagui config. For CSS generation, use the CLI:
 *
 * 1. Create a `tamagui.build.ts` with `outputCSS` option
 * 2. Run `tamagui generate` before your build
 * 3. Import the generated CSS in your app's layout
 *
 * @example
 * ```js
 * // metro.config.js
 * const { getDefaultConfig } = require('expo/metro-config')
 * const { withTamagui } = require('@tamagui/metro-plugin')
 *
 * const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
 * module.exports = withTamagui(config, {
 *   components: ['tamagui'],
 *   config: './tamagui.config.ts',
 * })
 * ```
 */
export function withTamagui(
  metroConfig: MetroConfigInput,
  optionsIn?: MetroTamaguiOptions
): MetroConfigInput {
  const { cssInterop, ...tamaguiOptionsIn } = optionsIn || {}

  if (cssInterop) {
    console.warn(
      '[@tamagui/metro-plugin] cssInterop option is deprecated. Use `tamagui generate` to pre-generate CSS instead.'
    )
  }

  const options = {
    ...tamaguiOptionsIn,
    ...loadTamaguiBuildConfigSync(tamaguiOptionsIn),
  }

  // Ensure CSS files can be resolved
  metroConfig.resolver = {
    ...(metroConfig.resolver as any),
    sourceExts: [...new Set([...(metroConfig.resolver?.sourceExts || []), 'css'])],
  }

  // Store tamagui options for potential use by other tools
  metroConfig.transformer = {
    ...metroConfig.transformer,
    tamagui: options,
  }

  return metroConfig
}
