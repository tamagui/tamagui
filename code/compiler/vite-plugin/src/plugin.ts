import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import { transformWithEsbuild } from 'vite'

export function tamaguiPlugin(tamaguiOptionsIn: TamaguiOptions = {}): Plugin {
  let options: TamaguiOptions
  let Static
  let watcher
  let extensions: string[] = []
  let noExternalSSR: any = null

  async function load() {
    if (!Static) {
      Static = (await import('@tamagui/static')).default

      options = {
        ...tamaguiOptionsIn,
        ...Static.loadTamaguiBuildConfigSync(tamaguiOptionsIn),
      }

      watcher = options.disableWatchTamaguiConfig
        ? null
        : Static.watchTamaguiConfig({
            components: ['tamagui'],
            config: './src/tamagui.config.ts',
            ...options,
          }).catch((err) => {
            console.error(` [Tamagui] Error watching config: ${err}`)
          })

      const components = [
        ...new Set([...(options.components || []), 'tamagui', '@tamagui/core']),
      ]

      noExternalSSR = new RegExp(
        `${components.join('|')}|react-native|expo-linear-gradient`,
        'ig'
      )

      extensions = [
        `.${options.platform}.mjs`,
        `.${options.platform}.js`,
        `.${options.platform}.jsx`,
        `.${options.platform}.ts`,
        `.${options.platform}.tsx`,
        '.mjs',
        '.js',
        '.mts',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
      ]
    }
  }

  const plugin: Plugin = {
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

    // // fix expo-linear-gradient
    async transform(code, id) {
      if (!id.includes('expo-linear-gradient')) {
        return
      }
      // Use the exposed transform from vite, instead of directly
      // transforming with esbuild
      return transformWithEsbuild(code, id, {
        loader: 'jsx',
        jsx: 'automatic', // 👈 this is important
      })
    },

    async config(userConfig, env) {
      await load()

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
        optimizeDeps: {
          jsx: 'transform',
          include: options.platform === 'web' ? ['expo-linear-gradient'] : [],
          // disabled: false,
          esbuildOptions: {
            resolveExtensions: extensions,
            loader: {
              '.js': 'jsx',
            },
          },
        },
        ssr: {
          noExternal: noExternalSSR,
        },
        resolve: {
          extensions: extensions,
          alias: {
            ...(options.platform !== 'native' && {
              'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
              'react-native/Libraries/Utilities/codegenNativeComponent':
                '@tamagui/proxy-worm',
              'react-native-svg': '@tamagui/react-native-svg',
              'react-native': 'react-native-web',
              ...(options.useReactNativeWebLite && {
                'react-native': 'react-native-web-lite',
                'react-native-web': 'react-native-web-lite',
              }),
              ...(options.useReactNativeWebLite === 'without-animated' && {
                'react-native': 'react-native-web-lite/without-animated',
                'react-native-web': 'react-native-web-lite/without-animated',
              }),
            }),
          },
        },
      }
    },
  }

  return plugin
}
