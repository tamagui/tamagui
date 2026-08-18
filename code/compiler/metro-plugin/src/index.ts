import { createRequire } from 'node:module'
import { isAbsolute, join } from 'node:path'

import Static from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/static'

import { defaultMetroCompilerCacheRoot } from './compilerCache'
import { applyMetroZeroRuntime } from './zeroSerializer'
import { createMetroZeroController } from './zeroRuntime'
import { MetroCompilerFrontend } from './frontend'
import { writeMetroCompilerTransformerBridge } from './transformer'
import { composeMetroGetTransformOptions } from './transformOptions'

export type MetroTamaguiOptions = TamaguiOptions & {
  /** Override the ignored on-disk handoff used by Metro transform workers. */
  compilerCacheRoot?: string
  /**
   * Set by the zero-runtime island bundle request. An island is a second Metro
   * bundle with `TAMAGUI_RUNTIME='full'` and its own entry, so this invocation
   * keeps the full runtime and only contributes its CSS fragment.
   */
  zeroIslandBuild?: string
  /**
   * Directory the zero CSS artifact and island bundles are published from,
   * relative to the project root.
   *
   * @default 'public'
   */
  zeroPublicDir?: string
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
  const {
    compilerCacheRoot,
    zeroIslandBuild,
    zeroPublicDir = 'public',
    ...tamaguiOptionsIn
  } = optionsIn || {}

  const options = loadTamaguiBuildConfigSync(tamaguiOptionsIn)

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

  const zeroProjectRoot = metroConfig.projectRoot ?? process.cwd()
  const zero = createMetroZeroController(
    options,
    zeroProjectRoot,
    zeroIslandBuild ?? null,
    zeroPublicDir
  )

  // `report` runs the analysis through the frontend and changes nothing else,
  // so it never installs the serializer that owns the artifact and the gate.
  if (zero?.isEnforcing) {
    applyMetroZeroRuntime(metroConfig, zero)
  }

  if (!options.disable) {
    const projectRoot = metroConfig.projectRoot ?? process.cwd()
    const requireFromProject = createRequire(join(projectRoot, 'package.json'))
    // getDefaultConfig sets this to the bare specifier 'metro-babel-transformer',
    // and createRequire needs an absolute path, so resolve either shape here
    const configuredBabelTransformerPath =
      metroConfig.transformer.babelTransformerPath ?? 'metro-babel-transformer'
    const originalBabelTransformerPath = isAbsolute(configuredBabelTransformerPath)
      ? configuredBabelTransformerPath
      : requireFromProject.resolve(configuredBabelTransformerPath)
    const cacheBaseRoot = compilerCacheRoot ?? defaultMetroCompilerCacheRoot(projectRoot)
    const frontend = new MetroCompilerFrontend({
      projectRoot,
      resolver: metroConfig.resolver,
      transformer: metroConfig.transformer,
      tamaguiOptions: options,
      originalBabelTransformerPath,
      cacheRoot: cacheBaseRoot,
      zero,
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
        projectRoot,
        // an integration-owned literal, never an ambient shell value
        runtimeLiteral: zero?.isEnforcing && !zero.islandBuild ? 'zero' : 'full',
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
