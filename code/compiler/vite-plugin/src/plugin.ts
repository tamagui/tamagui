import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import { transformWithEsbuild } from 'vite'
import { tamaguiExtractPlugin } from './extract'
import { Static, loadTamaguiBuildConfig, tamaguiOptions } from './loadTamagui'

const resolve = (name: string) => import.meta.resolve?.(name).replace('file://', '')

export function tamaguiPlugin({
  optimize,
  disableResolveConfig,
  ...tamaguiOptionsIn
}: TamaguiOptions & { optimize?: boolean; disableResolveConfig?: boolean } = {}):
  | Plugin
  | Plugin[] {
  const shouldAddCompiler = !!optimize
  let watcher
  let loaded = false

  // TODO temporary fix
  const enableNativeEnv = !!globalThis.__vxrnEnableNativeEnv

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
  }

  const compatPlugins = [
    {
      name: 'tamagui-base-web-only',
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
                'process.env.TAMAGUI_ENVIRONMENT': '"client"',
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
          resolve:
            disableResolveConfig || enableNativeEnv
              ? {}
              : {
                  extensions,
                  alias: {
                    ...(tamaguiOptions.platform !== 'native' && {
                      'react-native/Libraries/Renderer/shims/ReactFabric':
                        resolve('@tamagui/proxy-worm'),
                      'react-native/Libraries/Utilities/codegenNativeComponent':
                        resolve('@tamagui/proxy-worm'),
                      'react-native-svg': resolve('@tamagui/react-native-svg'),
                      ...(!tamaguiOptions?.useReactNativeWebLite && {
                        'react-native': resolve('react-native-web'),
                      }),
                    }),
                  },
                },
        }
      },
    },

    {
      name: 'tamagui-rnw-lite-web-only',

      // enforce: 'pre',

      // resolveId(source) {
      //   const envName = this['environment']?.name as any // vite 5 + 6 compat
      //   if (isVite6 && envName !== 'client' && envName !== 'ssr') {
      //     return
      //   }

      //   if (source === 'react-native-svg') {
      //     return '@tamagui/react-native-svg'
      //   }

      //   console.log('cmon', source)

      //   if (tamaguiOptions?.useReactNativeWebLite) {
      //     if (/^react-native$/.test(source)) {
      //       return 'react-native-web'
      //     }
      //   } else {
      //     if (/^react-native$/.test(source)) {
      //       return '@tamagui/react-native-web-lite'
      //     }
      //   }
      // },

      config() {
        if (tamaguiOptions?.useReactNativeWebLite) {
          const rnwl = resolve(
            tamaguiOptions?.useReactNativeWebLite === 'without-animated'
              ? '@tamagui/react-native-web-lite/without-animated'
              : '@tamagui/react-native-web-lite'
          )
          const rnwlSS = resolve(
            '@tamagui/react-native-web-lite/dist/exports/StyleSheet/compiler/createReactDOMStyle'
          )

          return {
            resolve: {
              alias: [
                // fix reanimated issue not finding this
                {
                  find: /react-native.*\/dist\/exports\/StyleSheet\/compiler\/createReactDOMStyle/,
                  replacement: rnwlSS,
                },
                {
                  find: /^react-native$/,
                  replacement: rnwl,
                },
                {
                  find: /^react-native\/(.*)$/,
                  replacement: rnwl,
                },
                {
                  find: /^react-native-web$/,
                  replacement: rnwl,
                },
                {
                  find: /^react-native-web\/(.*)$/,
                  replacement: rnwl,
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
