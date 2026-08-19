import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path'
import { pathToFileURL } from 'node:url'
// @ts-ignore why
import { Color, colorLog } from '@tamagui/cli-color'
import { type StaticConfig, type TamaguiInternalConfig } from '@tamagui/web'
import esbuild from 'esbuild'
import FS from 'fs-extra'
import { readFile } from 'node:fs/promises'
import { registerRequire, setRequireResult } from '../registerRequire'
import type { TamaguiOptions } from '../types'
import { addLocalExports } from './addLocalExports'
import { esbuildLoaderConfig, esbundleTamaguiConfig } from './bundle'
import { getTamaguiConfigPathFromOptionsConfig } from './getTamaguiConfigPathFromOptionsConfig'
import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import { detectModuleFormat } from './detectModuleFormat'
import { staticEvaluationIgnorePlugin } from '../staticEvaluationIgnoredModules'

const nodeRequire = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)
const componentDisplayName = /* @__PURE__ */ Symbol.for('tamagui.componentDisplayName')

// track temp files for cleanup on exit
const activeTempFiles = new Set<string>()

function getDynamicEvalOutfile(name: string, format: 'esm' | 'cjs', contents: string) {
  const ext = format === 'esm' ? 'mjs' : 'cjs'
  const hash = createHash('sha1')
    .update(name)
    .update('\0')
    .update(format)
    .update('\0')
    .update(contents)
    .digest('hex')
    .slice(0, 10)
  return join(process.cwd(), '.tamagui', `dynamic-eval-${hash}-${basename(name)}.${ext}`)
}

function getEsbuildStdinLoader(filePath: string): esbuild.Loader {
  if (filePath.endsWith('.tsx')) return 'tsx'
  if (filePath.endsWith('.ts')) return 'ts'
  if (filePath.endsWith('.jsx')) return 'jsx'
  return 'js'
}

function resolvePackageEntry(packageName: string, format: 'esm' | 'cjs') {
  if (format === 'cjs') {
    return nodeRequire.resolve(packageName)
  }

  const packageJsonPath = nodeRequire.resolve(`${packageName}/package.json`)
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  const packageRoot = dirname(packageJsonPath)
  const exportEntry = packageJson.exports?.['.']

  const esmEntry =
    exportEntry?.import ||
    exportEntry?.module ||
    exportEntry?.browser ||
    packageJson.module

  if (typeof esmEntry === 'string') {
    return join(packageRoot, esmEntry)
  }

  return nodeRequire.resolve(packageName)
}

function cleanupTempFiles() {
  for (const f of activeTempFiles) {
    try {
      unlinkSync(f)
    } catch {}
  }
  activeTempFiles.clear()
}

process.on('exit', cleanupTempFiles)
process.on('SIGINT', () => {
  cleanupTempFiles()
  process.exit()
})
process.on('SIGTERM', () => {
  cleanupTempFiles()
  process.exit()
})

type NameToPaths = {
  [key: string]: Set<string>
}

export type LoadedComponents = {
  moduleName: string
  nameToInfo: Record<
    string,
    {
      staticConfig: StaticConfig
      displayName?: string
    }
  >
}

export type TamaguiProjectInfo = {
  components?: LoadedComponents[]
  tamaguiConfig?: TamaguiInternalConfig | null
  nameToPaths?: NameToPaths
  cached?: boolean
  dependencies?: string[]
  /**
   * The files whose bytes determine every compiler input this project produced:
   * the evaluated config and each component's static config. The compile cache
   * stamp is hashed from them, so they must be complete - a project that cannot
   * name them gets no stamp and no cache rather than a stamp that misses a
   * config change.
   */
  stampSources?: string[]
}

const external = [
  '@tamagui/core',
  '@tamagui/web',
  'react',
  'react-dom',
  'react-native-svg',
]

const esbuildExtraOptions = {
  define: {
    __DEV__: `${process.env.NODE_ENV === 'development'}`,
  },
}

