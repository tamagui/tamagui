import type { TamaguiOptions } from '@tamagui/static'
import { version } from 'vite'
import type { Plugin, UserConfig } from 'vite'
import { transformWithEsbuild } from 'vite'
import { tamaguiExtractPlugin } from './extract'
import { Static, loadTamaguiBuildConfig, tamaguiOptions } from './loadTamagui'

const isVite6 = version.startsWith('6.')
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

      resolveId(id) {
        if (disableResolveConfig || enableNativeEnv) {
          return
        }
        if (!tamaguiOptions) {
          throw new Error(`No options loaded`)
        }
        if (tamaguiOptions.platform !== 'native') {
          return
        }
        if (
          id === 'react-native/Libraries/Renderer/shims/ReactFabric' ||
          id === 'react-native/Libraries/Utilities/codegenNativeComponent'
        ) {
          return resolve('@tamagui/proxy-worm')
        }
        if (!tamaguiOptions?.useReactNativeWebLite) {
          if (id === 'react-native') {
            return resolve('react-native-web')
          }
        }
      },

      async config(_, env) {
        await load()

        if (!tamaguiOptions) {
          throw new Error(`No options loaded`)
        }

        const reactNativeResolve: UserConfig['resolve'] =
          disableResolveConfig || enableNativeEnv
            ? {}
            : {
                extensions: [
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
                ],
              }

        const serverAndClientDefine: UserConfig['define'] = {
          // reanimated support
          _frameTimestamp: undefined,
          _WORKLET: false,
          __DEV__: `${env.mode === 'development'}`,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || env.mode),
          'process.env.IS_STATIC': JSON.stringify(false),
          ...(env.mode === 'production' && {
            'process.env.TAMAGUI_OPTIMIZE_THEMES': JSON.stringify(true),
          }),
        }

        if (isVite6) {
          return {
            resolve: reactNativeResolve,
            environments: {
              client: {
                define: {
                  'process.env.TAMAGUI_IS_CLIENT': JSON.stringify(true),
                  ...serverAndClientDefine,
                },
              },

              ssr: {
                define: serverAndClientDefine,
              },
            },
            // vite 5 + 6 compat
          } as any
        }

        return {
          define: serverAndClientDefine,
          resolve: reactNativeResolve,

          ssr: {
            optimizeDeps: {
              include: [
                'tamagui',
                '@tamagui/core',
                '@tamagui/web',
                '@react-native/normalize-color',
                'react',
                'react/jsx-runtime',
              ],
            },
          },
        }
      },
    },

    {
      name: 'tamagui-rnw-lite',

      resolveId(id) {
        const envName = this['environment']?.name as any // vite 5 + 6 compat

        if (isVite6 && (envName === 'client' || envName === 'ssr')) {
          return
        }

        if (tamaguiOptions?.useReactNativeWebLite) {
          if (
            /react-native.*\/dist\/exports\/StyleSheet\/compiler\/createReactDOMStyle/.test(
              id
            )
          ) {
            return resolve(
              '@tamagui/react-native-web-lite/dist/exports/StyleSheet/compiler/createReactDOMStyle'
            )
          }

          if (
            /^react-native$/.test(id) ||
            /^react-native\/(.*)$/.test(id) ||
            /^react-native-web$/.test(id) ||
            /^react-native-web\/(.*)$/.test(id)
          ) {
            return resolve('@tamagui/react-native-web-lite')
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
