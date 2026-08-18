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
import type { Compiler, LoaderContext, Module } from 'webpack'

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
  /** Modules whose loader actually ran this build, for the warm-cache receipt. */
  loaderModules: Set<string>
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
    loaderModules: new Set(),
    configHash: '',
  }
  controllers.set(root, controller)
  return controller
}

/**
 * One module's zero-build side effects, carried on webpack's own module record.
 *
 * The loader contributes a module's atomic CSS, theme-bridge rules and contract
 * violations to the build; webpack's module cache skips the loader on a warm
 * build, so a build that read those only from the loader's return path emitted
 * an artifact missing every rule it never collected while still deriving
 * TAMAGUI_DID_OUTPUT_CSS from it, and silently dropped violations that must
 * fail the build. `buildInfo` is restored with the cached module, so the facts
 * travel with the thing they describe instead of in a second cache that could
 * disagree with it.
 */
export interface ZeroModuleBuildInfo {
  /** Island id when this module belongs to an island compilation, else null. */
  island: string | null
  css: string
  bridgeCSS: [string, string][]
  bridges: [string, IslandThemeBridge[]][]
  violations: ZeroViolationSite[]
}

const BUILD_INFO_KEY = 'tamaguiZero'

export function publishZeroBuildInfo(
  controller: WebpackZeroController,
  context: LoaderContext<unknown>,
  info: ZeroModuleBuildInfo
): void {
  const buildInfo = (context as any)._module?.buildInfo
  if (!buildInfo) {
    throw new Error(
      `[tamagui zero-runtime] webpack gave the Tamagui loader no module record for ${context.resourcePath}, so this module's CSS could not be carried into the one generated artifact.`
    )
  }
  buildInfo[BUILD_INFO_KEY] = info
  controller.loaderModules.add(context.resourcePath)
}

export function readZeroBuildInfo(module: Module): ZeroModuleBuildInfo | null {
  return ((module as any)?.buildInfo?.[BUILD_INFO_KEY] as ZeroModuleBuildInfo) ?? null
}

/**
 * Every module in a compilation, including the ones scope hoisting swallowed.
 *
 * `compilation.modules` reports a ConcatenatedModule in place of the modules it
 * merged, and in a production Next build most app pages are inside one. Reading
 * only the top level finds `_app` but not the page that imported the violation,
 * which reads as a clean build.
 */
export function* flattenModules(modules: Iterable<Module>): Generator<Module> {
  for (const module of modules) {
    yield module
    const inner = (module as any).modules as Module[] | undefined
    if (inner) yield* flattenModules(inner)
  }
}

/**
 * Replays every module's recorded side effects into the artifact, whether its
 * loader ran this build or webpack restored it from cache.
 */
export function collectZeroBuildInfo(
  controller: WebpackZeroController,
  modules: Iterable<Module>
): { modules: number; restored: number } {
  let seen = 0
  let restored = 0
  for (const module of flattenModules(modules)) {
    const info = readZeroBuildInfo(module)
    if (!info) continue
    seen++
    const resource = (module as any).resource as string
    if (!controller.loaderModules.has(resource)) restored++
    if (info.island) {
      controller.artifact.setIslandModuleCSS(info.island, resource, info.css)
      continue
    }
    controller.artifact.setZeroModuleCSS(resource, info.css)
    for (const [identifier, rules] of info.bridgeCSS) {
      controller.artifact.setBridgeRules(identifier, rules)
    }
    Static.mergeIslandBridges(controller.bridges, new Map(info.bridges))
    controller.violations.push(...info.violations)
  }
  return { modules: seen, restored }
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
          // the island's own modules carry their atomic CSS the same way the
          // zero graph's do, so a cached island module still contributes
          if (stats) collectZeroBuildInfo(controller, stats.compilation.modules)
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