// plugin to handle ESM-only features when bundling to CJS
const handleEsmFeaturesPlugin: esbuild.Plugin = {
  name: 'handle-esm-features',
  setup(build) {
    // only apply transforms for CJS output - ESM supports these natively
    const isCjs = build.initialOptions.format === 'cjs' || !build.initialOptions.format

    build.onLoad({ filter: /\.(ts|tsx|js|jsx|mjs)$/ }, (args) => {
      // skip if ESM output - import.meta and top-level await work natively
      if (!isCjs) {
        return null
      }

      // skip most node_modules
      if (args.path.includes('node_modules') && !args.path.includes('@tamagui')) {
        return null
      }

      let contents = readFileSync(args.path, 'utf8')
      let modified = false

      // transform import.meta.env -> process.env (Vite-style env vars)
      if (contents.includes('import.meta.env')) {
        contents = contents.replace(/import\.meta\.env/g, 'process.env')
        modified = true
      }

      // transform import.meta.url -> "" (not needed for static extraction)
      if (contents.includes('import.meta.url')) {
        contents = contents.replace(/import\.meta\.url/g, '""')
        modified = true
      }

      // transform import.meta.main -> false
      if (contents.includes('import.meta.main')) {
        contents = contents.replace(/import\.meta\.main/g, 'false')
        modified = true
      }

      if (modified) {
        return {
          contents,
          loader: args.path.endsWith('.tsx')
            ? 'tsx'
            : args.path.endsWith('.ts')
              ? 'ts'
              : args.path.endsWith('.jsx')
                ? 'jsx'
                : 'js',
        }
      }

      return null
    })
  },
}

// base options for transformSync (no plugins)
const esbuildTransformOptions = {
  target: 'es2022',
  format: 'cjs',
  jsx: 'automatic',
  platform: 'node',
  ...esbuildExtraOptions,
} satisfies esbuild.TransformOptions

// options for buildSync - NO plugins (buildSync doesn't support plugins)
export const esbuildOptions = {
  ...esbuildTransformOptions,
} satisfies esbuild.BuildOptions

// options for async build (with plugins)
export const esbuildOptionsWithPlugins = {
  ...esbuildTransformOptions,
  plugins: [handleEsmFeaturesPlugin],
} satisfies esbuild.BuildOptions

export type BundledConfig = Exclude<Awaited<ReturnType<typeof bundleConfig>>, undefined>

// will use cached one if watching
let currentBundle: BundledConfig | null = null
let currentBundleKey = ''
let isBundling = false
let lastBundle: BundledConfig | null = null
const waitForBundle = new Set<Function>()

export function hasBundledConfigChanged() {
  if (lastBundle === currentBundle) {
    return false
  }
  lastBundle = currentBundle
  return true
}

let loadedConfig: TamaguiInternalConfig | null = null

export const getLoadedConfig = () => loadedConfig
export const setLoadedConfig = (config: TamaguiInternalConfig) => {
  loadedConfig = config
}

function getBundleKey(props: TamaguiOptions) {
  return JSON.stringify({
    root: props.root,
    components: props.components,
    config: props.config,
    platform: props.platform,
    dangerouslyIgnoreStaticEvaluationModules:
      props.dangerouslyIgnoreStaticEvaluationModules,
  })
}

function getPackageNameFromPath(modulePath: string) {
  const normalized = modulePath.split(sep).join('/')
  const nodeModulesIndex = normalized.lastIndexOf('/node_modules/')
  if (nodeModulesIndex === -1) {
    return normalized.startsWith('.') || isAbsolute(normalized) ? undefined : normalized
  }
  const packagePath = normalized.slice(nodeModulesIndex + '/node_modules/'.length)
  const parts = packagePath.split('/')
  return parts[0]?.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
}

function findStaticEvaluationError(error: unknown):
  | {
      moduleName: string
      importer: string
      failedModule: string
      reason: string
    }
  | undefined {
  let current = error
  while (current instanceof Error) {
    if (
      'code' in current &&
      current.code === 'TAMAGUI_STATIC_EVALUATION_ERROR' &&
      'moduleName' in current &&
      'importer' in current &&
      'failedModule' in current &&
      'reason' in current
    ) {
      return current as Error & {
        moduleName: string
        importer: string
        failedModule: string
        reason: string
      }
    }
    current = current.cause
  }
}

