import { readFileSync } from 'fs'
/* eslint-disable no-console */
import path, { basename, dirname, extname, join, resolve, sep } from 'path'

import generate from '@babel/generator'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { ResolvedOptions, UserOptions } from '@tamagui/cli/types/types'
import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import { createTamagui, getVariableValue } from '@tamagui/core-node'
import type {
  LoadedComponents,
  StaticConfigParsed,
  TamaguiInternalConfig,
  TamaguiProjectInfo,
} from '@tamagui/web'
import esbuild from 'esbuild'
import fs, {
  ensureDir,
  existsSync,
  pathExists,
  readJSON,
  removeSync,
  writeFileSync,
} from 'fs-extra'

import { SHOULD_DEBUG } from '../constants.js'
import { getNameToPaths, registerRequire, unregisterRequire } from '../require.js'
import { TamaguiOptions } from '../types.js'
import { babelParse } from './babelParse.js'
import { bundle } from './bundle.js'

type NameToPaths = {
  [key: string]: Set<string>
}

export type LoadedComponents = {
  moduleName: string
  nameToInfo: Record<
    string,
    {
      staticConfig: StaticConfigParsed
    }
  >
}

export type TamaguiProjectInfo = {
  components: LoadedComponents[]
  tamaguiConfig: TamaguiInternalConfig
  nameToPaths: NameToPaths
}

type Props = {
  components: string[]
  config?: string
  forceExports?: boolean
}

const external = [
  '@tamagui/core',
  '@tamagui/web',
  '@tamagui/core-node',
  'react',
  'react-dom',
  'react-native-svg',
]

const cache = {}

// TODO needs a plugin for webpack / vite to run this once at startup and not again until changed...

export async function loadTamagui(props: Props): Promise<TamaguiProjectInfo> {
  const key = JSON.stringify(props)
  if (cache[key]) {
    if (cache[key] instanceof Promise) {
      return await cache[key]
    }
    return cache[key]
  }

  let resolver: Function = () => {}
  cache[key] = new Promise((res) => {
    resolver = res
  })

  try {
    registerRequire()
    const bundleInfo = await bundleConfig(props)

    cache[key] = bundleInfo

    // init core-node
    createTamagui(cache[key].tamaguiConfig)

    resolver(cache[key])

    return cache[key]
  } finally {
    unregisterRequire()
  }
}

export function resolveWebOrNativeSpecificEntry(entry: string) {
  const workspaceRoot = resolve()
  const resolved = require.resolve(entry, { paths: [workspaceRoot] })
  const ext = extname(resolved)
  const fileName = basename(resolved).replace(ext, '')
  const specificExt = process.env.TAMAGUI_TARGET === 'web' ? 'web' : 'native'
  const specificFile = join(dirname(resolved), fileName + '.' + specificExt + ext)
  if (existsSync(specificFile)) {
    return specificFile
  }
  return entry
}

const esbuildOptions = {
  loader: 'tsx',
  target: 'es2018',
  format: 'cjs',
  jsx: 'transform',
  platform: 'node',
} as const

