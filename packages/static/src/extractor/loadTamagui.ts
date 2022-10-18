import { readFileSync } from 'fs'
/* eslint-disable no-console */
import { basename, dirname, extname, join, relative, sep } from 'path'

import { Color, colorLog } from '@tamagui/cli-color'
import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import type { StaticConfigParsed, TamaguiInternalConfig } from '@tamagui/core-node'
import { createTamagui } from '@tamagui/core-node'
import esbuild from 'esbuild'
import {
  ensureDir,
  existsSync,
  pathExists,
  remove,
  removeSync,
  stat,
  writeFile,
  writeFileSync,
} from 'fs-extra'

import { SHOULD_DEBUG } from '../constants.js'
import { getNameToPaths, registerRequire, unregisterRequire } from '../require.js'

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
  bubbleErrors?: boolean
}

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

  const tmpDir = join(process.cwd(), 'dist', 'tamagui-node')
  const configOutPath = join(tmpDir, `tamagui.config.js`)
  const baseComponents = props.components.filter((x) => x !== '@tamagui/core')
  const componentOutPaths = baseComponents.map((componentModule) =>
    join(
      tmpDir,
      `${componentModule
        .split(sep)
        .join('-')
        .replace(/[^a-z0-9]+/gi, '')}-components.config.js`
    )
  )

  const external = ['@tamagui/core', '@tamagui/core-node', 'react', 'react-dom']
  const configEntry = props.config ? join(process.cwd(), props.config) : ''

  if (process.env.NODE_ENV === 'development' && process.env.DEBUG?.startsWith('tamagui')) {
    console.log(`Building config entry`, configEntry)
  }

  // build them to node-compat versions
  try {
    await ensureDir(tmpDir)
  } catch {
    //
  }

  colorLog(
    Color.FgYellow,
    `
Tamagui built config and components:`
  )
  colorLog(
    Color.Dim,
    `
  - Config: .${sep}${relative(process.cwd(), configOutPath)}
  - Components: .${sep}${relative(process.cwd(), componentOutPaths.join(', '))}
`
  )

  await Promise.all([
    props.config
      ? bundle(props, {
          entryPoints: [configEntry],
          external,
          outfile: configOutPath,
        })
      : null,
    ...baseComponents.map((componentModule, i) => {
      return bundle(props, {
        entryPoints: [componentModule],
        resolvePlatformSpecificEntries: true,
        external,
        outfile: componentOutPaths[i],
      })
    }),
  ])

  registerRequire(props.bubbleErrors)
  const out = require(configOutPath)
  const config = out.default || out
  unregisterRequire()

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
    if (!component.moduleName) {
      throw new Error(`Tamagui internal err`)
    }
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

  if (process.env.NODE_ENV === 'development' && process.env.DEBUG?.startsWith('tamagui')) {
    console.log('Loaded components', components)
  }

  cache[key] = {
    components,
    nameToPaths: {},
    tamaguiConfig: config,
  }

  // init core-node
  createTamagui(cache[key].tamaguiConfig)

  resolver(cache[key])

  return cache[key]
}

function resolveWebOrNativeSpecificEntry(entry: string) {
  const resolved = require.resolve(entry)
  const ext = extname(resolved)
  const fileName = basename(resolved).replace(ext, '')
  const specificExt = process.env.TAMAGUI_TARGET === 'web' ? 'web' : 'native'
  const specificFile = join(dirname(resolved), fileName + '.' + specificExt + ext)
  if (existsSync(specificFile)) {
    return specificFile
  }
  return entry
}

async function bundle(
  props: Props,
  {
    entryPoints,
    resolvePlatformSpecificEntries,
    ...options
  }: Omit<Partial<esbuild.BuildOptions>, 'entryPoints'> & {
    outfile: string
    entryPoints: string[]
    resolvePlatformSpecificEntries?: boolean
  },
  aliases?: Record<string, string>
) {
  const alias = require('@tamagui/core-node').aliasPlugin
  // until i do fancier things w plugins:
  const lockFile = join(dirname(options.outfile), basename(options.outfile, '.lock'))
  const lockStat = await stat(lockFile).catch(() => {
    // ok
  })
  const lockedMsAgo = !lockStat
    ? Infinity
    : new Date().getTime() - new Date(lockStat.mtime).getTime()
  if (lockedMsAgo < 500) {
    if (process.env.DEBUG?.startsWith('tamagui')) {
      console.log(`Waiting for existing build`, entryPoints)
    }
    let tries = 5
    while (tries--) {
      if (await pathExists(options.outfile)) {
        return
      } else {
        await new Promise((res) => setTimeout(res, 50))
      }
    }
  }

  void writeFile(lockFile, '')

  if (process.env.DEBUG?.startsWith('tamagui')) {
    console.log(`Building`, entryPoints)
  }

  const tsconfig = join(__dirname, '..', '..', 'tamagui.tsconfig.json')

  const resolvedEntryPoints = !resolvePlatformSpecificEntries
    ? entryPoints
    : entryPoints.map(resolveWebOrNativeSpecificEntry)

  return esbuild.build({
    bundle: true,
    ...options,
    entryPoints: resolvedEntryPoints,
    format: 'cjs',
    target: 'node18',
    jsx: 'transform',
    jsxFactory: 'react',
    allowOverwrite: true,
    keepNames: true,
    platform: 'node',
    tsconfig,
    loader: {
      '.js': 'jsx',
    },
    logLevel: 'warning',
    plugins: [
      {
        name: 'external',
        setup(build) {
          build.onResolve({ filter: /@tamagui\/core/ }, (args) => {
            return {
              path: '@tamagui/core-node',
              external: true,
            }
          })

          build.onResolve({ filter: /^(react-native|react-native\/.*)$/ }, (args) => {
            return {
              path: 'react-native-web-lite',
              external: true,
            }
          })
        },
      },
      alias({
        'react-native-svg': require.resolve('@tamagui/react-native-svg'),
        'react-native-safe-area-context': require.resolve('@tamagui/fake-react-native'),
        'react-native-gesture-handler': require.resolve('@tamagui/proxy-worm'),
        'react-native-reanimated': require.resolve('@tamagui/proxy-worm'),
        ...aliases,
      }),
    ],
  })
}