export async function getBundledConfig(props: TamaguiOptions, rebuild = false) {
  const bundleKey = getBundleKey(props)
  if (isBundling) {
    await new Promise((res) => {
      waitForBundle.add(res)
    })
  }

  if (!currentBundle || currentBundleKey !== bundleKey || rebuild) {
    return await bundleConfig(props, rebuild)
  }

  return currentBundle
}

global.tamaguiLastLoaded ||= 0

function updateLastLoaded(config: any, bundleKey: string) {
  global.tamaguiLastLoaded = Date.now()
  global.tamaguiLastBundledConfig = config
  global.tamaguiLastBundledConfigKey = bundleKey
}

let hasBundledOnce = false

// use global to dedupe logging - this works within a single process
// but may log multiple times if worker threads are recreated
// that's acceptable - better than nothing
let hasLoggedBuild = false

const packageNameByDirectory = new Map<string, string | null>()

/** The name of the package a file belongs to, by nearest package.json. */
function owningPackageName(file: string): string | null {
  let directory = dirname(file)
  const walked: string[] = []
  while (true) {
    const known = packageNameByDirectory.get(directory)
    if (known !== undefined) {
      for (const step of walked) packageNameByDirectory.set(step, known)
      return known
    }
    walked.push(directory)
    const manifest = join(directory, 'package.json')
    if (existsSync(manifest)) {
      let name: string | null = null
      try {
        name = JSON.parse(readFileSync(manifest, 'utf-8')).name ?? null
      } catch {
        name = null
      }
      for (const step of walked) packageNameByDirectory.set(step, name)
      return name
    }
    const parent = dirname(directory)
    if (parent === directory) {
      for (const step of walked) packageNameByDirectory.set(step, null)
      return null
    }
    directory = parent
  }
}

/**
 * Every Tamagui-owned file this process actually loaded, read off the one CJS
 * module cache the compiler host requires through. Derived rather than listed:
 * a hardcoded package list silently misses whatever the engine grows next, and
 * this already covers 20+ packages the compiler reads through @tamagui/core.
 */
function requiredTamaguiPackageFiles(): string[] {
  const found: string[] = []
  for (const file of Object.keys(nodeRequire.cache)) {
    if (!file.includes('.')) continue
    const name = owningPackageName(file)
    if (name === 'tamagui' || name?.startsWith('@tamagui/')) found.push(file)
  }
  return found
}

