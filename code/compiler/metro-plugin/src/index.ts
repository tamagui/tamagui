import { createRequire } from 'node:module'
import { join } from 'node:path'

import Static from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/static'

import { defaultMetroCompilerCacheRoot } from './compilerCache'
import { MetroCompilerFrontend } from './frontend'
import { writeMetroCompilerTransformerBridge } from './transformer'
import { composeMetroGetTransformOptions } from './transformOptions'

export type MetroTamaguiOptions = TamaguiOptions & {
  /**
   * @deprecated CSS interop is no longer supported. Use `tamagui generate` instead.
   */
  cssInterop?: boolean
  /** Override the ignored on-disk handoff used by Metro transform workers. */
  compilerCacheRoot?: string
}

// Use a loose type for metro config to avoid version-specific type incompatibilities
type MetroConfigInput = {
  projectRoot?: string
  resolver?: any
  transformer?: any
  transformerPath?: string
  [key: string]: any
}

const frontends = new WeakMap<object, MetroCompilerFrontend>()
const { loadTamaguiBuildConfigSync } = Static
const requireFromPlugin = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

export function getMetroCompilerFrontend(
  metroConfig: MetroConfigInput
): MetroCompilerFrontend | null {
  return frontends.get(metroConfig) ?? null
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
  const { compilerCacheRoot, cssInterop, ...tamaguiOptionsIn } = optionsIn || {}

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

  if (!options.disable) {
    const projectRoot = metroConfig.projectRoot ?? process.cwd()
    const requireFromProject = createRequire(join(projectRoot, 'package.json'))
    const originalBabelTransformerPath =
      metroConfig.transformer.babelTransformerPath ??
      requireFromProject.resolve('metro-babel-transformer')
    const cacheBaseRoot = compilerCacheRoot ?? defaultMetroCompilerCacheRoot(projectRoot)
    const frontend = new MetroCompilerFrontend({
      projectRoot,
      resolver: metroConfig.resolver,
      transformer: metroConfig.transformer,
      tamaguiOptions: options,
      originalBabelTransformerPath,
      cacheRoot: cacheBaseRoot,
      reportDiagnostic(diagnostic) {
        console.warn(`[@tamagui/metro-plugin] ${diagnostic.code}: ${diagnostic.message}`)
      },
    })
    const transformerFactoryPath = requireFromPlugin.resolve(
      '@tamagui/metro-plugin/transformer'
    )
    metroConfig.transformer.babelTransformerPath = writeMetroCompilerTransformerBridge(
      transformerFactoryPath,
      {
        cacheBaseRoot,
        originalBabelTransformerPath,
      }
    )
    const userGetTransformOptions = metroConfig.transformer.getTransformOptions
    metroConfig.transformer.getTransformOptions = composeMetroGetTransformOptions(
      frontend,
      userGetTransformOptions
    )
    frontends.set(metroConfig, frontend)
  }

  return metroConfig
}

export {
  METRO_COMPILER_CACHE_VERSION,
  MetroCompilerCache,
  MetroCompilerCacheError,
  defaultMetroCompilerCacheRoot,
} from './compilerCache'
export type { MetroCompilerDiagnostic } from './diagnostics'
export type {
  MetroCompilerGeneration,
  MetroCompilerScanOptions,
  MetroCompilerUpdate,
} from './frontend'
