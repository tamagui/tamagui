import Static from '@tamagui/static'
import type {
  IslandThemeBridge,
  TamaguiOptions,
  ZeroCSSArtifact,
  ZeroIsland,
  ZeroRuntimeResolved,
  ZeroViolationSite,
} from '@tamagui/static'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { Compiler } from 'webpack'

/**
 * Webpack's half of the zero-runtime mode.
 *
 * One controller instance is shared by every compilation of a build (server,
 * client, and each island child compilation), so the loader, the plugin, and
 * the island builds all write into the same CSS artifact and the same
 * violation list.
 */

export const ZERO_CSS_FILENAME = 'tamagui-zero.css'
export const ZERO_ISLAND_DIRNAME = 'tamagui-islands'

export interface WebpackZeroController {
  options: TamaguiOptions
  resolved: ZeroRuntimeResolved
  artifact: ZeroCSSArtifact
  cssHref: string
  root: string
  /** Directory the artifact and island bundles are published from. */
  publicDir: string
  bridges: Map<string, IslandThemeBridge[]>
  violations: ZeroViolationSite[]
  loaderIds: Map<string, string>
  islandModuleIds: Map<string, string>
  /** Set while an island child compilation runs, so it never re-enters zero mode. */
  islandBuild: string | null
  /** Content hash of the evaluated config's CSS, part of the artifact identity. */
  configHash: string
}

const normalizePath = (value: string) => value.replace(/\\/g, '/')

export const zeroModuleKey = (value: string) =>
  normalizePath(value).replace(/\.(?:js|jsx|ts|tsx|mjs|cjs)$/, '')

/**
 * Process-level, not module-level. The plugin is imported as ESM while webpack
 * resolves the loader through the CJS entry, so a module-scoped map gives the
 * loader and the plugin two different controllers and the artifact silently
 * loses every contribution the loader made.
 */
const CONTROLLERS_KEY = '__tamagui_webpack_zero_controllers__'
const controllers: Map<string, WebpackZeroController> = ((globalThis as any)[
  CONTROLLERS_KEY
] ||= new Map())

/** One controller per project root, shared across this build's compilations. */
export function getWebpackZeroController(
  options: TamaguiOptions,
  root: string
): WebpackZeroController | null {
  const resolved = Static.resolveZeroRuntimeSync(options, root)
  if (resolved.mode !== 'enforce') return null
  Static.assertZeroIntegrationSupport('next-webpack', resolved)

  const existing = controllers.get(root)
  if (existing) return existing

  const publicDir = path.join(root, 'public')
  const cssHref = `/${ZERO_CSS_FILENAME}`
  const artifact = new Static.ZeroCSSArtifact(resolved.cssPath)
  artifact.expectIslands(resolved.islands.map((island) => island.id))

  const configPath = path.isAbsolute(options.config || '')
    ? options.config!
    : path.resolve(root, options.config || 'tamagui.config.ts')

  for (const island of resolved.islands) {
    Static.writeIslandModules({
      island,
      configPath,
      scriptUrl: `/${ZERO_ISLAND_DIRNAME}/${island.id}.js`,
      cssHref,
    })
  }

  const controller: WebpackZeroController = {
    options,
    resolved,
    artifact,
    cssHref,
    root,
    publicDir,
    bridges: new Map(),
    violations: [],
    loaderIds: new Map(
      resolved.islands.map((island) => [zeroModuleKey(island.loader), island.id])
    ),
    islandModuleIds: new Map(
      resolved.islands.map((island) => [zeroModuleKey(island.module), island.id])
    ),
    islandBuild: null,
    configHash: '',
  }
  controllers.set(root, controller)
  return controller
}

/**
 * Builds one island as a separate webpack compilation with
 * `TAMAGUI_RUNTIME='full'`. React is externalized to the handoff the generated
 * loader publishes, so both graphs share one React instance.
 */
export async function buildWebpackIsland(input: {
  island: ZeroIsland
  controller: WebpackZeroController
  webpack: typeof import('webpack')
  mode: 'development' | 'production'
  resolve: Compiler['options']['resolve']
  moduleRules: unknown[]
  /** The parent compilation's DefinePlugin and ProvidePlugin definitions. */
  defines: { define: Record<string, unknown>; provide: Record<string, unknown> }
}): Promise<{ file: string; hash: string }> {
  const { controller, island } = input
  const outputPath = path.join(controller.publicDir, ZERO_ISLAND_DIRNAME)
  controller.islandBuild = island.id
  try {
    await new Promise<void>((resolve, reject) => {
      input.webpack(
        {
          mode: input.mode,
          devtool: false,
          entry: island.entry,
          context: controller.root,
          target: 'web',
          resolve: input.resolve as any,
          module: { rules: input.moduleRules as any },
          // 'global' plus segment arrays, because webpack treats a dotted
          // external string as one literal property name
          externalsType: 'global',
          externals: { ...Static.ISLAND_EXTERNAL_GLOBAL_PATHS },
          output: {
            path: outputPath,
            filename: `${island.id}.js`,
            iife: true,
            library: { type: 'var', name: `tamaguiIsland_${island.id}` },
          },
          plugins: [
            new input.webpack.ProvidePlugin(input.defines.provide as any),
            new input.webpack.DefinePlugin({
              // the parent compilation's env surface first, so the island sees the
              // same `process.env` shape the zero entry was built against
              ...input.defines.define,
              'process.env.TAMAGUI_RUNTIME': JSON.stringify('full'),
              'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify('1'),
              'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
              'process.env.TAMAGUI_IS_SERVER': JSON.stringify(''),
              'process.env.TAMAGUI_ENVIRONMENT': JSON.stringify('client'),
              'process.env.IS_STATIC': JSON.stringify(''),
              'process.env.NODE_ENV': JSON.stringify('production'),
              __DEV__: JSON.stringify(false),
            }),
          ],
        },
        (error, stats) => {
          if (error) return reject(error)
          if (stats?.hasErrors()) {
            return reject(new Error(stats.toString({ all: false, errors: true })))
          }
          resolve()
        }
      )
    })
  } finally {
    controller.islandBuild = null
  }

  const file = path.join(outputPath, `${island.id}.js`)
  controller.artifact.markIslandComplete(island.id)
  return {
    file,
    hash: createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 16),
  }
}

/**
 * The parent compilation's environment substitutions and module shims.
 *
 * The island is a separate compilation of the same app, so it must be built
 * against the same environment. Next covers browser `process` with a
 * ProvidePlugin shim rather than by defining every key, so inheriting only the
 * DefinePlugin leaves the island throwing `process is not defined` on load.
 */
export function collectDefinitions(compiler: Compiler): {
  define: Record<string, unknown>
  provide: Record<string, unknown>
} {
  const define: Record<string, unknown> = {}
  const provide: Record<string, unknown> = {}
  for (const plugin of compiler.options.plugins ?? []) {
    const candidate = plugin as { definitions?: Record<string, unknown> } | undefined
    if (!candidate?.definitions) continue
    if (plugin?.constructor?.name === 'DefinePlugin') {
      Object.assign(define, candidate.definitions)
    } else if (plugin?.constructor?.name === 'ProvidePlugin') {
      Object.assign(provide, candidate.definitions)
    }
  }
  return { define, provide }
}
