import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, sep } from 'node:path'
// @ts-ignore why
import { Color, colorLog } from '@tamagui/cli-color'
import type { StaticConfig, TamaguiInternalConfig } from '@tamagui/web'
import esbuild from 'esbuild'
import * as FS from 'fs-extra'
import { readFile } from 'node:fs/promises'
import { registerRequire, setRequireResult } from '../registerRequire'
import type { TamaguiOptions } from '../types'
import { babelParse } from './babelParse'
import { esbuildLoaderConfig, esbundleTamaguiConfig } from './bundle'
import { getTamaguiConfigPathFromOptionsConfig } from './getTamaguiConfigPathFromOptionsConfig'

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

export const esbuildOptions = {
  target: 'es2018',
  format: 'cjs',
  jsx: 'automatic',
  platform: 'node',
  ...esbuildExtraOptions,
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
    const configOutPath = join(tmpDir, `tamagui.config.cjs`)
    const baseComponents = (props.components || []).filter((x) => x !== '@tamagui/core')
    const componentOutPaths = baseComponents.map((componentModule) =>
      join(
        tmpDir,
        `${componentModule
          .split(sep)
          .join('-')
          .replace(/[^a-z0-9]+/gi, '')}-components.config.cjs`
      )
    )

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.DEBUG?.startsWith('tamagui')
    ) {
      console.info(`Building config entry`, configEntry)
    }

    if (!props.disableInitialBuild) {
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
                target: 'node20',
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
              target: 'node20',
              ...esbuildExtraOptions,
            },
            props.platform || 'web'
          )
        }),
      ])

      colorLog(
        Color.FgYellow,
        `
    ➡ [tamagui] built config and components (${Date.now() - start}ms)`
      )

      if (process.env.DEBUG?.startsWith('tamagui')) {
        colorLog(
          Color.Dim,
          `
          Config     .${sep}${relative(process.cwd(), configOutPath)}
          Components ${[
            ...componentOutPaths.map((p) => `.${sep}${relative(process.cwd(), p)}`),
          ].join('\n             ')}
          `
        )
      }
    }

    let out
    const { unregister } = registerRequire(props.platform || 'web')
    try {
      if (hasBundledOnce) {
        // this did cause mini-css-extract plugin to freak out
        // clear cache to get new files
        for (const key in require.cache) {
          // avoid clearing core/web it seems to break things
          if (!/(core|web)[\/\\]dist/.test(key)) {
            delete require.cache[key]
          }
        }
      } else {
        hasBundledOnce = true
      }

      out = require(configOutPath)
    } catch (err) {
      // biome-ignore lint/complexity/noUselessCatch: <explanation>
      throw err
    } finally {
      unregister()
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

    if (props.outputCSS) {
      await writeTamaguiCSS(props.outputCSS, config)
    }

    let components = loadComponents({
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
    colorLog(Color.FgYellow, `    ➡ [tamagui] output css: ${outputCSS}`)
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

export function loadComponents(props: TamaguiOptions, forceExports = false) {
  const coreComponents = getCoreComponents(props)
  const otherComponents = loadComponentsInner(props, forceExports)
  return [...coreComponents, ...(otherComponents || [])]
}

function getCoreComponents(props: TamaguiOptions) {
  const loaded = loadComponentsInner({
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

export function loadComponentsInner(
  props: TamaguiOptions,
  forceExports = false
): null | LoadedComponents[] {
  const componentsModules = props.components || []

  const key = componentsModules.join('')

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
      const loadModule = isDynamic
        ? join(dirname(name), `.tamagui-dynamic-eval-${basename(name)}.tsx`)
        : name
      let writtenContents = fileContents
      let didBabel = false

      function attemptLoad({ forceExports = false } = {}) {
        // need to write to tsx to enable reading it properly (:/ esbuild-register)
        if (isDynamic) {
          writtenContents = forceExports
            ? transformAddExports(babelParse(esbuildit(fileContents, 'modern'), name))
            : fileContents

          FS.writeFileSync(loadModule, writtenContents)

          esbuild.buildSync({
            ...esbuildOptions,
            entryPoints: [loadModule],
            outfile: loadModule,
            alias: {
              'react-native': require.resolve('@tamagui/react-native-web-lite'),
            },
            bundle: true,
            packages: 'external',
            allowOverwrite: true,
            // logLevel: 'silent',
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
        isDynamic && FS.removeSync(loadModule)
      }

      try {
        const res = attemptLoad({
          forceExports: true,
        })
        didBabel = true
        return res
      } catch (err) {
        console.info('babel err', err, writtenContents)
        // ok
        writtenContents = fileContents
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`Error parsing babel likely`, err)
        }
      } finally {
        dispose()
      }

      try {
        return attemptLoad({
          forceExports: false,
        })
      } catch (err) {
        if (process.env.TAMAGUI_ENABLE_WARN_DYNAMIC_LOAD) {
          console.info(`

Tamagui attempted but failed to dynamically optimize components in:
  ${name}
`)
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
    ...esbuildOptions,
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
