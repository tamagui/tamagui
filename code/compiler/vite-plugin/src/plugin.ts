import Static from '@tamagui/static'
import type { TamaguiOptions, ZeroGraphReceipt } from '@tamagui/static'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createFilter,
  createIdResolver,
  createRunnableDevEnvironment,
  defaultClientConditions,
  defaultClientMainFields,
  isRunnableDevEnvironment,
  resolveConfig,
} from 'vite'
import type {
  EnvironmentOptions,
  EnvironmentModuleNode,
  Plugin,
  PluginOption,
  ResolvedConfig,
  ViteDevServer,
} from 'vite'
import type { Environment } from 'vite'
import type { ViteTamaguiLoader } from './loadTamagui'
import { createViteTamaguiLoader, TAMAGUI_EVALUATION_ENVIRONMENT } from './loadTamagui'
import {
  createCompilerStatsReport,
  formatCompilerStatsReport,
  type CompilerModuleReport,
} from './compilerStats'
import {
  assertZeroGraph,
  buildIsland,
  createZeroRuntimeController,
  finalizeZeroCSS,
  zeroModuleKey,
  ZERO_CSS_FILENAME,
  ZERO_ISLAND_DIRNAME,
  type ZeroIslandBuildContext,
  type ZeroRuntimeController,
} from './zeroRuntime'

const environmentSpecificTransformPluginNames = new Set([
  'one:compiler',
  'one:compiler-css-to-js',
])