const esbuildOptions: esbuild.BuildOptions = {
  target: 'es2019',
  format: 'cjs',
  jsx: 'transform',
}

// loads in-process using esbuild-register
export function loadTamaguiSync(props: Props): TamaguiProjectInfo {
  const key = JSON.stringify(props)
  if (cache[key]) {
    return cache[key]
  }

  const { unregister } = require('esbuild-register/dist/node').register(esbuildOptions)

  try {
    registerRequire(props.bubbleErrors)

    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static'
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
      delete globalThis['__DEV__' as any]

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
      if (props.bubbleErrors) {
        throw err
      }

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
  } catch (err) {
    if (!props.bubbleErrors) {
      console.log('Error loading Tamagui', err)
    }
    throw err
  } finally {
    unregister()
    unregisterRequire()
  }
}

function interopDefaultExport(mod: any) {
  return mod?.default ?? mod
}

const cacheComponents: Record<string, LoadedComponents[]> = {}

function loadComponents(props: Props): null | LoadedComponents[] {
  const componentsModules = props.components
  const key = componentsModules.join('')
  if (cacheComponents[key]) {
    return cacheComponents[key]
  }
  try {
    const info: LoadedComponents[] = componentsModules.flatMap((name) => {
      const extension = extname(name)
      const isLocal = extension.includes('.')
      const fileContents = isLocal ? readFileSync(name, 'utf-8') : ''
      const localTmpFile = join(dirname(name), `.tamagui-dynamic-eval${extension || '.tsx'}`)

      function attemptLoad({ forceExports = false } = {}) {
        const shouldWriteTmpFile = isLocal && forceExports

        // need to write to tsx to enable reading it properly (:/ esbuild-register)
        if (shouldWriteTmpFile) {
          // could babel but this works alright
          const tmpFile = forceExports
            ? fileContents
                .split('\n')
                .map((l) => l.replace(/^(const|let)(\s[a-z]+)/gi, 'export $1$2'))
                .join('\n')
            : fileContents

          if (process.env.DEBUG?.startsWith('tamagui')) {
            console.log('temp file to read all exports', tmpFile)
          }
          // make everything export
          writeFileSync(localTmpFile, tmpFile)
        }

        return {
          moduleName: name,
          nameToInfo: getComponentStaticConfigByName(
            name,
            interopDefaultExport(require(shouldWriteTmpFile ? localTmpFile : name))
          ),
        }
      }

      try {
        return attemptLoad({
          forceExports: true,
        })
      } catch {
        // ok
      }
      try {
        return attemptLoad({
          forceExports: false,
        })
      } catch (err) {
        if (!process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD) {
          console.log(`

⚠️ Tamagui attempted but failed to dynamically load components in "${name}".
This is ok, it just won't completely optimize this file, but it will still
optimize others, and the rest will work fine by generating at runtime.
    
  You can quiet this warning most of the time with the environment variable:
      
  TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD=1

  Or just disable it for this component in your compiler settings:

    disableExtractFoundComponents: ['${name}'] | true

`)
          console.log(err)
        }
        return []
      } finally {
        if (isLocal) {
          removeSync(localTmpFile)
        }
      }
    })
    cacheComponents[key] = info
    return info
  } catch (err: any) {
    if (props.bubbleErrors) {
      throw err
    }
    console.log(`Tamagui error bundling components`, err.message, err.stack)
    return null
  }
}

function getComponentStaticConfigByName(name: string, exported: any) {
  if (!exported || typeof exported !== 'object' || Array.isArray(exported)) {
    throw new Error(`Invalid export from package ${name}: ${typeof exported}`)
  }
  const components: Record<string, { staticConfig: StaticConfigParsed }> = {}
  try {
    for (const key in exported) {
      const found = getTamaguiComponent(key, exported[key])
      if (found) {
        // remove non-stringifyable
        const { Component, reactNativeWebComponent, ...sc } = found.staticConfig
        components[key] = { staticConfig: sc }
      }
    }
  } catch (err) {
    console.error(`Tamagui failed getting components`)
    if (err instanceof Error) {
      console.error(err.message, err.stack)
    } else {
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
