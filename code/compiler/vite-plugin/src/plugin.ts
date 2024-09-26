import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import { transformWithEsbuild } from 'vite'
import { tamaguiOptions, Static, loadTamaguiBuildConfig } from './loadTamagui'
import { tamaguiExtractPlugin } from './extract'

export function tamaguiPlugin(
  tamaguiOptionsIn: TamaguiOptions & { optimize?: boolean } = {}
): Plugin | Plugin[] {
  const shouldAddCompiler = !!tamaguiOptionsIn?.optimize
  let watcher
  let loaded = false

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

  let noExternalSSR = /react-native|expo-linear-gradient/gi

  async function load() {
    if (loaded) return
    loaded = true

    await loadTamaguiBuildConfig(tamaguiOptionsIn)

    if (tamaguiOptions!.disableWatchTamaguiConfig) {
      return
    }

    if (!Static) {
      throw new Error(`Not loaded`)
    }

    watcher = Static.watchTamaguiConfig({
      components: ['tamagui'],
      config: './src/tamagui.config.ts',
      ...tamaguiOptions,
    }).catch((err) => {
      console.error(` [Tamagui] Error watching config: ${err}`)
    })

    const components = [
      ...new Set([...(tamaguiOptions!.components || []), 'tamagui', '@tamagui/core']),
    ]

    noExternalSSR = new RegExp(
      `${components.join('|')}|react-native|expo-linear-gradient`,
      'ig'
    )
  }

  const compatPlugins = [
    {
      name: 'tamagui-base',
      enforce: 'pre',

      async buildEnd() {
        await watcher?.then((res) => {
          res?.dispose()
        })
      },

      async transform(code, id) {
        if (id.includes('expo-linear-gradient')) {
          // fix expo-linear-gradient
          return transformWithEsbuild(code, id, {
            loader: 'jsx',
            jsx: 'automatic', // 👈
          })
        }
      },

      async config(_, env) {
        await load()

        if (!tamaguiOptions) {
          throw new Error(`No options loaded`)
        }

        return {
          environments: {
            client: {
              define: {
                'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(true),
              },
            },
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
          ssr: {
            noExternal: noExternalSSR,
          },
          resolve: {
            extensions: extensions,
            alias: {
              ...(tamaguiOptions.platform !== 'native' && {
                'react-native/Libraries/Renderer/shims/ReactFabric':
                  '@tamagui/proxy-worm',
                'react-native/Libraries/Utilities/codegenNativeComponent':
                  '@tamagui/proxy-worm',
                'react-native-svg': '@tamagui/react-native-svg',
                'react-native': 'react-native-web',
              }),
            },
          },
        }
      },
    },
    {
      name: 'tamagui-rnw-lite',
      config() {
        if (tamaguiOptions?.useReactNativeWebLite) {
          return {
            resolve: {
              alias: [
                {
                  find: /^react-native$/,
                  replacement: 'react-native-web-lite',
                },
                {
                  find: /^react-native\/(.*)$/,
                  replacement: 'react-native-web-lite',
                },
                {
                  find: /^react-native-web$/,
                  replacement: 'react-native-web-lite',
                },
                {
                  find: /^react-native-web\/(.*)$/,
                  replacement: 'react-native-web-lite',
                },
              ],
            },
          }
        }
      },
    },
  ] satisfies Plugin[]

  if (shouldAddCompiler) {
    return [...compatPlugins, tamaguiExtractPlugin(tamaguiOptionsIn)]
  }

  return [...compatPlugins]
}