export async function bundleConfig(props: TamaguiOptions, rebuild = false) {
  const bundleKey = getBundleKey(props)
  const root = props.root || process.cwd()
  const configEntry = props.config
    ? getTamaguiConfigPathFromOptionsConfig(props.config, root)
    : ''
  const baseComponents = (props.components || []).filter((x) => x !== '@tamagui/core')
  let componentOutPaths: string[] = []
  let componentImports: string[][] = []
  // webpack is calling this a ton for no reason
  if (
    !rebuild &&
    global.tamaguiLastBundledConfig &&
    global.tamaguiLastBundledConfigKey === bundleKey &&
    Date.now() - global.tamaguiLastLoaded < 3000
  ) {
    // just loaded recently
    return global.tamaguiLastBundledConfig
  }

  try {
    isBundling = true

    const rootRequire = createRequire(join(root, 'package.json'))
    const tmpDir = join(root, '.tamagui')
    // esbuild inlines process.env.TAMAGUI_TARGET into these bundles (see bundle.ts),
    // so their contents are platform-specific. keep web and native on separate paths:
    // sharing one path let a native bundle be picked up as the web config (and vice
    // versa) by the mtime reuse check below, emitting web classes with no CSS variables.
    const platformSuffix = (props.platform || 'web') === 'native' ? '.native' : '.web'
    // detect module format from config entry point
    const configFormat = configEntry ? detectModuleFormat(configEntry) : 'cjs'
    const configExt = configFormat === 'esm' ? '.mjs' : '.cjs'
    const configOutPath = join(tmpDir, `tamagui.config${platformSuffix}${configExt}`)
    // resolve from the consumer root, then walk from the exported subpath because
    // packages are not required to export their package.json
    const componentFormats: Array<'esm' | 'cjs'> = baseComponents.map((mod) => {
      try {
        let packageRoot = dirname(rootRequire.resolve(mod))
        while (!existsSync(join(packageRoot, 'package.json'))) {
          const parent = dirname(packageRoot)
          if (parent === packageRoot) {
            return 'cjs'
          }
          packageRoot = parent
        }
        const pkg = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf-8'))
        return pkg.type === 'module' ? 'esm' : 'cjs'
      } catch {
        return 'cjs'
      }
    })
    componentOutPaths = baseComponents.map((componentModule, i) => {
      const ext = componentFormats[i] === 'esm' ? '.mjs' : '.cjs'
      return join(
        tmpDir,
        `${componentModule
          .split(sep)
          .join('-')
          .replace(/[^a-z0-9]+/gi, '')}-components.config${platformSuffix}${ext}`
      )
    })
    let compilerDependencies: string[] = currentBundle?.dependencies ?? []

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.DEBUG?.startsWith('tamagui')
    ) {
      console.info(`Building config entry`, configEntry)
    }

    // check if ALL output files (config + components) already exist and are recent
    // (built by another worker) - this prevents duplicate builds across worker threads
    // we must check ALL files, not just the config, to avoid a race where another
    // worker has written the config but not yet finished writing component files
    let shouldBuild = rebuild || !props.disableInitialBuild
    if (shouldBuild && props.config && !rebuild) {
      const allOutFiles = [configOutPath, ...componentOutPaths]
      try {
        const stats = await Promise.all(
          allOutFiles.map((f) => FS.stat(f).catch(() => null))
        )
        const allExistAndRecent = stats.every(
          (s) => s !== null && Date.now() - s.mtimeMs < 3000
        )
        if (allExistAndRecent) {
          shouldBuild = false
        }
      } catch {
        // something went wrong checking files, just build
      }
    }

    if (shouldBuild) {
      // build them to node-compat versions
      try {
        await FS.ensureDir(tmpDir)
      } catch {
        //
      }

      const start = Date.now()

      const buildResults = await Promise.all([
        props.config
          ? esbundleTamaguiConfig(
              {
                entryPoints: [configEntry],
                external,
                outfile: configOutPath,
                target: 'node24',
                format: configFormat,
                absWorkingDir: root,
                metafile: true,
                dangerouslyIgnoreStaticEvaluationModules:
                  props.dangerouslyIgnoreStaticEvaluationModules,
                ...esbuildExtraOptions,
              },
              props.platform || 'web'
            )
          : null,
        ...baseComponents.map((componentModule, i) => {
          return esbundleTamaguiConfig(
            {
              entryPoints: [componentModule],
              // bare packages must stay bare so esbuild can select their
              // react-native conditional export; local files still use siblings
              resolvePlatformSpecificEntries:
                props.platform !== 'native' ||
                componentModule.startsWith('.') ||
                isAbsolute(componentModule),
              conditions: props.platform === 'native' ? ['react-native'] : undefined,
              external,
              outfile: componentOutPaths[i],
              target: 'node24',
              format: componentFormats[i],
              absWorkingDir: root,
              metafile: true,
              dangerouslyIgnoreStaticEvaluationModules:
                props.dangerouslyIgnoreStaticEvaluationModules,
              ...esbuildExtraOptions,
            },
            props.platform || 'web'
          )
        }),
      ])

      compilerDependencies = buildResults.flatMap((result) =>
        result?.metafile
          ? Object.keys(result.metafile.inputs).map((input) => resolve(root, input))
          : []
      )

      componentImports = buildResults.slice(1).map((result) => {
        if (!result?.metafile) {
          return []
        }
        const entryPoint = Object.values(result.metafile.outputs).find(
          (output) => output.entryPoint
        )?.entryPoint
        if (!entryPoint) {
          return []
        }
        return [
          ...new Set(
            result.metafile.inputs[entryPoint]?.imports
              .map((item) => getPackageNameFromPath(item.path))
              .filter((moduleName): moduleName is string => Boolean(moduleName)) || []
          ),
        ]
      })

      // only log once per process to avoid duplicate messages
      // also skip if _skipBuildLog is set (used during worker recycle warmup)
      if (!hasLoggedBuild && !props['_skipBuildLog']) {
        hasLoggedBuild = true
        colorLog(
          Color.FgYellow,
          `
  ➡ [tamagui] built config, components, prompt (${Date.now() - start}ms)`
        )

        if (process.env.DEBUG?.startsWith('tamagui')) {
          colorLog(
            Color.Dim,
            `
          Config     .${sep}${relative(root, configOutPath)}
          Components ${componentOutPaths.map((p) => `.${sep}${relative(root, p)}`).join('\n             ')}
          `
          )
        }
      }
    }

    // clear specific output file caches so we pick up the fresh (or newly discovered) build
    // only clear the built output files - not all require.cache entries, since that breaks
    // external requires like @tamagui/config/v6 that are externalized in the bundled CJS
    if (hasBundledOnce) {
      try {
        delete nodeRequire.cache[nodeRequire.resolve(configOutPath)]
      } catch {
        // file may not exist yet
      }
      for (const p of componentOutPaths) {
        try {
          delete nodeRequire.cache[nodeRequire.resolve(p)]
        } catch {
          // file may not exist yet
        }
      }
    } else {
      hasBundledOnce = true
    }

    let out: any
    if (configFormat === 'esm') {
      // use file:// URL for proper ESM resolution
      out = await import(
        `${pathToFileURL(configOutPath).href}?v=${FS.statSync(configOutPath).mtimeMs}`
      )
    } else {
      out = nodeRequire(configOutPath)
    }

    // try and find .config, even if on .default
    let config = out.default || out || out.config
    if (config && config.config && !config.tokens) {
      config = config.config
    }

    if (!config) {
      throw new Error(`No config: ${config}`)
    }

    loadedConfig = config

    if (!config.parsed) {
      const { createTamagui } = requireTamaguiCore(props.platform || 'web')
      // need to create it
      config = createTamagui(config)
    } else {
      // an esm-evaluated config parses inside its own core module instance,
      // leaving this host copy with empty token and media state. install the
      // already-parsed config so host module-local state matches, same as
      // loadTamaguiFromModules, without re-parsing or browser css discovery.
      const { installTamaguiConfig } = requireTamaguiCore(props.platform || 'web')
      installTamaguiConfig(config)
    }

    if (props.outputCSS) {
      await writeTamaguiCSS(props.outputCSS, config)
    }

    if (rebuild) {
      delete cacheComponents[componentOutPaths.join('\0')]
    }
    let components = await loadComponents({
      ...props,
      components: componentOutPaths,
    })

    if (!components) {
      throw new Error(`No components found: ${componentOutPaths.join(', ')}`)
    }

    // map from built back to original module names
    for (const component of components) {
      component.moduleName =
        baseComponents[componentOutPaths.indexOf(component.moduleName)] ||
        component.moduleName

      if (!component.moduleName) {
        if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
          console.warn(
            `⚠️ no module name found: ${component.moduleName} ${JSON.stringify(
              baseComponents
            )} in ${JSON.stringify(componentOutPaths)}`
          )
        }
      }
    }

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.DEBUG?.startsWith('tamagui')
    ) {
      console.info('Loaded components', components)
    }

    const res = {
      components,
      nameToPaths: {},
      tamaguiConfig: config,
      dependencies: compilerDependencies,
      // the generated bundles inline every source they were built from,
      // including the component packages resolved out of node_modules, so their
      // bytes are a complete description of what the compiler host will read
      stampSources: [
        ...(configEntry ? [configOutPath] : []),
        ...componentOutPaths,
        // The generated bundles inline the user's config and components, but
        // `external` keeps @tamagui/core and @tamagui/web out of them, and
        // everything reached only through those two is left out with them.
        // Those packages hold the staticConfig and style engine every lowering
        // is computed against, so without their bytes an in-place engine edit at
        // the same version - exactly what `bun run watch` and
        // `bun release --into` produce - would serve plans built by the
        // previous engine.
        ...requiredTamaguiPackageFiles(),
      ],
    }

    currentBundle = res
    currentBundleKey = bundleKey
    updateLastLoaded(res, bundleKey)

    return res
  } catch (err: any) {
    const failure = findStaticEvaluationError(err)
    const componentIndex = failure
      ? componentOutPaths.findIndex(
          (outputPath) =>
            outputPath === failure.moduleName || outputPath === failure.importer
        )
      : -1
    const configuredComponent = baseComponents[componentIndex]
    if (failure && configuredComponent) {
      const configuredImport =
        configuredComponent.startsWith('.') || isAbsolute(configuredComponent)
          ? componentImports[componentIndex]?.[0] || configuredComponent
          : configuredComponent
      throw new Error(
        `[tamagui] Static evaluation could not proceed for configured component "${configuredComponent}".\nThe import "${configuredImport}" reached module "${failure.failedModule}", which failed during Node evaluation.\nReason: ${failure.reason}\nFix the failing module so it can run in Node during the build. If "${configuredImport}" is runtime-only and none of its exports create your Tamagui config or components, add "${configuredImport}" to dangerouslyIgnoreStaticEvaluationModules in tamagui.build.ts.`,
        { cause: err }
      )
    }
    throw new Error(
      `[tamagui] Static evaluation could not proceed for configured Tamagui config "${configEntry || '<default config>'}".\nReason: ${err instanceof Error ? err.message : String(err)}\nFix the failing import so it can run in Node during the build. If it is runtime-only and none of its exports create your Tamagui config or components, add its exact module name to dangerouslyIgnoreStaticEvaluationModules in tamagui.build.ts.`,
      { cause: err }
    )
  } finally {
    isBundling = false
    waitForBundle.forEach((cb) => cb())
    waitForBundle.clear()
  }
}

