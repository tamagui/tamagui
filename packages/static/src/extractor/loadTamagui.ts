/* eslint-disable no-console */
import { join, sep } from 'path'

import { getDefaultTamaguiConfig } from '@tamagui/config-default-node'
import type { StaticConfig, TamaguiComponent, TamaguiInternalConfig } from '@tamagui/core-node'
import { createTamagui } from '@tamagui/core-node'
import esbuild from 'esbuild'
import { remove } from 'fs-extra'

import { SHOULD_DEBUG } from '../constants'
import { getNameToPaths, registerRequire, unregisterRequire } from '../require'

type NameToPaths = {
  [key: string]: Set<string>
}

export type TamaguiProjectInfo = {
  components: Record<string, TamaguiComponent>
  tamaguiConfig: TamaguiInternalConfig
  nameToPaths: NameToPaths
}

type Props = { components: string[]; config?: string }

const cache = {}

// TODO stat dirs to determine re-build or just clear after debounce

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
  const includesCore = props.components.includes('@tamagui/core')
  const baseComponents = props.components.filter((x) => x !== '@tamagui/core')
  const componentOutPaths = baseComponents.map((componentModule) =>
    join(tmpDir, `${componentModule.split(sep).join('-')}-components.config.js`)
  )

  const outPaths = [configOutPath, ...componentOutPaths]
  await Promise.all(outPaths.map((p) => remove(p)))

  const external = ['@tamagui/core', '@tamagui/core-node', 'react', 'react-dom']

  // build them to node-compat versions
  await Promise.all([
    props.config
      ? buildTamaguiConfig({
          entryPoints: [join(process.cwd(), props.config)],
          external,
          outfile: configOutPath,
        })
      : null,
    ...baseComponents.map((componentModule, i) => {
      return buildTamaguiConfig({
        entryPoints: [componentModule],
        external,
        outfile: componentOutPaths[i],
      })
    }),
  ])

  const coreNode = require('@tamagui/core-node')

  registerRequire()
  const config = require(configOutPath).default
  unregisterRequire()

  const components = {
    ...loadComponents(componentOutPaths),
    ...(includesCore && gatherTamaguiComponentInfo([coreNode])),
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

async function buildTamaguiConfig(
  options: Partial<esbuild.BuildOptions>,
  aliases?: Record<string, string>
) {
  const alias = require('@tamagui/core-node').aliasPlugin
  return esbuild.build({
    bundle: true,
    ...options,
    format: 'cjs',
    target: 'node18',
    keepNames: true,
    platform: 'node',
    loader: {
      '.js': 'jsx',
    },
    allowOverwrite: true,
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

          build.onResolve({ filter: /^(react-native)$/ }, (args) => {
            return {
              path: 'react-native-web-lite',
              external: true,
            }
          })
        },
      },
      alias({
        'react-native-safe-area-context': require.resolve('@tamagui/fake-react-native'),
        'react-native-gesture-handler': require.resolve('@tamagui/proxy-worm'),
        ...aliases,
      }),
    ],
  })
}

// loads in-process using esbuild-register
export function loadTamaguiSync(props: Props): TamaguiProjectInfo {
  const key = JSON.stringify(props)
  if (cache[key]) {
    return cache[key]
  }

  const { unregister } = require('esbuild-register/dist/node').register({
    target: 'es2019',
    format: 'cjs',
  })

  try {
    registerRequire()

    // lets shim require and avoid importing react-native + react-native-web
    // we just need to read the config around them
    process.env.IS_STATIC = 'is_static'
    // @ts-ignore
    if (typeof globalThis['__DEV__'] === 'undefined') {
      // @ts-ignore
      globalThis['__DEV__'] = process.env.NODE_ENV === 'development'
    }

    try {
      // import config
      let tamaguiConfig: TamaguiInternalConfig | null = null

      if (props.config) {
        const configPath = join(process.cwd(), props.config)
        const exp = require(configPath)
        tamaguiConfig = (exp['default'] || exp) as TamaguiInternalConfig
        if (!tamaguiConfig || !tamaguiConfig.parsed) {
          const confPath = require.resolve(configPath)
          throw new Error(`Can't find valid config in ${confPath}`)
        }
      }

      const components = loadComponents(props.components)

      // undo shims
      process.env.IS_STATIC = undefined

      // set up core-node
      if (tamaguiConfig) {
        createTamagui(tamaguiConfig)
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
        components: {},
        tamaguiConfig: getDefaultTamaguiConfig(),
        nameToPaths: {},
      }
    }

    return cache[key]
  } catch (err) {
    console.log('Error loading Tamagui', err)
    throw err
  } finally {
    unregister()
    unregisterRequire()
  }
}

function interopDefaultExport(mod: any) {
  return mod?.default ?? mod
}

function loadComponents(componentsModules: string[]) {
  const requiredModules = componentsModules.map((name) => interopDefaultExport(require(name)))
  return gatherTamaguiComponentInfo(requiredModules)
}

function gatherTamaguiComponentInfo(packages: any[]) {
  const components = {}
  for (const exported of packages) {
    try {
      for (const componentName in exported) {
        const found = getTamaguiComponent(componentName, exported[componentName])
        if (found) {
          // remove non-stringifyable
          const { Component, reactNativeWebComponent, ...sc } = found.staticConfig
          Object.assign(components, { [componentName]: { staticConfig: sc } })
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
