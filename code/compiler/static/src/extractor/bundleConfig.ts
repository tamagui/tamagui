import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, unlinkSync } from 'node:fs'
import { basename, dirname, extname, join, relative, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
// @ts-ignore why
import { Color, colorLog } from '@tamagui/cli-color'
import { type StaticConfig, type TamaguiInternalConfig } from '@tamagui/web'
import esbuild from 'esbuild'
import * as FS from 'fs-extra'
import { readFile } from 'node:fs/promises'
import { registerRequire, setRequireResult } from '../registerRequire'
import type { TamaguiOptions } from '../types'
import { babelParse } from './babelParse'
import { esbuildLoaderConfig, esbundleTamaguiConfig } from './bundle'
import { getTamaguiConfigPathFromOptionsConfig } from './getTamaguiConfigPathFromOptionsConfig'
import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import { detectModuleFormat } from './detectModuleFormat'

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
    return require.resolve(packageName)
  }

  const packageJsonPath = require.resolve(`${packageName}/package.json`)
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

  return require.resolve(packageName)
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
    }
  >
}

export type TamaguiProjectInfo = {
  components?: LoadedComponents[]
  tamaguiConfig?: TamaguiInternalConfig | null
  nameToPaths?: NameToPaths
  cached?: boolean
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

      // stub files with top-level await - they're typically runtime-only
      if (
        /^\s*(?:const|let|var|export)\s+[^=]*=\s*await\b/m.test(contents) ||
        /^await\s/m.test(contents)
      ) {
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`[tamagui] stubbing file with top-level await: ${args.path}`)
        }
        return {
          contents: `// stubbed - contains top-level await\nmodule.exports = {}`,
          loader: 'js',
        }
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

export async function getBundledConfig(props: TamaguiOptions, rebuild = false) {
  if (isBundling) {
    await new Promise((res) => {
      waitForBundle.add(res)
    })
  } else if (!currentBundle || rebuild) {
    return await bundleConfig(props)
  }
  return currentBundle
}

global.tamaguiLastLoaded ||= 0

function updateLastLoaded(config: any) {
  global.tamaguiLastLoaded = Date.now()
  global.tamaguiLastBundledConfig = config
}

let hasBundledOnce = false

// use global to dedupe logging - this works within a single process
// but may log multiple times if worker threads are recreated
// that's acceptable - better than nothing
let hasLoggedBuild = false