export async function writeTamaguiCSS(outputCSS: string, config: TamaguiInternalConfig) {
  const flush = async () => {
    colorLog(Color.FgYellow, `  ➡ [tamagui] output css: ${outputCSS}`)
    await FS.mkdirp(dirname(outputCSS))
    await FS.writeFile(outputCSS, css)
  }

  const css = config.getCSS()
  if (typeof css !== 'string') {
    throw new Error(`Invalid CSS: ${typeof css} ${css}`)
  }
  try {
    if (existsSync(outputCSS) && (await readFile(outputCSS, 'utf8')) === css) {
      // no change
    } else {
      await flush()
    }
  } catch (err) {
    console.info('Error writing themes', err)
  }
}

export async function loadComponents(props: TamaguiOptions, forceExports = false) {
  const coreComponents = getCoreComponentsSync(props)
  const otherComponents = await loadComponentsInner(props, forceExports)
  return [...coreComponents, ...otherComponents]
}

export function loadComponentsSync(props: TamaguiOptions, forceExports = false) {
  const coreComponents = getCoreComponentsSync(props)
  const otherComponents = loadComponentsInnerSync(props, forceExports)
  return [...coreComponents, ...otherComponents]
}

function getCoreComponentsSync(props: TamaguiOptions) {
  const loaded = loadComponentsInnerSync({
    ...props,
    components: ['@tamagui/core'],
  })

  if (!loaded[0]) {
    throw new Error(`Core should always load`)
  }

  // always load core so we can optimize if directly importing
  return [
    {
      ...loaded[0],
      moduleName: '@tamagui/core',
    },
  ]
}