// loads in-process using esbuild-register
export function loadTamaguiSync(props: Props): TamaguiProjectInfo {
  const key = JSON.stringify(props)
  if (cache[key]) {
    return cache[key]
  }

  const { unregister } = require('esbuild-register/dist/node').register(esbuildOptions)

  try {
    registerRequire()

    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static'
    const devValueOG = globalThis['__DEV__' as any]
    globalThis['__DEV__' as any] = process.env.NODE_ENV === 'development'

    try {
      // config
      let tamaguiConfig: TamaguiInternalConfig | null = null
      if (props.config) {
        const configPath = join(process.cwd(), props.config)
        const exp = require(configPath)
        tamaguiConfig = (exp['default'] || exp) as TamaguiInternalConfig
        if (!tamaguiConfig || !tamaguiConfig.parsed) {
          const confPath = require.resolve(configPath)
          throw new Error(`Can't find valid config in ${confPath}:
          
  Be sure you "export default" the config.`)
        }
      }

      // components
      const components = loadComponents(props)
      if (!components) {
        throw new Error(`No components loaded`)
      }
      if (process.env.DEBUG === 'tamagui') {
        console.log(`components`, components)
      }

      // undo shims
      process.env.IS_STATIC = undefined
      globalThis['__DEV__' as any] = devValueOG

      // set up core-node
      if (props.config && tamaguiConfig) {
        createTamagui(tamaguiConfig as any)
      }

      cache[key] = {
        components,
        tamaguiConfig,
        nameToPaths: getNameToPaths(),
      }
    } catch (err) {
      if (err instanceof Error) {
        console.warn(
          `Error loading tamagui.config.ts (set DEBUG=tamagui to see full stack), running tamagui without custom config`
        )
        console.log(`\n\n    ${err.message}\n\n`)
        if (SHOULD_DEBUG) {
          console.log(err.stack)
        }
      } else {
        console.error(`Error loading tamagui.config.ts`, err)
      }
      return {
        components: [],
        tamaguiConfig: getDefaultTamaguiConfig(),
        nameToPaths: {},
      }
    }

    return cache[key]
  } finally {
    unregister()
    unregisterRequire()
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

const esbuildit = (src: string, target?: 'modern') => {
  return esbuild.transformSync(src, {
    ...esbuildOptions,
    ...(target === 'modern' && {
      target: 'es2022',
      jsx: 'transform',
      loader: 'tsx',
      platform: 'neutral',
      format: 'esm',
    }),
  }).code
}

function loadComponents(props: Props): null | LoadedComponents[] {
  const componentsModules = props.components
  const key = componentsModules.join('')
  if (cacheComponents[key]) {
    return cacheComponents[key]
  }
  try {
    const info: LoadedComponents[] = componentsModules.flatMap((name) => {
      const extension = extname(name)
      const isLocal = Boolean(extension)
      // during props.config pass we are passing in pre-bundled stuff
      const isDynamic = isLocal && !props.config

      if (isDynamic && !process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD) {
        return []
      }

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
            ? esbuildit(
                transformAddExports(babelParse(esbuildit(fileContents, 'modern')))
              )
            : esbuildit(fileContents)

          writeFileSync(loadModule, writtenContents)
        }

        if (process.env.DEBUG === 'tamagui') {
          console.log(`loadModule`, loadModule, require.resolve(loadModule))
        }

        return {
          moduleName: name,
          nameToInfo: getComponentStaticConfigByName(
            name,
            interopDefaultExport(require(loadModule))
          ),
        }
      }

      const dispose = () => {
        isDynamic && removeSync(loadModule)
      }

      try {
        const res = attemptLoad({
          forceExports: true,
        })
        didBabel = true
        return res
      } catch (err) {
        console.log('babel err', err, writtenContents)
        // ok
        writtenContents = fileContents
        if (process.env.DEBUG?.startsWith('tamagui')) {
          console.log(`Error parsing babel likely`, err)
        }
      } finally {
        dispose()
      }

      try {
        return attemptLoad({
          forceExports: false,
        })
      } catch (err) {
        if (!process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD) {
          console.log(`

Tamagui attempted but failed to dynamically load components in:
  ${name}

This will leave some styled() tags unoptimized.
Disable this file (or dynamic loading altogether):

  disableExtractFoundComponents: ['${name}'] | true

Quiet this warning with environment variable:
      
  TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1

`)
          console.log(err)
          console.log(
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
    console.log(`Tamagui error bundling components`, err.message, err.stack)
    return null
  }
}

function getComponentStaticConfigByName(name: string, exported: any) {
  const components: Record<string, { staticConfig: StaticConfigParsed }> = {}
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
    if (process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD !== '1') {
      console.error(
        `Tamagui failed getting from ${name} (Disable error by setting environment variable TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1)`
      )
      console.error(err)
    }
  }
  return components
}

function getTamaguiComponent(
  name: string,
  Component: any
): undefined | { staticConfig: StaticConfigParsed } {
  if (name[0].toUpperCase() !== name[0]) {
    return
  }
  const staticConfig = Component?.staticConfig as StaticConfigParsed | undefined
  if (staticConfig) {
    return Component
  }
}

async function bundleConfig(props: Props) {
  const configEntry = props.config ? join(process.cwd(), props.config) : ''
  const tmpDir = join(process.cwd(), '.tamagui')
  const configOutPath = join(tmpDir, `tamagui.config.cjs`)
  const baseComponents = props.components.filter((x) => x !== '@tamagui/core')
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
    console.log(`Building config entry`, configEntry)
  }

  // build them to node-compat versions
  try {
    await ensureDir(tmpDir)
  } catch {
    //
  }

  //   colorLog(
  //     Color.FgYellow,
  //     `
  // Tamagui built config and components:`
  //   )
  //   colorLog(
  //     Color.Dim,
  //     `
  //   Config     .${sep}${relative(process.cwd(), configOutPath)}
  //   Components ${[
  //     ...componentOutPaths.map((p) => `.${sep}${relative(process.cwd(), p)}`),
  //   ].join('\n             ')}
  // `
  //   )

  await Promise.all([
    props.config
      ? bundle({
          entryPoints: [configEntry],
          external,
          outfile: configOutPath,
        })
      : null,
    ...baseComponents.map((componentModule, i) => {
      return bundle({
        entryPoints: [componentModule],
        resolvePlatformSpecificEntries: true,
        external,
        outfile: componentOutPaths[i],
      })
    }),
  ])

  // get around node.js's module cache to get the new config...
  delete require.cache[path.resolve(configOutPath)]
  const out = require(configOutPath)
  const config = out.default || out
  console.log(`got config from ${configOutPath}...`, config.media)
  if (!config) {
    throw new Error(`No config: ${config}`)
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
    component.moduleName = baseComponents[componentOutPaths.indexOf(component.moduleName)]

    // if (!component.moduleName) {
    //   throw new Error(`Tamagui internal err`)
    // }
  }

  // always load core so we can optimize if directly importing
  const coreComponents = loadComponents({
    ...props,
    components: ['@tamagui/core-node'],
  })
  if (coreComponents) {
    coreComponents[0].moduleName = '@tamagui/core'
    components = [...components, ...coreComponents]
  }

  if (
    process.env.NODE_ENV === 'development' &&
    process.env.DEBUG?.startsWith('tamagui')
  ) {
    console.log('Loaded components', components)
  }
  return {
    components,
    nameToPaths: {},
    tamaguiConfig: config,
  }
}

async function getTamaguiConfig(options: ResolvedOptions) {
  return bundleConfig(options.tamaguiOptions)
}

export async function generateTamaguiConfig(options: ResolvedOptions) {
  await ensureDir(options.paths.dotDir)
  const config = await getTamaguiConfig(options)
  const { components, nameToPaths } = config
  const { themes, tokens } = config.tamaguiConfig
  console.log(config.tamaguiConfig.media)

  // reduce down to usable, smaller json

  // slim themes, add name
  for (const key in themes) {
    const theme = themes[key]
    // @ts-ignore
    theme.id = key
    for (const tkey in theme) {
      theme[tkey] = getVariableValue(theme[tkey])
    }
  }

  // flatten variables
  for (const key in tokens) {
    const token = tokens[key]
    for (const tkey in token) {
      token[tkey] = getVariableValue(token[tkey])
    }
  }

  // remove bulky stuff in components
  for (const component of components) {
    for (const _ in component.nameToInfo) {
      delete component.nameToInfo[_].staticConfig['validStyles']
      delete component.nameToInfo[_].staticConfig['parentStaticConfig']
    }
  }

  // set to array
  for (const key in nameToPaths) {
    // @ts-ignore
    nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const { fontsParsed, getCSS, tokensParsed, themeConfig, ...cleanedConfig } =
    config.tamaguiConfig

  await fs.writeJSON(
    options.paths.conf,
    {
      ...config,
      tamaguiConfig: cleanedConfig,
    },
    {
      spaces: 2,
    }
  )
}

const defaultPaths = ['tamagui.config.ts', join('src', 'tamagui.config.ts')]
let cachedPath = ''
async function getDefaultTamaguiConfigPath() {
  if (cachedPath) return cachedPath
  const existingPaths = await Promise.all(defaultPaths.map((path) => pathExists(path)))
  const existing = existingPaths.findIndex((x) => !!x)
  const found = defaultPaths[existing]
  if (!found) {
    throw new Error(`No found tamagui.config.ts`)
  }
  cachedPath = found
  return found
}

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  tamaguiOptions,
  host,
  debug,
}: Partial<UserOptions> = {}): Promise<ResolvedOptions> {
  const tsConfigFilePath = join(root, tsconfigPath)
  if (!(await fs.pathExists(tsConfigFilePath)))
    throw new Error(`No tsconfig found: ${tsConfigFilePath}`)
  const dotDir = join(root, '.tamagui')
  const pkgJson = await readJSON(join(root, 'package.json'))

  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    root,
    host: host || '127.0.0.1',
    pkgJson,
    debug,
    tsconfigPath,
    tamaguiOptions: {
      components: ['tamagui'],
      config: await getDefaultTamaguiConfigPath(),
      ...tamaguiOptions,
    },
    paths: {
      dotDir,
      conf: join(dotDir, 'tamagui.config.json'),
      types: join(dotDir, 'types.json'),
    },
  }
}

export async function watchTamaguiConfig(tamaguiOptions: TamaguiOptions) {
  const options = await getOptions({ tamaguiOptions })

  if (!options.tamaguiOptions.config) return

  await generateTamaguiConfig(options)
  const context = await esbuild.context({
    entryPoints: [options.tamaguiOptions.config],
    sourcemap: false,
    // dont output just use esbuild as a watcher
    write: false,

    plugins: [
      {
        name: `on-rebuild`,
        setup({ onEnd }) {
          onEnd((res) => {
            generateTamaguiConfig(options)
          })
        },
      },
    ],
  })

  await context.watch()
}
