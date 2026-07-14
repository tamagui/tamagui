import Static from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/static'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
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
  EnvironmentModuleNode,
  Plugin,
  PluginOption,
  ResolvedConfig,
  ViteDevServer,
} from 'vite'
import type { Environment } from 'vite'
import { createViteTamaguiLoader, TAMAGUI_EVALUATION_ENVIRONMENT } from './loadTamagui'
import {
  createTailwindHybridState,
  isTamaguiCoreResetCSS,
  layerTamaguiCoreResetCSS,
  TAILWIND_RESOLVED_ID,
  TAILWIND_VIRTUAL_ID,
  updateTailwindForWatchChange,
  wrapWithTamaguiLayer,
} from './tailwind'

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

const PLUGIN_INSTANCE_KEY = '__tamagui_vite_plugin_instance__'

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
  const compilerFrontend = new Static.CompilerFrontend()
  const tailwindState = createTailwindHybridState()
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

  const cssMap = new Map<string, string>()
  const transformedModuleIds = new Set<string>()
  const compilerHotUpdateSignatures = new Map<string, string>()
  const compilerHotReloadSignatures = new Map<string, string>()
  let config: ResolvedConfig
  let server: ViteDevServer
  const virtualExt = `.tamagui.css`

  const configureTailwind = async (addWatchFile: (file: string) => void) => {
    return tailwindState.configure(
      config.root,
      tamaguiLoader.getGeneration(),
      await tamaguiLoader.getTamaguiConfig(),
      addWatchFile,
      (glob) => server?.watcher.add(glob)
    )
  }

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
    tailwindState.clear()
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

  function invalidateTailwindModule() {
    if (!server) return
    for (const environment of Object.values(server.environments)) {
      if (environment.name !== 'client') continue
      const module = environment.moduleGraph.getModuleById(TAILWIND_RESOLVED_ID)
      if (module) environment.moduleGraph.invalidateModule(module)
    }
  }

  function getClientTailwindModule() {
    return server?.environments.client?.moduleGraph.getModuleById(TAILWIND_RESOLVED_ID)
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
      addIfInstalled(userConf, userConf.root, [
        '@tamagui/core',
        '@tamagui/web',
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
          if (this.environment.name !== 'client') return
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
                  ? compilerFrontend.remove(options.file).invalidatedIds
                  : await compilerFrontend.update({
                      id: options.file,
                      source: source!,
                      root: config.root,
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
          if (!(await configureTailwind(() => {}))) {
            return affectedModules.size ? [...affectedModules] : undefined
          }
          const changed =
            options.type === 'delete'
              ? await tailwindState.removeSource(options.file)
              : await tailwindState.scanSource(options.file, source!)
          if (!changed) return affectedModules.size ? [...affectedModules] : undefined
          const virtualModule = getClientTailwindModule()
          if (!virtualModule)
            return affectedModules.size ? [...affectedModules] : undefined
          this.environment.moduleGraph.invalidateModule(virtualModule)
          affectedModules.add(virtualModule)
          for (const module of options.modules) affectedModules.add(module)
          return [...affectedModules]
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

    async watchChange(id, change) {
      if (config.command !== 'build') {
        return
      }
      if (tamaguiLoader.isEvaluationDependency(id)) {
        tamaguiLoader.invalidate(id)
        invalidateCompilerModules()
        return
      }
      await updateTailwindForWatchChange(tailwindState, id, change.event, () =>
        configureTailwind((file) => this.addWatchFile(file))
      )
    },

    async resolveId(source) {
      if (isNative(this.environment)) {
        return
      }

      if (isNotClient(this.environment)) {
        return
      }

      if (source === TAILWIND_VIRTUAL_ID) {
        return TAILWIND_RESOLVED_ID
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

      if (id === TAILWIND_RESOLVED_ID) {
        if (!(await configureTailwind((file) => this.addWatchFile(file)))) {
          return ''
        }
        return tailwindState.css
      }

      if (!shouldExtract) return

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

        // Frameworks may run route-analysis transforms before Vite starts the
        // build environment. The real module transform runs again after
        // buildStart installs the owned Tamagui evaluation runner.
        if (!tamaguiLoader.getEnvironment()) return

        if (isNative(this.environment)) {
          return
        }

        const [validId] = id.split('?')
        if (isTamaguiCoreResetCSS(validId)) {
          const layeredResetCSS = layerTamaguiCoreResetCSS(
            validId,
            code,
            await configureTailwind((file) => this.addWatchFile(file))
          )
          if (layeredResetCSS) {
            return { code: layeredResetCSS, map: null }
          }
        }
        if (isFrameworkAnalysisRequest(id) || !isAppJSXSource(validId)) {
          return
        }

        // ensure tamagui is loaded only for application JSX candidates
        const options = await ensureLoaded()

        // fully disabled = no extraction AND no debug attrs
        if (options?.disable) {
          return
        }

        const isSSR = isNotClient(this.environment)
        const tailwindEnabled = await configureTailwind((file) => this.addWatchFile(file))
        if (tailwindEnabled && (await tailwindState.scanSource(validId, code))) {
          invalidateTailwindModule()
        }
        const tailwindImport =
          tailwindEnabled && !isSSR ? `import "${TAILWIND_VIRTUAL_ID}";` : null
        if (tailwindEnabled) {
          transformedModuleIds.add(validId)
          for (const dependency of tamaguiLoader.getEvaluationDependencies()) {
            this.addWatchFile(dependency)
          }
        }

        return tailwindImport
          ? { code: `${code}\n${tailwindImport}`, map: null }
          : undefined
      },
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
        const result = await compilerFrontend.compile({
          id: validId,
          source: code,
          root: config.root,
          target: 'web',
          project: {
            ...compilerProject,
            generation: `${pluginInstanceId}:${tamaguiLoader.getGeneration()}`,
          },
          resolve: async (specifier, importer) => {
            const resolution = await this.resolve(specifier, importer, { skipSelf: true })
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
        transformedModuleIds.add(validId)
        for (const dependency of result.plan.dependencies) {
          if (path.isAbsolute(dependency)) this.addWatchFile(dependency)
        }

        const isSSR = isNotClient(this.environment)
        let cssImport: string | null = null
        if (result.plan.css) {
          const rootRelativeId = `${validId}${virtualExt}`
          const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)
          const css = tailwindState.layerTamagui
            ? wrapWithTamaguiLayer(result.plan.css)
            : result.plan.css
          cssMap.set(absoluteId, css)
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

  return [basePlugin, rnwLitePlugin, extractPlugin, sharedCompilerPlugin]
}