export async function loadComponentsInner(
  props: TamaguiOptions,
  forceExports = false
): Promise<LoadedComponents[]> {
  const componentsModules = props.components || []

  const key = JSON.stringify([
    props.platform,
    componentsModules,
    props.dangerouslyIgnoreStaticEvaluationModules,
  ])

  if (!forceExports && cacheComponents[key]) {
    return cacheComponents[key]
  }

  const { unregister } = registerRequire(props.platform || 'web', {
    ignoredModules: props.dangerouslyIgnoreStaticEvaluationModules,
  })

  try {
    const results: LoadedComponents[] = []

    for (const name of componentsModules) {
      const extension = extname(name)
      const isLocal = Boolean(extension)
      const isDynamic = isLocal && forceExports
      const format = isLocal ? detectModuleFormat(name) : ('cjs' as const)

      const fileContents = isDynamic ? readFileSync(name, 'utf-8') : ''
      let loadModule = name
      let writtenContents = fileContents

      const attemptLoad = async ({ forceExports = false } = {}) => {
        if (isDynamic) {
          writtenContents = forceExports
            ? addLocalExports(esbuildit(fileContents, 'modern'), name)
            : fileContents
          loadModule = getDynamicEvalOutfile(name, format, writtenContents)

          FS.ensureDirSync(dirname(loadModule))
          activeTempFiles.add(loadModule)

          await esbuild.build({
            ...esbuildOptionsWithPlugins,
            plugins: [
              ...(esbuildOptionsWithPlugins.plugins || []),
              staticEvaluationIgnorePlugin(
                props.dangerouslyIgnoreStaticEvaluationModules
              ),
            ],
            format,
            outfile: loadModule,
            stdin: {
              contents: writtenContents,
              resolveDir: dirname(name),
              sourcefile: name,
              loader: getEsbuildStdinLoader(name),
            },
            alias: {
              'react-native': resolvePackageEntry(
                '@tamagui/react-native-web-lite',
                format
              ),
              '@tamagui/react-native-web-lite': resolvePackageEntry(
                '@tamagui/react-native-web-lite',
                format
              ),
              '@tamagui/react-native-web-internals': resolvePackageEntry(
                '@tamagui/react-native-web-internals',
                format
              ),
            },
            bundle: true,
            packages: 'external',
            allowOverwrite: true,
            sourcemap: false,
            loader: esbuildLoaderConfig,
          })
        }

        if (process.env.DEBUG === 'tamagui') {
          console.info(`loadModule`, loadModule, format)
        }

        let moduleResult: any
        if (format === 'esm') {
          // use file:// URL for proper ESM resolution
          moduleResult = await import(
            `${pathToFileURL(loadModule).href}?v=${FS.statSync(loadModule).mtimeMs}`
          )
        } else {
          moduleResult = nodeRequire(loadModule)
        }

        if (!forceExports) {
          setRequireResult(name, moduleResult)
        }

        const nameToInfo = getComponentStaticConfigByName(
          name,
          interopDefaultExport(moduleResult)
        )

        return {
          moduleName: name,
          nameToInfo,
        }
      }

      const dispose = () => {
        if (isDynamic) {
          FS.removeSync(loadModule)
          activeTempFiles.delete(loadModule)
        }
      }

      let loaded: LoadedComponents | LoadedComponents[] | undefined

      try {
        loaded = await attemptLoad({ forceExports: isDynamic })
      } catch (err) {
        if (!isDynamic) {
          throw new Error(
            `[tamagui] Failed to statically evaluate configured component module "${name}". ${err instanceof Error ? err.message : String(err)}`,
            { cause: err }
          )
        }
        writtenContents = fileContents
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`Error adding local component exports`, err)
        }

        try {
          loaded = await attemptLoad({ forceExports: false })
        } catch (err2) {
          throw new Error(
            `[tamagui] Failed to statically evaluate configured component module "${name}" at "${loadModule}". ${err2 instanceof Error ? err2.message : String(err2)}`,
            { cause: err2 }
          )
        }
      } finally {
        dispose()
      }

      if (Array.isArray(loaded)) {
        results.push(...loaded)
      } else if (loaded) {
        results.push(loaded)
      }
    }

    cacheComponents[key] = results
    return results
  } finally {
    unregister()
  }
}