export async function bundleConfig(props: TamaguiOptions) {
  // webpack is calling this a ton for no reason
  if (global.tamaguiLastBundledConfig && Date.now() - global.tamaguiLastLoaded < 3000) {
    // just loaded recently
    return global.tamaguiLastBundledConfig
  }

  try {
    isBundling = true

    const configEntry = props.config
      ? getTamaguiConfigPathFromOptionsConfig(props.config)
      : ''
    const tmpDir = join(process.cwd(), '.tamagui')
    // detect module format from config entry point
    const configFormat = configEntry ? detectModuleFormat(configEntry) : 'cjs'
    const configExt = configFormat === 'esm' ? '.mjs' : '.cjs'
    const configOutPath = join(tmpDir, `tamagui.config${configExt}`)
    const baseComponents = (props.components || []).filter((x) => x !== '@tamagui/core')
    // detect format per component module
    const componentFormats: Array<'esm' | 'cjs'> = baseComponents.map((mod) => {
      try {
        const pkgJson = require.resolve(mod + '/package.json')
        const pkg = JSON.parse(readFileSync(pkgJson, 'utf-8'))
        return pkg.type === 'module' ? 'esm' : 'cjs'
      } catch {
        return 'cjs'
      }
    })
    const componentOutPaths = baseComponents.map((componentModule, i) => {
      const ext = componentFormats[i] === 'esm' ? '.mjs' : '.cjs'
      return join(
        tmpDir,
        `${componentModule
          .split(sep)
          .join('-')
          .replace(/[^a-z0-9]+/gi, '')}-components.config${ext}`
      )
    })

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
    let shouldBuild = !props.disableInitialBuild
    if (shouldBuild && props.config) {
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

      await Promise.all([
        props.config
          ? esbundleTamaguiConfig(
              {
                entryPoints: [configEntry],
                external,
                outfile: configOutPath,
                target: 'node24',
                format: configFormat,
                ...esbuildExtraOptions,
              },
              props.platform || 'web'
            )
          : null,
        ...baseComponents.map((componentModule, i) => {
          return esbundleTamaguiConfig(
            {
              entryPoints: [componentModule],
              resolvePlatformSpecificEntries: true,
              external,
              outfile: componentOutPaths[i],
              target: 'node24',
              format: componentFormats[i],
              ...esbuildExtraOptions,
            },
            props.platform || 'web'
          )
        }),
      ])

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
          Config     .${sep}${relative(process.cwd(), configOutPath)}
          Components ${componentOutPaths.map((p) => `.${sep}${relative(process.cwd(), p)}`).join('\n             ')}
          `
          )
        }
      }
    }

    // clear specific output file caches so we pick up the fresh (or newly discovered) build
    // only clear the built output files - not all require.cache entries, since that breaks
    // external requires like @tamagui/config/v3 that are externalized in the bundled CJS
    if (hasBundledOnce) {
      try {
        delete require.cache[require.resolve(configOutPath)]
      } catch {
        // file may not exist yet
      }
      for (const p of componentOutPaths) {
        try {
          delete require.cache[require.resolve(p)]
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
      out = await import(pathToFileURL(configOutPath).href)
    } else {
      out = require(configOutPath)
    }

    // try and find .config, even if on .default
    let config = out.default || out || out.config
    if (config && config.config && !config.tokens) {
      config = config.config
    }

    if (!config) {
      throw new Error(`No config: ${config}`)
    }

    // check for ProxyWorm - indicates a module loading error
    if (config._isProxyWorm) {
      throw new Error(
        `Got a proxied config - likely a module loading error. Set DEBUG=tamagui for details.`
      )
    }

    loadedConfig = config

    if (!config.parsed) {
      const { createTamagui } = requireTamaguiCore(props.platform || 'web')
      // need to create it
      config = createTamagui(config)
    }

    if (props.outputCSS) {
      await writeTamaguiCSS(props.outputCSS, config)
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
    }

    currentBundle = res
    updateLastLoaded(res)

    return res
  } catch (err: any) {
    console.error(
      `Error bundling tamagui config: ${err?.message} (run with DEBUG=tamagui to see stack)`
    )
    if (process.env.DEBUG?.includes('tamagui')) {
      console.error(err.stack)
    }
  } finally {
    isBundling = false
    waitForBundle.forEach((cb) => cb())
    waitForBundle.clear()
  }
}

export async function writeTamaguiCSS(outputCSS: string, config: TamaguiInternalConfig) {
  const flush = async () => {
    colorLog(Color.FgYellow, `  ➡ [tamagui] output css: ${outputCSS}`)
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
  return [...coreComponents, ...(otherComponents || [])]
}

export function loadComponentsSync(props: TamaguiOptions, forceExports = false) {
  const coreComponents = getCoreComponentsSync(props)
  const otherComponents = loadComponentsInnerSync(props, forceExports)
  return [...coreComponents, ...(otherComponents || [])]
}

function getCoreComponentsSync(props: TamaguiOptions) {
  const loaded = loadComponentsInnerSync({
    ...props,
    components: ['@tamagui/core'],
  })

  if (!loaded) {
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
): Promise<null | LoadedComponents[]> {
  const componentsModules = props.components || []

  const key = componentsModules.join('\0')

  if (!forceExports && cacheComponents[key]) {
    return cacheComponents[key]
  }

  const { unregister } = registerRequire(props.platform || 'web', {
    proxyWormImports: forceExports,
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
      let didBabel = false

      const attemptLoad = async ({ forceExports = false } = {}) => {
        if (isDynamic) {
          writtenContents = forceExports
            ? transformAddExports(babelParse(esbuildit(fileContents, 'modern'), name))
            : fileContents
          loadModule = getDynamicEvalOutfile(name, format, writtenContents)

          FS.ensureDirSync(dirname(loadModule))
          activeTempFiles.add(loadModule)

          await esbuild.build({
            ...esbuildOptionsWithPlugins,
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
          moduleResult = await import(pathToFileURL(loadModule).href)
        } else {
          moduleResult = require(loadModule)
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
        loaded = await attemptLoad({ forceExports: true })
        didBabel = true
      } catch (err) {
        console.info('babel err', err, writtenContents)
        writtenContents = fileContents
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`Error parsing babel likely`, err)
        }

        try {
          loaded = await attemptLoad({ forceExports: false })
        } catch (err2) {
          if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
            console.info(
              `\nTamagui attempted but failed to dynamically optimize components in:\n  ${name}\n`
            )
            console.info(err2)
            console.info(
              `At: ${loadModule}`,
              `\ndidBabel: ${didBabel}`,
              `\nIn:`,
              writtenContents,
              `\nisDynamic: `,
              isDynamic
            )
          }
          loaded = []
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
  } catch (err: any) {
    console.info(`Tamagui error bundling components`, err.message, err.stack)
    return null
  } finally {
    unregister()
  }
}

// sync version - uses cjs format for buildSync (no plugin support)
export function loadComponentsInnerSync(
  props: TamaguiOptions,
  forceExports = false
): null | LoadedComponents[] {
  const componentsModules = props.components || []

  const key = componentsModules.join('\0')

  if (!forceExports && cacheComponents[key]) {
    return cacheComponents[key]
  }

  const { unregister } = registerRequire(props.platform || 'web', {
    proxyWormImports: forceExports,
  })

  try {
    const info: LoadedComponents[] = componentsModules.flatMap((name) => {
      const extension = extname(name)
      const isLocal = Boolean(extension)
      const isDynamic = isLocal && forceExports

      const fileContents = isDynamic ? readFileSync(name, 'utf-8') : ''
      let loadModule = name
      let writtenContents = fileContents
      let didBabel = false

      function attemptLoad({ forceExports = false } = {}) {
        if (isDynamic) {
          writtenContents = forceExports
            ? transformAddExports(babelParse(esbuildit(fileContents, 'modern'), name))
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
          console.info(`loadModule`, loadModule, require.resolve(loadModule))
        }

        const moduleResult = require(loadModule)

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
        const res = attemptLoad({ forceExports: true })
        didBabel = true
        return res
      } catch (err) {
        console.info('babel err', err, writtenContents)
        writtenContents = fileContents
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`Error parsing babel likely`, err)
        }
      } finally {
        dispose()
      }

      try {
        return attemptLoad({ forceExports: false })
      } catch (err) {
        if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
          console.info(
            `\nTamagui attempted but failed to dynamically optimize components in:\n  ${name}\n`
          )
          console.info(err)
          console.info(
            `At: ${loadModule}`,
            `\ndidBabel: ${didBabel}`,
            `\nIn:`,
            writtenContents,
            `\nisDynamic: `,
            isDynamic
          )
        }
        return []
      } finally {
        dispose()
      }
    })
    cacheComponents[key] = info
    return info
  } catch (err: any) {
    console.info(`Tamagui error bundling components`, err.message, err.stack)
    return null
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

function getComponentStaticConfigByName(name: string, exported: any) {
  const components: Record<string, { staticConfig: StaticConfig }> = {}
  try {
    if (!exported || typeof exported !== 'object' || Array.isArray(exported)) {
      throw new Error(`Invalid export from package ${name}: ${typeof exported}`)
    }

    for (const key in exported) {
      const found = getTamaguiComponent(key, exported[key])
      if (found) {
        // remove non-stringifyable
        const { Component, ...sc } = found.staticConfig
        components[key] = { staticConfig: sc }
      }
    }
  } catch (err) {
    if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
      console.error(
        `Tamagui failed getting components from ${name} (Disable error by setting environment variable TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD=1)`
      )
      console.error(err)
    }
  }
  return components
}

function getTamaguiComponent(
  name: string,
  Component: any
): undefined | { staticConfig: StaticConfig } {
  if (name[0].toUpperCase() !== name[0]) {
    return
  }
  const staticConfig = Component?.staticConfig as StaticConfig | undefined
  if (staticConfig) {
    return Component
  }
}

function interopDefaultExport(mod: any) {
  return mod?.default ?? mod
}

const cacheComponents: Record<string, LoadedComponents[]> = {}

function transformAddExports(ast: t.File) {
  const usedNames = new Set<string>()

  // avoid clobbering
  // @ts-ignore
  traverse(ast, {
    ExportNamedDeclaration(nodePath) {
      if (nodePath.node.specifiers) {
        for (const spec of nodePath.node.specifiers) {
          usedNames.add(
            t.isIdentifier(spec.exported) ? spec.exported.name : spec.exported.value
          )
        }
      }
    },
  })

  // @ts-ignore
  traverse(ast, {
    VariableDeclaration(nodePath) {
      // top level only
      if (!t.isProgram(nodePath.parent)) return
      const decs = nodePath.node.declarations
      if (decs.length > 1) return
      const [dec] = decs
      if (!t.isIdentifier(dec.id)) return
      if (!dec.init) return
      if (usedNames.has(dec.id.name)) return
      usedNames.add(dec.id.name)
      nodePath.replaceWith(
        t.exportNamedDeclaration(t.variableDeclaration('let', [dec]), [
          t.exportSpecifier(t.identifier(dec.id.name), t.identifier(dec.id.name)),
        ])
      )
    },
  })

  // @ts-ignore
  return generate(ast as any, {
    concise: false,
    filename: 'test.tsx',
    retainLines: false,
    sourceMaps: false,
  }).code
}
