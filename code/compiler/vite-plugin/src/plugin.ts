import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import { transformWithEsbuild } from 'vite'
import { tamaguiOptions, Static, loadTamaguiBuildConfig } from './loadTamagui'

export function tamaguiPlugin(tamaguiOptionsIn: TamaguiOptions = {}): Plugin {
  let watcher

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

  return {
    name: 'tamagui-base',
    enforce: 'pre',

    async load() {
      await load()
    },

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
              'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
              'react-native/Libraries/Utilities/codegenNativeComponent':
                '@tamagui/proxy-worm',
              'react-native-svg': '@tamagui/react-native-svg',
              'react-native': 'react-native-web',
              ...(tamaguiOptions.useReactNativeWebLite && {
                'react-native': 'react-native-web-lite',
                'react-native-web': 'react-native-web-lite',
              }),
              ...(tamaguiOptions.useReactNativeWebLite === 'without-animated' && {
                'react-native': 'react-native-web-lite/without-animated',
                'react-native-web': 'react-native-web-lite/without-animated',
              }),
            }),
          },
        },
      }
    },
  } satisfies Plugin
}