// sync version - uses cjs format for buildSync (no plugin support)
export function loadComponentsInnerSync(
  props: TamaguiOptions,
  forceExports = false
): LoadedComponents[] {
  const componentsModules = props.components || []

  const key = JSON.stringify([
    props.platform,
    componentsModules,
    props.dangerouslyIgnoreStaticEvaluationModules,
  ])

  if (!forceExports && cacheComponents[key]) {
    return cacheComponents[key]
  }

  const { unregister } = registerRequire(props.platform || 'web', {
    ignoredModules: props.dangerouslyIgnoreStaticEvaluationModules,
  })

  try {
    const info: LoadedComponents[] = componentsModules.flatMap((name) => {
      const extension = extname(name)
      const isLocal = Boolean(extension)
      const isDynamic = isLocal && forceExports

      const fileContents = isDynamic ? readFileSync(name, 'utf-8') : ''
      let loadModule = name
      let writtenContents = fileContents

      function attemptLoad({ forceExports = false } = {}) {
        if (isDynamic) {
          writtenContents = forceExports
            ? addLocalExports(esbuildit(fileContents, 'modern'), name)
            : fileContents
          loadModule = getDynamicEvalOutfile(name, 'cjs', writtenContents)

          FS.ensureDirSync(dirname(loadModule))
          activeTempFiles.add(loadModule)

          esbuild.buildSync({
            ...esbuildOptions,
            outfile: loadModule,
            stdin: {
              contents: writtenContents,
              resolveDir: dirname(name),
              sourcefile: name,
              loader: getEsbuildStdinLoader(name),
            },
            alias: {
              'react-native': resolvePackageEntry(
                '@tamagui/react-native-web-lite',
                'esm'
              ),
              '@tamagui/react-native-web-lite': resolvePackageEntry(
                '@tamagui/react-native-web-lite',
                'esm'
              ),
              '@tamagui/react-native-web-internals': resolvePackageEntry(
                '@tamagui/react-native-web-internals',
                'esm'
              ),
            },
            bundle: true,
            packages: 'external',
            allowOverwrite: true,
            sourcemap: false,
            loader: esbuildLoaderConfig,
          })
        }

        if (process.env.DEBUG === 'tamagui') {
          console.info(`loadModule`, loadModule, nodeRequire.resolve(loadModule))
        }

        const moduleResult = nodeRequire(loadModule)

        if (!forceExports) {
          setRequireResult(name, moduleResult)
        }

        const nameToInfo = getComponentStaticConfigByName(
          name,
          interopDefaultExport(moduleResult)
        )

        return {
          moduleName: name,
          nameToInfo,
        }
      }

      const dispose = () => {
        if (isDynamic) {
          FS.removeSync(loadModule)
          activeTempFiles.delete(loadModule)
        }
      }

      try {
        const res = attemptLoad({ forceExports: isDynamic })
        return res
      } catch (err) {
        if (!isDynamic) {
          throw new Error(
            `[tamagui] Failed to statically evaluate configured component module "${name}". ${err instanceof Error ? err.message : String(err)}`,
            { cause: err }
          )
        }
        writtenContents = fileContents
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`Error adding local component exports`, err)
        }
      } finally {
        dispose()
      }

      try {
        return attemptLoad({ forceExports: false })
      } catch (err) {
        throw new Error(
          `[tamagui] Failed to statically evaluate configured component module "${name}" at "${loadModule}". ${err instanceof Error ? err.message : String(err)}`,
          { cause: err }
        )
      } finally {
        dispose()
      }
    })
    cacheComponents[key] = info
    return info
  } finally {
    unregister()
  }
}

