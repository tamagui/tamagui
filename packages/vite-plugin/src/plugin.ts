import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import envPlugin from 'vite-plugin-environment'

/**
 * For some reason envPlugin doesnt work for vitest, but process: { env: {} } breaks vitest
 */

export function tamaguiPlugin(
  options: TamaguiOptions & {
    useReactNativeWebLite?: boolean
  }
): Plugin {
  const plugin: Plugin = {
    name: 'tamagui-base',
    enforce: 'pre',

    config(userConfig, env) {
      return {
        plugins: [
          //
          // envPlugin(['NODE_ENV', 'TAMAGUI_TARGET', 'ENABLE_RSC']),
          viteCommonjs(),
        ],
        esbuild: {
          loader: 'tsx',
        },
        define: {
          // reanimated support
          'global.__x': {},
          _frameTimestamp: undefined,
          _WORKLET: false,
          ...(process.env.NODE_ENV !== 'test' && {
            'process.env.TAMAGUI_TARGET': JSON.stringify(process.env.TAMAGUI_TARGET || 'web'),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || env.mode),
            'process.env.ENABLE_RSC': JSON.stringify(process.env.ENABLE_RSC || ''),
          }),
        },
        build: {
          commonjsOptions: {
            transformMixedEsModules: true,
          },
        },
        ssr: {
          // noExternal: /^(tamagui|react-native|expo-linear-gradient)$/,
          noExternal: /tamagui|react-native|expo-linear-gradient/,
        },
        optimizeDeps: {
          include: [
            'styleq',
            'inline-style-prefixer',
            'create-react-class',
            'copy-to-clipboard',
            'react-native-reanimated',
          ],
          esbuildOptions: {
            jsx: 'transform',
            plugins: [
              esbuildCommonjs([
                'styleq',
                'inline-style-prefixer',
                'create-react-class',
                'copy-to-clipboard',
              ]),
            ],
            resolveExtensions: [
              '.web.js',
              '.web.ts',
              '.web.tsx',
              '.js',
              '.jsx',
              '.json',
              '.ts',
              '.tsx',
              '.mjs',
            ],
            loader: {
              '.js': 'jsx',
            },
          },
        },
        resolve: {
          // for once it extracts
          // mainFields: ['module:jsx', 'module', 'jsnext:main', 'jsnext', 'main'],
          extensions: [
            '.web.js',
            '.web.ts',
            '.web.tsx',
            '.js',
            '.jsx',
            '.json',
            '.ts',
            '.tsx',
            '.mjs',
          ],
          alias: {
            'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
            'react-native/Libraries/Utilities/codegenNativeComponent': '@tamagui/proxy-worm',
            'react-native-svg': 'react-native-svg-web',
            'react-native': 'react-native-web',
            ...(options.useReactNativeWebLite && {
              'react-native': 'react-native-web-lite',
              'react-native-web': 'react-native-web-lite',
            }),
          },
        },
      }
    },
  }

  return plugin
}