const oneTsconfigPathsPluginName = 'one:tsconfig-paths'
const bareTamaguiPackage = /^@tamagui\/[^/?#]+(?:[/?#]|$)/
const inlineEvaluationTamaguiPackage = /^@tamagui\/(?:config|core|slider|web)(?:[/?#]|$)/
const externalizablePackageExtensions = new Set(['', '.js', '.mjs', '.cjs'])

// Export condition the compiler's evaluation environment resolves with. A
// Tamagui package that cannot load outside an app publishes a runtime-free
// build under this key; nothing else in a user's graph ever sees it.
const TAMAGUI_COMPILER_CONDITION = 'tamagui-compiler'

// A condition only decides anything while Vite is the one resolving. Externalized
// packages are handed to node as a bare specifier, and node resolves them again
// under its own conditions, so a compiler build wins the first resolution and is
// thrown away at load time. Packages publishing one therefore have to be inlined
// into the evaluation graph. They are the cheap ones to inline by construction:
// the build exists precisely because it carries no app runtime.
function packageDeclaresCompilerCondition(packageDir: string) {
  const manifest = path.join(packageDir, 'package.json')
  if (!existsSync(manifest)) return false
  try {
    const exports = JSON.parse(readFileSync(manifest, 'utf8')).exports
    return JSON.stringify(exports ?? null).includes(`"${TAMAGUI_COMPILER_CONDITION}"`)
  } catch {
    return false
  }
}
type EvaluationNoExternal = NonNullable<EnvironmentOptions['resolve']>['noExternal']

function mergeEvaluationNoExternal(
  required: (string | RegExp)[],
  userNoExternal: EvaluationNoExternal
): EvaluationNoExternal {
  if (userNoExternal === true) return true
  if (!userNoExternal) return required
  return [
    ...required,
    ...(Array.isArray(userNoExternal) ? userNoExternal : [userNoExternal]),
  ]
}

type EvaluationResolveIdHandler = (this: any, source: string, ...args: any[]) => any
type EvaluationBarePackageResolver = (
  environment: Environment,
  source: string,
  importer?: string
) =>
  | Promise<string | { id: string; external: true } | undefined>
  | string
  | { id: string; external: true }
  | undefined

function createEvaluationResolveId(
  plugin: Plugin,
  resolveBarePackage?: EvaluationBarePackageResolver
): Plugin['resolveId'] {
  const resolveId = plugin.resolveId
  if (plugin.name !== oneTsconfigPathsPluginName || !resolveId) {
    return resolveId
  }

  const handler = (
    typeof resolveId === 'object' ? resolveId.handler : resolveId
  ) as EvaluationResolveIdHandler
  const evaluationHandler = function (this: any, source: string, ...args: any[]) {
    // One's TS-path resolver can map workspace package imports to Metro's CJS
    // directory fallbacks before Vite can apply the package exports map. Keep
    // user TS aliases in this resolver, but let Tamagui packages use Vite's
    // normal package resolution and externalization policy.
    if (bareTamaguiPackage.test(source)) {
      const importer = typeof args[0] === 'string' ? args[0] : undefined
      return resolveBarePackage?.(this.environment, source, importer)
    }
    return Reflect.apply(handler, this, [source, ...args])
  }

  return typeof resolveId === 'object'
    ? { ...resolveId, handler: evaluationHandler }
    : evaluationHandler
}

function createEvaluationPluginFacade(
  plugin: Plugin,
  resolveBarePackage?: EvaluationBarePackageResolver
): Plugin {
  return {
    name: plugin.name,
    enforce: plugin.enforce,
    resolveId: createEvaluationResolveId(plugin, resolveBarePackage),
    load: plugin.load,
    transform: environmentSpecificTransformPluginNames.has(plugin.name)
      ? undefined
      : plugin.transform,
  }
}

const tamaguiEvaluationPluginNames = new Set([
  'tamagui',
  'tamagui-extract',
  'tamagui-rnw-lite',
])

function isEvaluationUserPlugin(plugin: Plugin) {
  return (
    !!(plugin.resolveId || plugin.load || plugin.transform) &&
    plugin.name !== 'alias' &&
    !plugin.name.startsWith('native:') &&
    !plugin.name.startsWith('vite:') &&
    !plugin.name.startsWith('builtin:vite-') &&
    !tamaguiEvaluationPluginNames.has(plugin.name)
  )
}

function isEvaluationCorePlugin(plugin: Plugin) {
  return (
    plugin.name === 'alias' ||
    plugin.name.startsWith('vite:') ||
    plugin.name.startsWith('builtin:vite-')
  )
}

function isConfiguredEvaluationPackage(source: string, packages: Set<string>) {
  const cleanSource = source.split(/[?#]/, 1)[0]
  return [...packages].some(
    (packageName) =>
      cleanSource === packageName || cleanSource.startsWith(`${packageName}/`)
  )
}

function getEvaluationPackageName(source: string | undefined) {
  if (!source) return
  const cleanSource = source.split(/[?#]/, 1)[0]
  if (
    !cleanSource ||
    cleanSource.startsWith('.') ||
    cleanSource.startsWith('#') ||
    cleanSource.startsWith('\0') ||
    path.isAbsolute(cleanSource)
  ) {
    return
  }
  if (cleanSource.startsWith('@')) {
    const [scope, name] = cleanSource.split('/')
    return scope && name ? `${scope}/${name}` : undefined
  }
  const [name] = cleanSource.split('/')
  return name && !path.extname(name) ? name : undefined
}

function scanInstalledTamaguiPackages(
  root: string,
  configuredEvaluationPackages: Set<string>
) {
  const packageRequire = createRequire(path.join(root, 'package.json'))
  // externalizable: evaluated through node, the default for a Tamagui package.
  // compilerCondition: publishes a runtime-free build the compiler must inline
  // to keep, see packageDeclaresCompilerCondition.
  const externalizable = new Set<string>()
  const compilerCondition = new Set<string>()

  for (const modulePath of packageRequire.resolve.paths('@tamagui/core') || []) {
    const scopePath = path.join(modulePath, '@tamagui')
    if (!existsSync(scopePath)) continue
    for (const entry of readdirSync(scopePath, { withFileTypes: true })) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
      const packageName = `@tamagui/${entry.name}`
      if (
        inlineEvaluationTamaguiPackage.test(packageName) ||
        configuredEvaluationPackages.has(packageName)
      ) {
        continue
      }
      if (packageDeclaresCompilerCondition(path.join(scopePath, entry.name))) {
        compilerCondition.add(packageName)
      } else {
        externalizable.add(packageName)
      }
    }
  }

  return { externalizable, compilerCondition }
}

function getEvaluationResolve(
  resolve: ResolvedConfig['environments'][string]['resolve'],
  root: string,
  disableTsconfigPaths: boolean,
  configuredEvaluationPackages: Set<string>
) {
  const noExternal = resolve.noExternal
  const noExternalFilter =
    noExternal && noExternal !== true
      ? createFilter(undefined, noExternal, { resolve: false })
      : undefined
  const isNoExternalPackage =
    noExternal === true
      ? () => true
      : noExternalFilter
        ? (packageName: string) => !noExternalFilter(packageName)
        : () => false

  return {
    ...resolve,
    external:
      resolve.external === true
        ? (true as const)
        : [
            ...new Set([
              ...(resolve.external || []).filter(
                (packageName) =>
                  !isConfiguredEvaluationPackage(
                    packageName,
                    configuredEvaluationPackages
                  )
              ),
              ...[
                ...scanInstalledTamaguiPackages(root, configuredEvaluationPackages)
                  .externalizable,
              ].filter((packageName) => !isNoExternalPackage(packageName)),
            ]),
          ],
    ...(disableTsconfigPaths && { tsconfigPaths: false }),
  }
}

function isConfiguredExternalPackage(
  source: string,
  external: string[] | true | undefined
) {
  if (external === true) return true
  const cleanSource = source.split(/[?#]/, 1)[0]
  return external?.some(
    (packageName) =>
      cleanSource === packageName || cleanSource.startsWith(`${packageName}/`)
  )
}

function createServeEvaluationConfig(
  config: ResolvedConfig,
  configuredEvaluationPackages: Set<string>
): ResolvedConfig {
  const environment = config.environments[TAMAGUI_EVALUATION_ENVIRONMENT]
  let packageResolver: ReturnType<typeof createIdResolver> | undefined
  const resolveBarePackage: EvaluationBarePackageResolver = async (
    evaluationEnvironment,
    source,
    importer
  ) => {
    const resolved = await packageResolver?.(evaluationEnvironment, source, importer)
    if (!resolved) return
    const cleanResolved = resolved.split(/[?#]/, 1)[0]
    if (
      !inlineEvaluationTamaguiPackage.test(source) &&
      !isConfiguredEvaluationPackage(source, configuredEvaluationPackages) &&
      isConfiguredExternalPackage(source, evaluationEnvironment.config.resolve.external)
    ) {
      return { id: source, external: true }
    }
    if (
      inlineEvaluationTamaguiPackage.test(source) ||
      isConfiguredEvaluationPackage(source, configuredEvaluationPackages) ||
      !normalizePath(cleanResolved).includes('/node_modules/') ||
      !externalizablePackageExtensions.has(path.extname(cleanResolved))
    ) {
      return resolved
    }
    return { id: source, external: true }
  }
  const plugins = environment.plugins.flatMap((plugin) => {
    if (isEvaluationCorePlugin(plugin)) {
      return [plugin]
    }
    if (isEvaluationUserPlugin(plugin)) {
      return [createEvaluationPluginFacade(plugin, resolveBarePackage)]
    }
    return []
  })
  const resolve = getEvaluationResolve(
    environment.resolve,
    config.root,
    plugins.some((plugin) => plugin.name === oneTsconfigPathsPluginName),
    configuredEvaluationPackages
  )

  const evaluationConfig: ResolvedConfig = {
    ...config,
    environments: {
      ...config.environments,
      [TAMAGUI_EVALUATION_ENVIRONMENT]: {
        ...environment,
        plugins,
        resolve,
      },
    },
  }
  packageResolver = createIdResolver(evaluationConfig)
  return evaluationConfig
}

async function createOwnedEvaluationConfig(
  config: ResolvedConfig,
  configuredEvaluationPackages: Set<string>
) {
  const environment = config.environments[TAMAGUI_EVALUATION_ENVIRONMENT]
  const plugins = environment.plugins
    .filter(isEvaluationUserPlugin)
    .map((plugin) => createEvaluationPluginFacade(plugin))
  const resolve = getEvaluationResolve(
    environment.resolve,
    config.root,
    plugins.some((plugin) => plugin.name === oneTsconfigPathsPluginName),
    configuredEvaluationPackages
  )
  const { createEnvironment: _createEnvironment, ...dev } = environment.dev

  // ModuleRunner needs Vite's serve-time core pipeline (especially import
  // analysis), but user plugin selection must remain the already-resolved
  // pipeline for the outer command. The facades retain only evaluation hooks,
  // so resolving this owned config cannot replay user configuration or outer
  // lifecycles.
  return resolveConfig(
    {
      configFile: false,
      root: config.root,
      mode: config.mode,
      logLevel: config.logLevel,
      plugins,
      define: environment.define,
      resolve,
      environments: {
        [TAMAGUI_EVALUATION_ENVIRONMENT]: {
          consumer: environment.consumer,
          keepProcessEnv: environment.keepProcessEnv,
          define: environment.define,
          resolve,
          optimizeDeps: environment.optimizeDeps,
          dev: {
            ...dev,
            moduleRunnerTransform: true,
          },
        },
      },
    },
    'serve',
    config.mode
  )
}

// handle ESM/CJS duality for plugin dependencies - resolve from plugin's location, not user's project
const _pluginRequire = createRequire(
  typeof __filename === 'string' ? __filename : fileURLToPath(import.meta.url)
)
const resolve = (name: string) => _pluginRequire.resolve(name)
const normalizePath = (value: string) => value.replace(/\\/g, '/')

const PLUGIN_INSTANCE_KEY = '__tamagui_vite_plugin_instance__'

function reportCompilerStats(root: string, reports: Map<string, CompilerModuleReport>) {
  const report = createCompilerStatsReport(root, reports)
  console.info(
    formatCompilerStatsReport(report, process.env.TAMAGUI_COMPILER_STATS === 'verbose')
  )
  if (process.env.TAMAGUI_COMPILER_STATS_FILE) {
    const outputPath = path.resolve(root, process.env.TAMAGUI_COMPILER_STATS_FILE)
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
    console.info(
      `[tamagui] compiler stats JSON: ${path.relative(process.cwd(), outputPath)}`
    )
  }
}

function getNextPluginInstanceId() {
  const next = ((globalThis as any)[PLUGIN_INSTANCE_KEY] || 0) + 1
  ;(globalThis as any)[PLUGIN_INSTANCE_KEY] = next
  return next
}

// resolves package ids against the user's project root (not the plugin's
// install location). returns true if the id is resolvable, false if the
// dep isn't installed, safe to call for optional deps.
function isInstalled(projectRoot: string, id: string): boolean {
  try {
    const req = createRequire(path.join(projectRoot, 'package.json'))
    req.resolve(id)
    return true
  } catch {
    return false
  }
}

function addIfInstalled(
  userConf: { optimizeDeps?: { include?: string[] } },
  projectRoot: string | undefined,
  ids: string[]
): void {
  const root = projectRoot || process.cwd()
  userConf.optimizeDeps ||= {}
  userConf.optimizeDeps.include ||= []
  for (const id of ids) {
    if (!userConf.optimizeDeps.include.includes(id) && isInstalled(root, id)) {
      userConf.optimizeDeps.include.push(id)
    }
  }
}

type AliasOptions = {
  /** use @tamagui/react-native-web-lite, 'without-animated' for smaller bundle */
  rnwLite?: boolean | 'without-animated'
  /** alias react-native-svg to @tamagui/react-native-svg */
  svg?: boolean
}

type AliasEntry = { find: string | RegExp; replacement: string }

/**
 * returns vite-compatible aliases for tamagui
 * use this when you need control over alias ordering in your config
 */
export function tamaguiAliases(options: AliasOptions = {}): AliasEntry[] {
  const aliases: AliasEntry[] = []

  if (options.svg) {
    aliases.push({
      find: 'react-native-svg',
      replacement: resolve('@tamagui/react-native-svg'),
    })
  }

  if (options.rnwLite) {
    // base package path for subpath imports (package directory, not entry file)
    const rnwlBase = path.dirname(resolve('@tamagui/react-native-web-lite/package.json'))
    // vite aliases need the esm entry; require.resolve points at cjs.
    const rnwl = normalizePath(
      path.join(
        rnwlBase,
        options.rnwLite === 'without-animated'
          ? 'dist/esm/without-animated.mjs'
          : 'dist/esm/index.mjs'
      )
    )
    // only alias deep imports that rnw-lite actually implements. unimplemented
    // react-native-web exports must fall through to the full package.
    const rnwlFlatModules = readdirSync(path.join(rnwlBase, 'dist/esm'))
      .filter((file) => file.endsWith('.mjs'))
      .map((file) => file.slice(0, -'.mjs'.length))
      .filter((name) => /^[A-Za-z0-9_]+$/.test(name))
    aliases.push(
      {
        // map deep RNW paths like dist/exports/StyleSheet/preprocess to rnw-lite's flat structure
        // extracts the final path segment (e.g. "preprocess" or "createReactDOMStyle")
        find: new RegExp(
          `^react-native(?:-web)?\\/dist\\/(?:exports|modules)\\/(?:.*\\/)?(${rnwlFlatModules.join('|')})$`
        ),
        replacement: `${normalizePath(rnwlBase)}/dist/esm/$1.mjs`,
      },
      {
        find: /^react-native$/,
        replacement: rnwl,
      },
      {
        find: /^react-native\/(Libraries\/Utilities\/codegenNativeComponent|Libraries\/Utilities\/codegenNativeCommand)$/,
        replacement: `${rnwlBase}/$1`,
      },
      {
        find: 'react-native/package.json',
        replacement: resolve('@tamagui/react-native-web-lite/package.json'),
      },
      {
        find: /^react-native-web$/,
        replacement: rnwl,
      }
    )
  }

  return aliases
}

type VxrnNativePluginContext = {
  root: string
  platform: 'ios' | 'android'
  dev: boolean
}

function createTamaguiNativePlugin(
  tamaguiOptionsIn: TamaguiOptions,
  nativeContext?: VxrnNativePluginContext
): Plugin {
  let compilerFrontend = new Static.CompilerFrontend()
  const projectDependencies = new Set<string>()
  let root = nativeContext?.root || process.cwd()
  let projectPromise: Promise<Static.CompilerProject | null> | null = null
  let nativeOptions: TamaguiOptions | null = null
  let rebuildProject = false
  let generation = 0

  const loadProject = async (resolveModule: (specifier: string) => Promise<string>) => {
    if (projectPromise) return projectPromise
    const shouldRebuild = rebuildProject
    rebuildProject = false
    const pending = (async () => {
      projectDependencies.clear()
      const loadedOptions = await Static.loadTamaguiBuildConfigAsync({
        ...tamaguiOptionsIn,
        root,
        platform: 'native',
        outputCSS: undefined,
      })
      const options = { ...loadedOptions, root, outputCSS: undefined }
      nativeOptions = options
      for (const dependency of Static.getTamaguiBuildConfigDependencies(loadedOptions)) {
        projectDependencies.add(normalizePath(dependency))
      }
      if (options.disable || options.disableExtraction) return null
      const project = await Static.loadCompilerProject({
        root,
        target: 'native',
        options,
        rebuild: shouldRebuild,
        generation: `vite-native:${generation + 1}`,
        missingProjectMessage:
          'Unable to load the Tamagui project for Vite native compilation',
        async resolveComponents(moduleNames) {
          return Promise.all(
            moduleNames.map(async (moduleName) => {
              const id = await resolveModule(moduleName)
              projectDependencies.add(normalizePath(id.split(/[?#]/, 1)[0]))
              return { moduleName, id }
            })
          )
        },
      })
      for (const dependency of project.projectInfo.dependencies ?? []) {
        projectDependencies.add(normalizePath(dependency.split(/[?#]/, 1)[0]))
      }
      const configPath = options.config || 'tamagui.config.ts'
      projectDependencies.add(
        normalizePath(
          path.isAbsolute(configPath) ? configPath : path.resolve(root, configPath)
        )
      )
      const buildFile = options.buildFile || 'tamagui.build.ts'
      projectDependencies.add(
        normalizePath(
          path.isAbsolute(buildFile) ? buildFile : path.resolve(root, buildFile)
        )
      )
      if (options.themeBuilder?.input) {
        projectDependencies.add(
          normalizePath(
            path.isAbsolute(options.themeBuilder.input)
              ? options.themeBuilder.input
              : path.resolve(root, options.themeBuilder.input)
          )
        )
      }
      generation++
      return project
    })()
    const guarded = pending.catch((error) => {
      if (projectPromise === guarded) projectPromise = null
      rebuildProject = true
      throw error
    })
    projectPromise = guarded
    return projectPromise
  }

  return {
    name: 'tamagui-native-compiler',
    enforce: 'post',
    configResolved(config) {
      root = config.root
    },
    watchChange(id) {
      if (projectDependencies.has(normalizePath(id.split(/[?#]/, 1)[0]))) {
        rebuildProject = true
        projectPromise = null
        compilerFrontend = new Static.CompilerFrontend()
      }
    },
    transform: {
      order: 'pre',
      async handler(code, id) {
        const environmentName = nativeContext?.platform || this.environment?.name
        if (environmentName !== 'ios' && environmentName !== 'android') return
        const [validId] = id.split('?')
        if (
          !validId ||
          !/\.[jt]sx$/.test(validId) ||
          normalizePath(validId).split('/').includes('node_modules')
        ) {
          return
        }
        const { shouldDisable } = await Static.getPragmaOptions({
          source: code,
          path: validId,
        })
        if (shouldDisable) return

        const resolve = async (specifier: string, importer: string) => {
          const resolution = await this.resolve(specifier, importer, { skipSelf: true })
          return resolution
            ? { id: resolution.id, external: resolution.external === true }
            : null
        }
        const project = await loadProject(async (specifier) => {
          const resolution = await resolve(
            specifier,
            path.join(root, '__tamagui_native.tsx')
          )
          if (!resolution) {
            throw new Error(`Unable to resolve native compiler component ${specifier}`)
          }
          return resolution.id
        })
        if (!project) return
        for (const dependency of projectDependencies) this.addWatchFile(dependency)

        const result = await compilerFrontend.compile({
          id: validId,
          source: code,
          root,
          target: 'native',
          project,
          resolve,
          evaluate: async ({ id: moduleId }) =>
            nativeOptions
              ? Static.evaluateComponentModule(nativeOptions, moduleId)
              : null,
          load: async (dependencyId) => {
            const cleanDependencyId = dependencyId.split(/[?#]/, 1)[0]
            if (!path.isAbsolute(cleanDependencyId)) return null
            try {
              return await readFile(cleanDependencyId, 'utf8')
            } catch {
              return null
            }
          },
        })
        for (const dependency of result.plan.dependencies) {
          if (path.isAbsolute(dependency)) this.addWatchFile(dependency)
        }
        if (result.plan.css) {
          throw new Error(
            `Native Tamagui compilation produced unexpected CSS for ${validId}`
          )
        }
        return result.output.changed
          ? { code: result.output.code, map: result.output.map as any }
          : undefined
      },
    },
  }
}

export function tamaguiNativePlugin(tamaguiOptionsIn: TamaguiOptions = {}): Plugin {
  const plugin = createTamaguiNativePlugin(tamaguiOptionsIn)
  const api =
    plugin.api && typeof plugin.api === 'object'
      ? (plugin.api as Record<string, unknown>)
      : {}

  return {
    ...plugin,
    api: {
      ...api,
      vxrnNative: (context: VxrnNativePluginContext) =>
        createTamaguiNativePlugin(tamaguiOptionsIn, context),
    },
  }
}

export type TamaguiVitePluginOptions = TamaguiOptions & {
  disableResolveConfig?: boolean
}

export type TamaguiInternalPluginOptions = TamaguiVitePluginOptions & {
  /**
   * Wraps compiler-extracted Tamagui CSS before it is served.
   * `@tamagui/tailwind/vite` uses it to put those rules in `@layer tamagui`, which is
   * what orders them against official Tailwind's `theme`/`utilities` layers.
   */
  wrapExtractedCSS?: (css: string) => string
  /**
   * Set by the zero-runtime controller when this invocation is an island child
   * build. The island keeps the full runtime and contributes its compiler atomic
   * CSS to the parent's single artifact instead of injecting its own.
   */
  zeroIslandBuild?: ZeroIslandBuildContext
}

/**
 * The base Tamagui Vite plugins plus the one config loader they evaluate through.
 *
 * `@tamagui/tailwind/vite` wraps this: it reuses the returned loader for its own
 * scanner plugin, so the Tamagui config is evaluated exactly once for both.
 */
export function createTamaguiPlugins({
  disableResolveConfig,
  wrapExtractedCSS = (css) => css,
  zeroIslandBuild,
  ...tamaguiOptionsIn
}: TamaguiInternalPluginOptions = {}): {
  plugins: PluginOption[]
  loader: ViteTamaguiLoader
} {
  // extraction ON by default, set disableExtraction: true to opt out
  let shouldExtract = !tamaguiOptionsIn.disableExtraction

  // temporary vxrn native env bridge
  const enableNativeEnv = !!globalThis.__vxrnEnableNativeEnv
  const tamaguiLoader = createViteTamaguiLoader(tamaguiOptionsIn)
  const compilerFrontends = new WeakMap<Environment, Static.CompilerFrontend>()
  const getCompilerFrontend = (environment: Environment) => {
    let frontend = compilerFrontends.get(environment)
    if (!frontend) {
      frontend = new Static.CompilerFrontend()
      compilerFrontends.set(environment, frontend)
    }
    return frontend
  }
  const pluginInstanceId = getNextPluginInstanceId()
  const configuredEvaluationPackages = new Set<string>()
  let buildEnvironmentPromise: Promise<void> | null = null
  let buildCleanupPromise: Promise<void> | null = null
  const activeBuildEnvironments = new Set<Environment>()
  const compilerReports =
    process.env.TAMAGUI_COMPILER_STATS || process.env.TAMAGUI_COMPILER_STATS_FILE
      ? new Map<string, CompilerModuleReport>()
      : null

  const releaseBuildEnvironment = async (environment: Environment) => {
    if (!activeBuildEnvironments.delete(environment) || activeBuildEnvironments.size) {
      return
    }
    if (compilerReports?.size) {
      reportCompilerStats(config?.root ?? process.cwd(), compilerReports)
    }
    const currentCleanup = Promise.resolve().then(async () => {
      try {
        await tamaguiLoader.cleanup()
      } finally {
        buildEnvironmentPromise = null
      }
    })
    buildCleanupPromise = currentCleanup
    try {
      await currentCleanup
    } finally {
      if (buildCleanupPromise === currentCleanup) {
        buildCleanupPromise = null
      }
    }
  }

  const extensions = [
    `.web.mjs`,
    `.web.js`,
    `.web.jsx`,
    `.web.ts`,
    `.web.tsx`,
    '.mjs',
    '.js',
    '.mts',
    '.ts',
    '.jsx',
    '.tsx',
    '.json',
  ]

  const getEvaluationEnvironmentOptions = (
    resolvedRoot: string,
    userNoExternal: EvaluationNoExternal
  ): EnvironmentOptions => ({
    consumer: 'server',
    keepProcessEnv: true,
    define: {
      'process.env.IS_STATIC': JSON.stringify('is_static'),
      'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(false),
      'process.env.TAMAGUI_IS_SERVER': JSON.stringify(true),
      'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
      'process.env.TAMAGUI_ENVIRONMENT': JSON.stringify(TAMAGUI_EVALUATION_ENVIRONMENT),
      // Config evaluation must retain createTamagui and CSS generation even when
      // the client graph is zero or the client claims the artifact. Inheriting
      // either literal from the outer build empties the artifact it generates.
      'process.env.TAMAGUI_RUNTIME': JSON.stringify('full'),
      'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify(''),
      // Client configs may strip theme values. Compiler evaluation and outputCSS
      // must use the full config regardless of which outer Vite environment runs last.
      'process.env.VITE_ENVIRONMENT': JSON.stringify('ssr'),
      'process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL': JSON.stringify('1'),
    },
    resolve: {
      // `tamagui-compiler` first, so a package we control can publish a build
      // with no app runtime in it and have the compiler pick that instead. The
      // reanimated driver uses it: the real one imports react-native-reanimated
      // at module scope, which node cannot load (extensionless and directory
      // relative imports), so evaluating any config registering that driver used
      // to fail outright. A condition is the portable way to express this, since
      // every bundler integration can add the same one and an app configures
      // nothing.
      conditions: [TAMAGUI_COMPILER_CONDITION, ...defaultClientConditions],
      mainFields: [...defaultClientMainFields],
      noExternal: mergeEvaluationNoExternal(
        [
          inlineEvaluationTamaguiPackage,
          ...configuredEvaluationPackages,
          // a condition only holds while Vite resolves, so these must not reach node
          ...scanInstalledTamaguiPackages(resolvedRoot, configuredEvaluationPackages)
            .compilerCondition,
        ],
        userNoExternal
      ),
      extensions,
    },
    dev: {
      createEnvironment(name, resolved) {
        const evaluationConfig = createServeEvaluationConfig(
          resolved,
          configuredEvaluationPackages
        )
        return createRunnableDevEnvironment(name, evaluationConfig)
      },
      moduleRunnerTransform: true,
    },
  })

  // start loading immediately but don't block
  tamaguiLoader.loadTamaguiBuildConfig()

  // helper to await load when needed
  const ensureLoaded = async () => {
    const promise = tamaguiLoader.getLoadPromise()
    if (promise) await promise
    const options = tamaguiLoader.getTamaguiOptions()
    // update shouldExtract from loaded config (tamagui.build.ts)
    if (options) {
      shouldExtract = !options.disableExtraction
    }
    return options
  }

  // extract plugin state
  const getHash = (input: string) => createHash('sha1').update(input).digest('base64')

  const cssMap = new Map<string, string>()
  const transformedModuleIds = new Set<string>()
  const compilerHotUpdateSignatures = new Map<string, string>()
  const compilerHotReloadSignatures = new Map<string, string>()
  let config: ResolvedConfig
  let server: ViteDevServer
  let zero: ZeroRuntimeController | null = null
  let zeroReceipt: ZeroGraphReceipt | null = null
  // closeBundle runs even when the build already failed, so a check there would
  // replace the real error with a derived one
  let zeroBuildFailed = false
  // The compiled-global-CSS tier: an ordinary compiled build that also owns an
  // `outputCSS` artifact and therefore derives TAMAGUI_DID_OUTPUT_CSS from it.
  let globalCSS: Static.GlobalCSSOwnership | null = null
  let globalCSSExpected: string | null = null
  // How many HTML entries received the zero artifact's stylesheet link. A zero
  // build with no HTML entry strips the rules and loads nothing.
  let zeroHtmlEntries = 0
  let zeroDevIslands: Promise<unknown> = Promise.resolve()
  const virtualExt = `.tamagui.css`

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  const isAppJSXSource = (filePath: string) => {
    if (!/\.[jt]sx$/.test(filePath)) return false
    const relative = path.relative(config.root, filePath)
    return (
      relative !== '' &&
      relative !== '..' &&
      !relative.startsWith(`..${path.sep}`) &&
      !relative.split(path.sep).includes('node_modules')
    )
  }

  const isFrameworkAnalysisRequest = (id: string) =>
    id.includes('__react-router-build-client-route')

  function isNotClient(environment?: Environment) {
    return environment?.name && environment.name !== 'client'
  }

  function isNative(environment?: Environment) {
    return (
      environment?.name && (environment.name === 'ios' || environment.name === 'android')
    )
  }

  function invalidateCompilerModules() {
    if (server) {
      const ids = new Set([...transformedModuleIds, ...cssMap.keys()])
      for (const environment of Object.values(server.environments)) {
        if (environment.name === TAMAGUI_EVALUATION_ENVIRONMENT) continue
        for (const id of ids) {
          const modules = environment.moduleGraph.getModulesByFile(id)
          if (!modules) continue
          for (const module of modules) {
            environment.moduleGraph.invalidateModule(module)
          }
        }
      }
    }
    cssMap.clear()
  }

  const basePlugin: Plugin = {
    name: 'tamagui',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
      const evaluationEnvironment = server.environments[TAMAGUI_EVALUATION_ENVIRONMENT]
      if (!isRunnableDevEnvironment(evaluationEnvironment)) {
        throw new Error(
          `The ${TAMAGUI_EVALUATION_ENVIRONMENT} Vite environment must support ModuleRunner evaluation`
        )
      }
      tamaguiLoader.setEnvironment(evaluationEnvironment)
    },

    async buildEnd() {
      await releaseBuildEnvironment(this.environment)
    },

    async config(userConfig, env) {
      const options = await ensureLoaded()

      if (!options) {
        throw new Error(`No tamagui options loaded`)
      }
      const useReactNativeWebLite =
        tamaguiOptionsIn.useReactNativeWebLite ?? options.useReactNativeWebLite

      for (const source of [options.config, ...(options.components || [])]) {
        const packageName = getEvaluationPackageName(source)
        if (packageName) {
          configuredEvaluationPackages.add(packageName)
        }
      }

      const resolvedRoot = userConfig.root ? path.resolve(userConfig.root) : process.cwd()

      // An island child build is the full-runtime half of the same project, so it
      // never re-enters zero mode even though it reads the same tamagui.build.ts.
      zero = zeroIslandBuild
        ? null
        : await createZeroRuntimeController(options, resolvedRoot, userConfig.base || '/')

      // The island child build's artifact is the parent's, and a dev server has
      // no final graph to prove the relationship against, so both keep runtime
      // CSS generation. Production is where the claim is made and gated.
      globalCSS =
        zeroIslandBuild || env.command !== 'build'
          ? null
          : Static.resolveGlobalCSSOwnership(options, resolvedRoot)

      return {
        envPrefix: ['TAMAGUI_'],

        environments: {
          client: {
            define: {
              'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(true),
              'process.env.TAMAGUI_ENVIRONMENT': '"client"',
              // An enforced zero client and its SSR peer both receive 'zero', so
              // SSR never imports a runtime hydration removed.
              ...(zero?.isEnforcing && {
                'process.env.TAMAGUI_RUNTIME': JSON.stringify('zero'),
              }),
              // Derived, never author-set. generateBundle proves the artifact
              // exists, matches this build's config, and is in the client graph;
              // a build that cannot prove it fails instead of shipping.
              ...(globalCSS && {
                'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify('1'),
              }),
            },
          },
          ssr: {
            define: {
              // the server and client must make the same class-versus-inline
              // decision or the first client render cannot hydrate the server HTML.
              ...(globalCSS && {
                'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify('1'),
              }),
            },
          },
          [TAMAGUI_EVALUATION_ENVIRONMENT]: getEvaluationEnvironmentOptions(
            resolvedRoot,
            userConfig.environments?.[TAMAGUI_EVALUATION_ENVIRONMENT]?.resolve?.noExternal
          ),
        },

        define: {
          // Config evaluation, report builds, native builds, and full-runtime
          // island child builds all keep ordinary Tamagui runtime behavior.
          'process.env.TAMAGUI_RUNTIME': JSON.stringify('full'),
          // reanimated support
          _frameTimestamp: undefined,
          _WORKLET: false,
          __DEV__: `${env.mode === 'development'}`,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || env.mode),
          'process.env.ENABLE_RSC': JSON.stringify(process.env.ENABLE_RSC || ''),
          'process.env.ENABLE_STEPS': JSON.stringify(process.env.ENABLE_STEPS || ''),
          'process.env.IS_STATIC': JSON.stringify(false),
          ...(env.mode === 'production' && {
            'process.env.TAMAGUI_OPTIMIZE_THEMES': JSON.stringify(true),
          }),
        },
        resolve:
          disableResolveConfig || enableNativeEnv
            ? {}
            : {
                extensions,
                alias: {
                  ...(options.platform !== 'native' && {
                    'react-native/Libraries/Renderer/shims/ReactFabric':
                      resolve('@tamagui/proxy-worm'),
                    'react-native/Libraries/Utilities/codegenNativeComponent':
                      resolve('@tamagui/proxy-worm'),
                    'react-native-svg': resolve('@tamagui/react-native-svg'),
                    ...(!useReactNativeWebLite && {
                      'react-native': resolve('react-native-web'),
                    }),
                  }),
                },
              },
      }
    },
  }

  const rnwLitePlugin: Plugin = {
    name: 'tamagui-rnw-lite',
    // framework plugins add their default react-native-web aliases from a
    // normal config hook, so apply the explicit lite choice after them.
    enforce: 'post',

    config() {
      if (enableNativeEnv) {
        return {}
      }

      const options = tamaguiLoader.getTamaguiOptions()
      const useReactNativeWebLite =
        tamaguiOptionsIn.useReactNativeWebLite ?? options?.useReactNativeWebLite
      if (!useReactNativeWebLite) {
        return {}
      }

      // the dep scanner does not follow transitive packages through the
      // react-native to rnw-lite alias. pre-include the CJS dependencies that
      // would otherwise reach the browser raw or trigger a mid-load optimize.
      const include: string[] = []
      for (const dependency of ['memoize-one', '@react-native/normalize-color']) {
        if (isInstalled(process.cwd(), dependency)) include.push(dependency)
      }

      return {
        resolve: {
          alias: tamaguiAliases({ rnwLite: useReactNativeWebLite }),
        },
        ssr: {
          // Installed packages are externalized by default in SSR builds, which
          // bypasses the RNW-lite alias and executes React Native Web's CJS entry
          // directly in Node. Bundle the Tamagui/RN boundary just as Vite does
          // for linked workspace packages.
          noExternal: [/^@tamagui\//, 'tamagui', 'react-native', 'react-native-web'],
        },
        optimizeDeps: {
          // upstream react-native-web must not be pre-bundled when aliased to lite
          exclude: ['react-native-web'],
          include,
        },
      }
    },
  }

  // extract plugin for optimize mode
  // always included, but checks shouldExtract dynamically after config loads
  const extractPlugin: Plugin = {
    name: 'tamagui-extract',
    enforce: 'pre',

    async config(userConf) {
      // wait for config to load to know if we should extract
      const options = await ensureLoaded()

      userConf.optimizeDeps ||= {}
      userConf.optimizeDeps.include ||= []

      // These dependencies are CJS and break when served directly to the browser
      // (`exports`/`module` is not defined). Pre-bundle them before Tamagui's linked
      // package graph can expose them as late-discovered transitive dependencies.
      userConf.optimizeDeps.include.push('inline-style-prefixer')
      addIfInstalled(userConf, userConf.root, ['@react-native/normalize-color'])

      // pre-bundle core and web alongside tamagui packages that use internal
      // contexts and hooks. if either remains linked while these entries are
      // optimized, Provider imports and optimized consumers can receive
      // separate theme/component/config contexts even with resolve.dedupe.
      //
      // @tamagui/sheet/controller is the lightweight controller subpath imported
      // by popover/dialog/select; the app imports @tamagui/sheet (full). if these
      // land in separate optimized chunks they each get their own copy of
      // SheetControllerContext, so the SheetController provider (from /controller)
      // and the Sheet consumer (from the full entry) never match and adapted
      // sheets silently never open. include both so they share one context chunk.
      // ThemeUpdate follows the same rule: its internal implementation must
      // patch the Theme context provided by the root package instead of
      // creating a second copy.
      addIfInstalled(userConf, userConf.root, [
        '@tamagui/core',
        '@tamagui/core/theme-update',
        '@tamagui/web',
        '@tamagui/web/theme-update',
        '@tamagui/animations-css',
        '@tamagui/animations-css/extras',
        '@tamagui/toast',
        '@tamagui/sheet',
        '@tamagui/sheet/controller',
      ])

      // dedupe tamagui packages so nested resolutions collapse to a single
      // instance. pairs with the include above: include pre-bundles, dedupe
      // prevents duplicate bundling when sub-deps re-resolve them. animations-css
      // needs the same treatment because apps can import both its root transition
      // driver and its /extras animated-number driver.
      userConf.resolve ||= {}
      userConf.resolve.dedupe ||= []
      for (const id of [
        'tamagui',
        '@tamagui/core',
        '@tamagui/core/theme-update',
        '@tamagui/web',
        '@tamagui/web/theme-update',
        '@tamagui/animations-css',
        '@tamagui/toast',
        '@tamagui/sheet',
      ]) {
        if (
          !userConf.resolve.dedupe.includes(id) &&
          isInstalled(userConf.root || process.cwd(), id)
        ) {
          userConf.resolve.dedupe.push(id)
        }
      }

      if (!shouldExtract) return

      userConf.optimizeDeps.include.push('@tamagui/core/inject-styles')
    },

    async configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async buildStart() {
      const buildConfig = this.environment.getTopLevelConfig()
      if (buildConfig.command !== 'build') return

      const pendingCleanup = buildCleanupPromise
      if (pendingCleanup) {
        await pendingCleanup
      }

      const buildEnvironment = this.environment
      activeBuildEnvironments.add(buildEnvironment)
      try {
        if (!tamaguiLoader.getEnvironment()) {
          await tamaguiLoader.loadTamaguiBuildConfig()
          buildEnvironmentPromise ||= (async () => {
            const evaluationConfig = await createOwnedEvaluationConfig(
              buildConfig,
              configuredEvaluationPackages
            )
            const evaluationEnvironment = createRunnableDevEnvironment(
              TAMAGUI_EVALUATION_ENVIRONMENT,
              evaluationConfig,
              { hot: false }
            )
            try {
              await evaluationEnvironment.init()
            } catch (error) {
              await evaluationEnvironment.close().catch(() => undefined)
              throw error
            }
            tamaguiLoader.setEnvironment(evaluationEnvironment, { owned: true })
          })()
          await buildEnvironmentPromise
        }
      } catch (error) {
        await releaseBuildEnvironment(buildEnvironment)
        throw error
      }
    },

    hotUpdate: {
      order: 'post',
      async handler(options) {
        if (!tamaguiLoader.isEvaluationDependency(options.file)) {
          if (this.environment.name !== 'client') return
          const compilerFrontend = getCompilerFrontend(this.environment)
          const source = options.type === 'delete' ? null : await options.read()
          const affectedModules = new Set<EnvironmentModuleNode>()
          const compilerHmrRoots = new Set<string>(
            compilerFrontend.dependentsOf(options.file)
          )
          if (compilerHmrRoots.size || compilerFrontend.has(options.file)) {
            compilerHmrRoots.add(options.file)
          }
          if (compilerFrontend.has(options.file) || compilerHmrRoots.size > 0) {
            const loadedOptions = await ensureLoaded()
            if (!loadedOptions?.disable) {
              const invalidatedIds =
                options.type === 'delete'
                  ? (await compilerFrontend.remove(options.file)).invalidatedIds
                  : await compilerFrontend.update({
                      id: options.file,
                      source: source!,
                      root: config.root,
                      target: 'web',
                      environment: this.environment.name,
                      project: {
                        ...(await tamaguiLoader.getCompilerProject()),
                        generation: `${pluginInstanceId}:${tamaguiLoader.getGeneration()}`,
                      },
                      resolve: async (specifier, importer) => {
                        const resolution =
                          await this.environment.pluginContainer.resolveId(
                            specifier,
                            importer
                          )
                        return resolution
                          ? { id: resolution.id, external: resolution.external === true }
                          : null
                      },
                      load: async (dependencyId) => {
                        const cleanDependencyId = dependencyId.split(/[?#]/, 1)[0]
                        if (!path.isAbsolute(cleanDependencyId)) return null
                        try {
                          return await readFile(cleanDependencyId, 'utf8')
                        } catch {
                          return null
                        }
                      },
                    })
              for (const invalidatedId of invalidatedIds) {
                for (const module of this.environment.moduleGraph.getModulesByFile(
                  invalidatedId
                ) ?? []) {
                  this.environment.moduleGraph.invalidateModule(module)
                  if (compilerHmrRoots.has(invalidatedId) || module.isSelfAccepting) {
                    affectedModules.add(module)
                  }
                }
                const cssId = getAbsoluteVirtualFileId(`${invalidatedId}${virtualExt}`)
                const cssModule = this.environment.moduleGraph.getModuleById(cssId)
                if (cssModule) {
                  this.environment.moduleGraph.invalidateModule(cssModule)
                }
              }
            }
          }
          return affectedModules.size ? [...affectedModules] : undefined
        }

        const signature = await (async () => {
          if (options.type === 'delete') {
            return getHash(`${options.type}:${options.file}`)
          }
          try {
            return getHash(`${options.type}:${options.file}:${await options.read()}`)
          } catch {
            return getHash(`${options.type}:${options.file}:${options.timestamp}`)
          }
        })()

        if (compilerHotUpdateSignatures.get(options.file) !== signature) {
          compilerHotUpdateSignatures.set(options.file, signature)
          tamaguiLoader.invalidate(options.file)
          invalidateCompilerModules()
        }
        if (
          this.environment.name === 'client' &&
          compilerHotReloadSignatures.get(options.file) !== signature
        ) {
          compilerHotReloadSignatures.set(options.file, signature)
          this.environment.hot.send({
            type: 'full-reload',
            path: '*',
            triggeredBy: options.file,
          })
        }
        return []
      },
    },

    async watchChange(id) {
      if (config.command !== 'build') {
        return
      }
      if (tamaguiLoader.isEvaluationDependency(id)) {
        tamaguiLoader.invalidate(id)
        invalidateCompilerModules()
      }
    },

    async resolveId(source) {
      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      if (!shouldExtract) return

      const [validId, query] = source.split('?')

      if (!validId.endsWith(virtualExt)) {
        return
      }

      const absoluteId = validId.startsWith(config.root)
        ? validId
        : getAbsoluteVirtualFileId(validId)

      if (cssMap.has(absoluteId)) {
        return absoluteId + (query ? `?${query}` : '')
      }
    },

    async load(id) {
      const options = tamaguiLoader.getTamaguiOptions()
      if (options?.disable) {
        return
      }

      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      if (!shouldExtract) return

      const [validId] = id.split('?')
      return cssMap.get(validId)
    },
  }

  // Source and compiled JSX reach this filtered post-transform after user syntax
  // plugins and before Vite import analysis.
  const sharedCompilerPlugin: Plugin = {
    name: 'tamagui-compiler',
    enforce: 'post',
    transform: {
      order: 'pre',
      async handler(code, id) {
        if (this.environment?.name === TAMAGUI_EVALUATION_ENVIRONMENT) return
        if (!tamaguiLoader.getEnvironment()) return
        if (isNative(this.environment)) return

        const [validId] = id.split('?')
        if (
          isFrameworkAnalysisRequest(id) ||
          !isAppJSXSource(validId) ||
          !/\.[jt]sx$/.test(validId)
        )
          return
        const options = await ensureLoaded()
        if (options?.disable || !shouldExtract) return

        const { shouldDisable } = await Static.getPragmaOptions({
          source: code,
          path: validId,
        })
        if (shouldDisable) return

        const evaluationDependencies = await tamaguiLoader.ensureFullConfigLoaded()
        for (const dependency of evaluationDependencies) this.addWatchFile(dependency)
        const compilerProject = await tamaguiLoader.getCompilerProject()
        const compilerFrontend = getCompilerFrontend(this.environment)
        const result = await compilerFrontend.compile({
          id: validId,
          source: code,
          root: config.root,
          target: 'web',
          environment: this.environment.name,
          project: {
            ...compilerProject,
            generation: `${pluginInstanceId}:${tamaguiLoader.getGeneration()}`,
            // `report` runs the same analysis as `enforce`, including the
            // mode-aware diagnostics, so both emit the identical violation list
            zeroRuntime: zero !== null,
          },
          resolve: async (specifier, importer) => {
            const resolution = await this.resolve(specifier, importer, { skipSelf: true })
            return resolution
              ? { id: resolution.id, external: resolution.external === true }
              : null
          },
          evaluate: ({ id: moduleId }) => tamaguiLoader.evaluateModule(moduleId),
          load: async (dependencyId) => {
            const cleanDependencyId = dependencyId.split(/[?#]/, 1)[0]
            if (!path.isAbsolute(cleanDependencyId)) return null
            try {
              return await readFile(cleanDependencyId, 'utf8')
            } catch {
              return null
            }
          },
        })
        transformedModuleIds.add(validId)
        compilerReports?.set(validId, {
          stats: result.plan.stats,
          diagnostics: result.plan.diagnostics,
        })
        for (const dependency of result.plan.dependencies) {
          if (path.isAbsolute(dependency)) this.addWatchFile(dependency)
        }

        // Island child build: the parent owns the one CSS artifact, so route this
        // module's atomic rules there and inject nothing.
        if (zeroIslandBuild) {
          zeroIslandBuild.artifact.setIslandModuleCSS(
            zeroIslandBuild.islandId,
            validId,
            wrapExtractedCSS(result.plan.css)
          )
          return result.output.changed
            ? { code: result.output.code, map: result.output.map as any }
            : undefined
        }

        if (zero) {
          const zeroResult = Static.transformZeroModule({
            mode: zero.isEnforcing ? 'enforce' : 'report',
            id: validId,
            root: config.root,
            source: code,
            plan: result.plan,
            config: (await tamaguiLoader.getTamaguiConfig())!,
            isTamaguiSpecifier: Static.isTamaguiSpecifier,
            resolveIslandLoader: (specifier) => {
              const islandId = zero!.loaderIds.get(
                zeroModuleKey(path.resolve(path.dirname(validId), specifier))
              )
              return islandId ? { islandId } : null
            },
            resolveIslandModule: (specifier) =>
              zero!.islandModuleIds.get(
                zeroModuleKey(path.resolve(path.dirname(validId), specifier))
              ) ?? null,
          })
          zero.transformed.add(validId)
          if (zeroResult.erased.exports.length) {
            zero.erasedExports.set(validId, zeroResult.erased.exports)
          }
          for (const violation of zeroResult.violations) {
            const { line, column } = Static.offsetToLineColumn(code, violation.span.start)
            zero.violations.push({
              file: path.relative(config.root, validId),
              line,
              column,
              rule: violation.rule,
              code: violation.code,
              component: violation.component,
              message: violation.message,
            })
          }
          // `report` runs the same analysis and then leaves everything else
          // alone: full runtime, ordinary CSS handling, unchanged source. So it
          // falls through to the ordinary path below.
          if (zero.isEnforcing) {
            Static.mergeIslandBridges(zero.bridges, zeroResult.bridges)
            const moduleCSS = [
              wrapExtractedCSS(result.plan.css),
              ...[...zeroResult.bridgeCSS.values()],
            ]
              .filter(Boolean)
              .join('\n')

            // Production combines every module's rules into the one artifact the
            // entry loads. Development keeps them on Vite's per-module CSS
            // modules, where the importer owns the ordering and hot replacement
            // already works.
            if (config.command !== 'build') {
              let cssImport = ''
              if (moduleCSS) {
                const rootRelativeId = `${validId}${virtualExt}`
                cssMap.set(getAbsoluteVirtualFileId(rootRelativeId), moduleCSS)
                this.addWatchFile(rootRelativeId)
                cssImport = `\nimport "${rootRelativeId}";`
              }
              return {
                code: `${zeroResult.output.code}${cssImport}`,
                map: zeroResult.output.map as any,
              }
            }

            for (const [identifier, rules] of zeroResult.bridgeCSS) {
              zero.artifact.setBridgeRules(identifier, rules)
            }
            zero.artifact.setZeroModuleCSS(validId, wrapExtractedCSS(result.plan.css))
            return zeroResult.output.changed
              ? { code: zeroResult.output.code, map: zeroResult.output.map as any }
              : undefined
          }
        }

        const isSSR = isNotClient(this.environment)
        let cssImport: string | null = null
        if (result.plan.css) {
          const rootRelativeId = `${validId}${virtualExt}`
          const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)
          cssMap.set(absoluteId, wrapExtractedCSS(result.plan.css))
          this.addWatchFile(rootRelativeId)
          if (!isSSR) cssImport = `import "${rootRelativeId}";`
        }
        const finalCode = cssImport
          ? `${result.output.code}\n${cssImport}`
          : result.output.code
        return result.output.changed || cssImport
          ? { code: finalCode, map: result.output.map as any }
          : undefined
      },
    },
  }

  // Owns the single CSS artifact, the island child builds, and the module-graph
  // gate that is the only thing that actually proves the zero guarantee.
  //
  // Development runs the same lowering and reference erasure, so the runtime
  // that generates design-system, :root, font and theme CSS is gone there too.
  // The dev server therefore has to serve that CSS itself: it publishes the
  // config half at the same href production uses and builds the islands once at
  // startup. Per-module atomic rules keep Vite's own `.tamagui.css` modules in
  // dev, which is where hot replacement already works; production combines them
  // into the one artifact instead.
  const zeroRuntimePlugin: Plugin = {
    name: 'tamagui-zero-runtime',
    enforce: 'post',

    async buildStart() {
      if (!zero || this.environment.name !== 'client') return
      await tamaguiLoader.ensureFullConfigLoaded()
      const tamaguiConfig = await tamaguiLoader.getTamaguiConfig()
      if (!tamaguiConfig) {
        throw new Error(
          `[tamagui zero-runtime] the Tamagui config did not evaluate, so no CSS artifact can be generated`
        )
      }
      zero.violations.length = 0
      zero.transformed.clear()
      zero.erasedExports.clear()
      if (!zero.isEnforcing) return
      Static.assertZeroConfigDrivers(tamaguiConfig)
      zero.artifact.clearGraphs()
      zero.bridges.clear()
      zeroHtmlEntries = 0
      zero.artifact.setConfigCSS(tamaguiConfig.getCSS())

      // Production builds the islands at the end, once the zero graph is known.
      // Development has no such end, so they are built here, after the reset
      // that would otherwise discard their rules, and the dev server's artifact
      // route waits on this.
      if (config.command !== 'build') {
        const islands = zero
        zeroDevIslands = Promise.all(
          islands.resolved.islands.map((island) =>
            buildIsland({
              island,
              controller: islands,
              root: config.root,
              outDir: zeroDevIslandDir(islands),
              mode: 'development',
            })
          )
        )
        await zeroDevIslands
      }
    },

    async configureServer(devServer) {
      if (!zero?.isEnforcing) return
      const islandBase = `${zero.cssHref.replace(ZERO_CSS_FILENAME, '')}${ZERO_ISLAND_DIRNAME}/`
      devServer.middlewares.use(async (request, response, next) => {
        const url = (request.url || '').split('?')[0]
        if (url !== zero!.cssHref && !url.startsWith(islandBase)) return next()
        // buildStart owns the artifact's contents and the island builds, so a
        // request that arrives first waits for it rather than reading a
        // half-populated artifact
        await zeroDevIslands
        if (url === zero!.cssHref) {
          response.setHeader('content-type', 'text/css; charset=utf-8')
          response.setHeader('cache-control', 'no-cache')
          response.end(zero!.artifact.css())
          return
        }
        const islandId = url.slice(islandBase.length).replace(/\.js$/, '')
        const file = path.join(
          zeroDevIslandDir(zero!),
          ZERO_ISLAND_DIRNAME,
          `${islandId}.js`
        )
        if (!existsSync(file)) return next()
        response.setHeader('content-type', 'text/javascript; charset=utf-8')
        response.setHeader('cache-control', 'no-cache')
        response.end(readFileSync(file))
      })
    },

    // The last hook that still sees the resolved graph and runs before rolldown
    // renders chunks. An erased export that some module still imports has to be
    // reported here: by render time the bundler has already failed on it with a
    // message about a missing export, which says nothing about why it is missing.
    buildEnd(error) {
      if (!zero || this.environment.name !== 'client') return
      if (error) {
        zeroBuildFailed = true
        return
      }
      if (!zero.isEnforcing) return
      const importers = new Map<string, readonly string[]>()
      for (const moduleId of this.getModuleIds()) {
        importers.set(moduleId, this.getModuleInfo(moduleId)?.importers ?? [])
      }
      const escape = Static.erasedExportEscape({
        integration: 'vite',
        transformed: zero.transformed,
        erasedExports: zero.erasedExports,
        importersOf: importers,
      })
      if (escape) {
        zeroBuildFailed = true
        throw new Error(escape)
      }
    },

    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!zero?.isEnforcing) return
        zeroHtmlEntries++
        return {
          html,
          tags: [
            {
              tag: 'link',
              attrs: { rel: 'stylesheet', href: zero.cssHref },
              injectTo: 'head',
            },
          ],
        }
      },
    },

    generateBundle(_outputOptions, bundle) {
      if (!zero?.isEnforcing || this.environment.name !== 'client') return
      // rolldown reports the modules that contributed rendered code per chunk,
      // which is exactly what shipped. Importer edges come from the whole
      // resolved graph so a forbidden module can name its shortest chain.
      const importers = new Map<string, string[]>()
      for (const moduleId of this.getModuleIds()) {
        for (const imported of this.getModuleInfo(moduleId)?.importedIds ?? []) {
          const list = importers.get(imported)
          if (list) list.push(moduleId)
          else importers.set(imported, [moduleId])
        }
      }
      const entries: string[] = []
      const modules: { id: string; importers: readonly string[] }[] = []
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk') continue
        for (const moduleId of Object.keys(chunk.modules)) {
          modules.push({ id: moduleId, importers: importers.get(moduleId) ?? [] })
          if (this.getModuleInfo(moduleId)?.isEntry) entries.push(moduleId)
        }
      }
      const checked = Static.checkZeroGraph({
        entries,
        modules,
        importerEdges: importers,
        root: zero.resolved.root,
      })
      zeroReceipt = {
        integration: 'vite',
        graph: 'zero',
        entries: entries.sort(),
        moduleCount: modules.length,
        tamaguiModules: checked.tamaguiModules,
        forbidden: checked.forbidden,
        cssArtifact: null,
        identity: '',
        gzip: Object.fromEntries(
          Object.values(bundle)
            .filter((chunk) => chunk.type === 'chunk')
            .map((chunk) => [
              chunk.fileName,
              gzipSync(Buffer.from((chunk as any).code), { level: 9 }).length,
            ])
        ),
      }
    },

    async closeBundle() {
      if (!zero || this.environment.name !== 'client') return
      const outDir = path.resolve(config.root, this.environment.config.build.outDir)
      // one receipt per output directory, so a zero build and its negative
      // control never overwrite each other's evidence
      const receiptName = `vite-${path.basename(outDir)}`
      // Written in both modes and before the failure, so `report` and `enforce`
      // emit the identical list and only their exit differs.
      Static.writeZeroViolationReport(zero.resolved.outDir, receiptName, {
        integration: 'vite',
        mode: zero.isEnforcing ? 'enforce' : 'report',
        violations: zero.violations,
      })
      if (!zero.isEnforcing || zeroBuildFailed) return
      if (zero.violations.length) {
        throw new Error(Static.formatZeroViolations(zero.violations))
      }
      const islandOutputHashes: Record<string, string> = {}
      for (const island of zero.resolved.islands) {
        const built = await buildIsland({
          island,
          controller: zero,
          root: config.root,
          outDir,
          mode: config.mode,
        })
        islandOutputHashes[island.id] = built.hash
      }

      // The plugin, not the app, injects the zero artifact's stylesheet link, so
      // an entry graph with no HTML entry strips the rules and loads nothing.
      if (zeroHtmlEntries === 0) {
        throw new Error(
          `[tamagui zero-runtime] the zero entry graph has no HTML entry, so the one generated CSS artifact ${zero.cssHref} is never loaded. Build a zero entry through its HTML document.`
        )
      }

      const css = finalizeZeroCSS(zero, outDir)
      const bridgeManifest = Static.canonicalizeBridgeManifest(
        Object.fromEntries(
          [...zero.bridges.entries()].sort(([left], [right]) => (left < right ? -1 : 1))
        )
      )
      const identityInputs = {
        runtimeLiteral: 'zero' as const,
        target: 'web' as const,
        configGeneration: `${pluginInstanceId}:${tamaguiLoader.getGeneration()}`,
        cssHash: css.hash,
        compilerVersion: Static.ZERO_COMPILER_VERSION,
        islandEntries: zero.resolved.islands.map((island) => island.module),
        bridgeManifestHash: Static.hashBridgeManifest(bridgeManifest),
        islandOutputHashes,
      }
      const identity = Static.hashZeroIdentity(identityInputs)

      if (!zeroReceipt) {
        throw new Error(
          `[tamagui zero-runtime] no module graph was recorded for the zero entry`
        )
      }
      zeroReceipt.cssArtifact = { path: css.href, hash: css.hash }
      zeroReceipt.identity = identity
      Static.writeZeroGraphReceipt(zero.resolved.outDir, receiptName, zeroReceipt)
      writeFileSync(
        path.join(zero.resolved.outDir, `${receiptName}.bridges.json`),
        `${JSON.stringify(
          { identity, identityInputs, cssGzip: css.gzip, bridges: bridgeManifest },
          null,
          2
        )}\n`
      )
      assertZeroGraph(zeroReceipt)
    },
  }

  // The compiled-global-CSS tier. `TAMAGUI_DID_OUTPUT_CSS` was already inlined
  // in the client environment, so this proves the artifact that replaces those
  // stripped rules exists, matches this build's config, and is in the graph.
  const globalCSSPlugin: Plugin = {
    name: 'tamagui-global-css',
    enforce: 'post',
    apply: 'build',

    async buildStart() {
      if (!globalCSS || this.environment.name !== 'client') return
      await tamaguiLoader.ensureFullConfigLoaded()
      const tamaguiConfig = await tamaguiLoader.getTamaguiConfig()
      if (!tamaguiConfig) {
        throw new Error(
          `[tamagui] outputCSS is set but the Tamagui config did not evaluate, so no CSS artifact can be generated`
        )
      }
      globalCSSExpected = tamaguiConfig.getCSS()
    },

    generateBundle() {
      if (!globalCSS || this.environment.name !== 'client') return
      const failure = Static.checkGlobalCSSArtifact({
        cssPath: globalCSS.cssPath,
        expectedCSS: globalCSSExpected ?? '',
        loadedModuleIds: this.getModuleIds(),
        importHint: `Import it once from your client entry: import ${JSON.stringify(
          relativeImportSpecifier(config.root, globalCSS.cssPath)
        )}`,
      })
      if (failure) throw new Error(failure.message)
    },
  }

  return {
    plugins: [
      basePlugin,
      rnwLitePlugin,
      extractPlugin,
      sharedCompilerPlugin,
      zeroRuntimePlugin,
      globalCSSPlugin,
      tamaguiNativePlugin(tamaguiOptionsIn),
    ],
    loader: tamaguiLoader,
  }
}

/** Where the dev server's island bundles are built and served from. */
function zeroDevIslandDir(zero: ZeroRuntimeController) {
  return path.join(zero.resolved.outDir, 'dev')
}

function relativeImportSpecifier(from: string, to: string) {
  const relative = normalizePath(path.relative(from, to))
  return relative.startsWith('.') ? relative : `./${relative}`
}

export function tamaguiPlugin(options: TamaguiVitePluginOptions = {}): PluginOption {
  return createTamaguiPlugins(options).plugins
}