const esbuildit = (src: string, target?: 'modern') => {
  return esbuild.transformSync(src, {
    ...esbuildTransformOptions,
    ...(target === 'modern' && {
      target: 'es2022',
      jsx: 'automatic',
      loader: 'tsx',
      platform: 'neutral',
      format: 'esm',
    }),
  }).code
}

export function getComponentStaticConfigByName(name: string, exported: any) {
  const components: Record<string, { staticConfig: StaticConfig; displayName?: string }> =
    {}
  if (!exported || typeof exported !== 'object' || Array.isArray(exported)) {
    throw new Error(`Invalid export from package ${name}: ${typeof exported}`)
  }

  for (const key in exported) {
    const found = getTamaguiComponent(key, exported[key])
    if (found) {
      // remove non-stringifyable
      const { Component, ...sc } = found.staticConfig
      components[key] = {
        staticConfig: sc,
        ...(found.displayName && { displayName: found.displayName }),
      }
    }
  }
  return components
}

function getTamaguiComponent(
  name: string,
  Component: any
): undefined | { staticConfig: StaticConfig; displayName?: string } {
  if (name[0].toUpperCase() !== name[0]) {
    return
  }
  const staticConfig = Component?.staticConfig as StaticConfig | undefined
  if (staticConfig) {
    return {
      staticConfig,
      displayName: Component[componentDisplayName] as string | undefined,
    }
  }
}

function interopDefaultExport(mod: any) {
  return mod?.default ?? mod
}

const cacheComponents: Record<string, LoadedComponents[]> = {}
