import Static from '@tamagui/static'
import type { ExtractedResponse, TamaguiOptions } from '@tamagui/static'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createIdResolver,
  createRunnableDevEnvironment,
  defaultClientConditions,
  defaultClientMainFields,
  isRunnableDevEnvironment,
  resolveConfig,
} from 'vite'
import type {
  EnvironmentOptions,
  Plugin,
  PluginOption,
  ResolvedConfig,
  ViteDevServer,
} from 'vite'
import type { Environment } from 'vite'
import { createViteTamaguiLoader, TAMAGUI_EVALUATION_ENVIRONMENT } from './loadTamagui'

const environmentSpecificTransformPluginNames = new Set([
  'one:compiler',
  'one:compiler-css-to-js',
])

const oneTsconfigPathsPluginName = 'one:tsconfig-paths'
const bareTamaguiPackage = /^@tamagui\/[^/?#]+(?:[/?#]|$)/
const inlineEvaluationTamaguiPackage = /^@tamagui\/(?:config|core|slider|web)(?:[/?#]|$)/
const externalizablePackageExtensions = new Set(['', '.js', '.mjs', '.cjs'])
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

function getInstalledTamaguiPackages(
  root: string,
  configuredEvaluationPackages: Set<string>
) {
  const packageRequire = createRequire(path.join(root, 'package.json'))
  const packages = new Set<string>()

  for (const modulePath of packageRequire.resolve.paths('@tamagui/core') || []) {
    const scopePath = path.join(modulePath, '@tamagui')
    if (!existsSync(scopePath)) continue
    for (const entry of readdirSync(scopePath, { withFileTypes: true })) {
      if (!entry.isDirectory() && !entry.isSymbolicLink()) continue
      const packageName = `@tamagui/${entry.name}`
      if (
        !inlineEvaluationTamaguiPackage.test(packageName) &&
        !configuredEvaluationPackages.has(packageName)
      ) {
        packages.add(packageName)
      }
    }
  }

  return packages
}

function getEvaluationResolve(
  resolve: ResolvedConfig['environments'][string]['resolve'],
  root: string,
  disableTsconfigPaths: boolean,
  configuredEvaluationPackages: Set<string>
) {
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
              ...getInstalledTamaguiPackages(root, configuredEvaluationPackages),
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

// shared cache across all plugin instances/environments via globalThis
type CacheEntry = {
  js: string
  map: any
  cssImport: string | null
  css: { id: string; code: string } | null
}

const CACHE_KEY = '__tamagui_vite_cache__'
const CACHE_SIZE_KEY = '__tamagui_vite_cache_size__'
const PENDING_KEY = '__tamagui_vite_pending__'
const PLUGIN_INSTANCE_KEY = '__tamagui_vite_plugin_instance__'

function getNextPluginInstanceId() {
  const next = ((globalThis as any)[PLUGIN_INSTANCE_KEY] || 0) + 1
  ;(globalThis as any)[PLUGIN_INSTANCE_KEY] = next
  return next
}

function getSharedCache(): Record<string, CacheEntry> {
  if (!(globalThis as any)[CACHE_KEY]) {
    ;(globalThis as any)[CACHE_KEY] = {}
  }
  return (globalThis as any)[CACHE_KEY]
}

function getSharedCacheSize(): number {
  return (globalThis as any)[CACHE_SIZE_KEY] || 0
}

function setSharedCacheSize(size: number) {
  ;(globalThis as any)[CACHE_SIZE_KEY] = size
}

function clearSharedCache() {
  const cache = getSharedCache()
  for (const key in cache) {
    delete cache[key]
  }
  setSharedCacheSize(0)
  getPendingExtractions().clear()
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

// pending extractions map - dedupes concurrent requests for same file
function getPendingExtractions(): Map<string, Promise<CacheEntry | null>> {
  if (!(globalThis as any)[PENDING_KEY]) {
    ;(globalThis as any)[PENDING_KEY] = new Map()
  }
  return (globalThis as any)[PENDING_KEY]
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
    aliases.push(
      {
        // map deep RNW paths like dist/exports/StyleSheet/preprocess to rnw-lite's flat structure
        // extracts the final path segment (e.g. "preprocess" or "createReactDOMStyle")
        find: /^react-native(?:-web)?\/dist\/(?:exports|modules)\/.*\/([^/]+)$/,
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

export function tamaguiPlugin({
  disableResolveConfig,
  ...tamaguiOptionsIn
}: TamaguiOptions & {
  disableResolveConfig?: boolean
} = {}): PluginOption {
  // extraction ON by default, set disableExtraction: true to opt out
  let shouldExtract = !tamaguiOptionsIn.disableExtraction

  // temporary vxrn native env bridge
  const enableNativeEnv = !!globalThis.__vxrnEnableNativeEnv
  const tamaguiLoader = createViteTamaguiLoader(tamaguiOptionsIn)
  const pluginInstanceId = getNextPluginInstanceId()
  const configuredEvaluationPackages = new Set<string>()
  let buildEnvironmentPromise: Promise<void> | null = null
  let buildCleanupPromise: Promise<void> | null = null
  const activeBuildEnvironments = new Set<Environment>()

  const releaseBuildEnvironment = async (environment: Environment) => {
    if (!activeBuildEnvironments.delete(environment) || activeBuildEnvironments.size) {
      return
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

  const getEvaluationEnvironmentOptions = (): EnvironmentOptions => ({
    consumer: 'server',
    keepProcessEnv: true,
    define: {
      'process.env.IS_STATIC': JSON.stringify('is_static'),
      'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(false),
      'process.env.TAMAGUI_IS_SERVER': JSON.stringify(true),
      'process.env.TAMAGUI_TARGET': JSON.stringify('web'),
      'process.env.TAMAGUI_ENVIRONMENT': JSON.stringify(TAMAGUI_EVALUATION_ENVIRONMENT),
      'process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL': JSON.stringify('1'),
    },
    resolve: {
      conditions: [...defaultClientConditions],
      mainFields: [...defaultClientMainFields],
      noExternal: [inlineEvaluationTamaguiPackage, ...configuredEvaluationPackages],
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

  // use shared cache across environments
  const memoryCache = getSharedCache()

  const cssMap = new Map<string, string>()
  const transformedModuleIds = new Set<string>()
  const compilerHotUpdateSignatures = new Map<string, string>()
  const compilerHotReloadSignatures = new Map<string, string>()
  let config: ResolvedConfig
  let server: ViteDevServer
  const virtualExt = `.tamagui.css`

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  function isNotClient(environment?: Environment) {
    return environment?.name && environment.name !== 'client'
  }

  function isNative(environment?: Environment) {
    return (
      environment?.name && (environment.name === 'ios' || environment.name === 'android')
    )
  }

  function invalidateModule(absoluteId: string) {
    if (!server) return

    const { moduleGraph } = server
    const modules = moduleGraph.getModulesByFile(absoluteId)

    if (modules) {
      for (const module of modules) {
        moduleGraph.invalidateModule(module)
        module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now()
      }
    }
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

    async config(_, env) {
      const options = await ensureLoaded()

      if (!options) {
        throw new Error(`No tamagui options loaded`)
      }

      for (const source of [options.config, ...(options.components || [])]) {
        const packageName = getEvaluationPackageName(source)
        if (packageName) {
          configuredEvaluationPackages.add(packageName)
        }
      }

      return {
        envPrefix: ['TAMAGUI_'],

        environments: {
          client: {
            define: {
              'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(true),
              'process.env.TAMAGUI_ENVIRONMENT': '"client"',
            },
          },
          [TAMAGUI_EVALUATION_ENVIRONMENT]: getEvaluationEnvironmentOptions(),
        },

        define: {
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
                    ...(!options?.useReactNativeWebLite && {
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

    config() {
      if (enableNativeEnv) {
        return {}
      }

      const options = tamaguiLoader.getTamaguiOptions()
      if (!options?.useReactNativeWebLite) {
        return {}
      }

      // react-native-web-lite imports memoize-one internally. the esbuild dep
      // scanner doesn't follow it through the react-native -> rnw-lite alias, so
      // vite discovers it only at request time, re-optimizes mid-load, and full
      // reloads. on slow runners (CI) the in-flight optimized-dep request 504s
      // ("Outdated Optimize Dep") and surfaces as a console error. pre-include
      // it so the first optimize pass is complete and no reload is triggered.
      const include: string[] = []
      if (isInstalled(process.cwd(), 'memoize-one')) {
        include.push('memoize-one')
      }

      return {
        resolve: {
          alias: tamaguiAliases({ rnwLite: options.useReactNativeWebLite }),
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

      // inline-style-prefixer is CJS with __esModule and breaks without pre-bundling
      // (reference error: exports is not defined). always include it.
      userConf.optimizeDeps.include.push('inline-style-prefixer')

      // pre-bundle tamagui packages that use internal hooks (useThemeName, etc.)
      // from sub-entries, vite's dep crawler can otherwise split them into a
      // separate chunk with its own tamagui copy, producing two ThemeStateContext
      // instances and "Missing theme" errors at runtime.
      //
      // @tamagui/sheet/controller is the lightweight controller subpath imported
      // by popover/dialog/select; the app imports @tamagui/sheet (full). if these
      // land in separate optimized chunks they each get their own copy of
      // SheetControllerContext, so the SheetController provider (from /controller)
      // and the Sheet consumer (from the full entry) never match and adapted
      // sheets silently never open. include both so they share one context chunk.
      addIfInstalled(userConf, userConf.root, [
        '@tamagui/toast',
        '@tamagui/toast/v2',
        '@tamagui/sheet',
        '@tamagui/sheet/controller',
      ])

      // dedupe tamagui packages so nested resolutions collapse to a single
      // instance. pairs with the include above: include pre-bundles, dedupe
      // prevents duplicate bundling when sub-deps re-resolve them.
      userConf.resolve ||= {}
      userConf.resolve.dedupe ||= []
      for (const id of [
        'tamagui',
        '@tamagui/core',
        '@tamagui/web',
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
          return
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
          clearSharedCache()
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

    watchChange(id) {
      if (config.command !== 'build' || !tamaguiLoader.isEvaluationDependency(id)) {
        return
      }
      tamaguiLoader.invalidate(id)
      clearSharedCache()
      invalidateCompilerModules()
    },

    async resolveId(source) {
      if (!shouldExtract) return

      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

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
      if (!shouldExtract) return

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

      const [validId] = id.split('?')
      return cssMap.get(validId)
    },

    transform: {
      order: 'pre',
      async handler(code, id) {
        // Config/component evaluation must run through user plugins without
        // recursively invoking Tamagui extraction inside its own ModuleRunner.
        if (this.environment?.name === TAMAGUI_EVALUATION_ENVIRONMENT) {
          return
        }

        // ensure tamagui is loaded before transform
        const options = await ensureLoaded()

        // fully disabled = no extraction AND no debug attrs
        if (options?.disable) {
          return
        }

        if (isNative(this.environment)) {
          return
        }

        const [validId] = id.split('?')
        if (!validId.endsWith('.tsx')) {
          return
        }

        // Evaluate config and components only for files that can be extracted.
        // Register their dependency graph on the candidate transform so config
        // edits still invalidate compilation without taxing every package module.
        const evaluationDependencies = await tamaguiLoader.ensureFullConfigLoaded()
        for (const dependency of evaluationDependencies) {
          this.addWatchFile(dependency)
        }
        transformedModuleIds.add(validId)

        const { shouldDisable, shouldPrintDebug } = await Static.getPragmaOptions({
          source: code,
          path: validId,
        })

        if (shouldPrintDebug) {
          console.trace(
            `Current file: ${id} in environment: ${this.environment?.name}, shouldDisable: ${shouldDisable}`
          )
          console.info(`\n\nOriginal source:\n${code}\n\n`)
        }

        if (shouldDisable) {
          return
        }

        const isSSR = isNotClient(this.environment)

        // share compiled JS between client/SSR, but never across plugin instances
        const extractionGeneration = tamaguiLoader.getGeneration()
        const cacheKey = getHash(
          `${pluginInstanceId}:${extractionGeneration}:${code}${id}`
        )
        const pending = getPendingExtractions()

        // helper to format result based on environment
        const formatResult = (entry: CacheEntry) => {
          if (entry.css) {
            cssMap.set(entry.css.id, entry.css.code)
          }
          const finalCode =
            !isSSR && entry.cssImport ? `${entry.js}\n${entry.cssImport}` : entry.js
          return { code: finalCode, map: entry.map }
        }

        // check cache first
        const cached = memoryCache[cacheKey]
        if (cached) {
          if (process.env.DEBUG_TAMAGUI_CACHE) {
            console.info(
              `[tamagui-cache] HIT ${this.environment?.name || 'unknown'} ${id.split('/').pop()} key=${cacheKey.slice(0, 8)}`
            )
          }
          return formatResult(cached)
        }

        // check if another request is already extracting this file
        const pendingExtraction = pending.get(cacheKey)
        if (pendingExtraction) {
          if (process.env.DEBUG_TAMAGUI_CACHE) {
            console.info(
              `[tamagui-cache] WAIT ${this.environment?.name || 'unknown'} ${id.split('/').pop()} key=${cacheKey.slice(0, 8)}`
            )
          }
          const result = await pendingExtraction
          if (result) {
            return formatResult(result)
          }
          return
        }

        if (process.env.DEBUG_TAMAGUI_CACHE) {
          console.info(
            `[tamagui-cache] EXTRACT ${this.environment?.name || 'unknown'} ${id.split('/').pop()} key=${cacheKey.slice(0, 8)}`
          )
        }

        // create extraction promise and store it for deduplication
        const extractionPromise = (async (): Promise<CacheEntry | null> => {
          let extracted: ExtractedResponse | null
          try {
            extracted = await tamaguiLoader.extractToClassNames({
              source: code,
              sourcePath: validId,
              options: options!,
              shouldPrintDebug,
            })
          } catch (err) {
            if (process.env.DEBUG_TAMAGUI_CACHE) {
              console.info(
                `[tamagui-cache] ERROR extracting ${id.split('/').pop()}:`,
                err
              )
            }
            console.error(err instanceof Error ? err.message : String(err))
            return null
          }

          if (!extracted) {
            if (process.env.DEBUG_TAMAGUI_CACHE) {
              console.info(
                `[tamagui-cache] no extraction result for ${id.split('/').pop()}`
              )
            }
            return null
          }

          if (extractionGeneration !== tamaguiLoader.getGeneration()) {
            return null
          }

          const rootRelativeId = `${validId}${virtualExt}`
          const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

          let cssImport: string | null = null
          let css: CacheEntry['css'] = null

          // store CSS and prepare import (but don't include in cached JS)
          if (extracted.styles) {
            this.addWatchFile(rootRelativeId)

            if (server && cssMap.has(absoluteId)) {
              invalidateModule(rootRelativeId)
            }

            cssImport = `import "${rootRelativeId}";`
            cssMap.set(absoluteId, extracted.styles)
            css = { id: absoluteId, code: extracted.styles }
          }

          // cache the JS separately from CSS import
          const jsCode = extracted.js.toString()
          const cacheEntry: CacheEntry = {
            js: jsCode,
            map: extracted.map,
            cssImport,
            css,
          }

          // track cache size and clear if too large (64MB)
          const newSize = getSharedCacheSize() + jsCode.length + (css?.code.length || 0)
          if (newSize > 67108864) {
            clearSharedCache()
          } else {
            setSharedCacheSize(newSize)
          }
          memoryCache[cacheKey] = cacheEntry

          if (process.env.DEBUG_TAMAGUI_CACHE) {
            console.info(
              `[tamagui-cache] WRITE key=${cacheKey.slice(0, 8)} cacheSize=${Object.keys(memoryCache).length}`
            )
          }

          return cacheEntry
        })()

        // store pending promise for deduplication
        pending.set(cacheKey, extractionPromise)

        try {
          const result = await extractionPromise
          if (result) {
            return formatResult(result)
          }
          return
        } finally {
          // clean up pending map
          pending.delete(cacheKey)
        }
      },
    },
  }

  return [basePlugin, rnwLitePlugin, extractPlugin]
}
