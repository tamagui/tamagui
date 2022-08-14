import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import envPlugin from 'vite-plugin-environment'

import { tamaguiExtractPlugin } from './extractPlugin'

/**
 * For some reason envPlugin doesnt work for vitest, but process: { env: {} } breaks vitest
 */

export function tamaguiPlugin(options: TamaguiOptions): Plugin {
  const disableStatic = options.disable || (options.disableDebugAttr && options.disableExtraction)

  const plugin: Plugin = {
    name: 'tamagui-base',
    enforce: 'pre',

    config(userConfig, env) {
      return {
        plugins: [
          envPlugin(['NODE_ENV', 'TAMAGUI_TARGET']),
          ...(disableStatic ? [] : [tamaguiExtractPlugin(options)]),
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
            process: {
              env: {
                TAMAGUI_TARGET: process.env.TAMAGUI_TARGET || 'web',
                NODE_ENV: process.env.NODE_ENV || env.mode,
                ENABLE_RSC: process.env.ENABLE_RSC,
              },
            },
          }),
        },
        build: {
          commonjsOptions: {
            transformMixedEsModules: true,
          },
        },
        ssr: {
          noExternal: /tamagui|react-native|expo-linear-gradient/,
          optimizeDeps: {},
        },
        optimizeDeps: {
          // include: [/node_modules/],
          esbuildOptions: {
            // plugins: [esbuildCommonjs(['fbjs'])],
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
          // mainFields: ['module:jsx', 'module', 'jsnext:main', 'jsnext'],
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
            'react-native': 'react-native-web-lite',
            // 'react-native': 'react-native-web',
          },
        },
      }
    },
  }

  return plugin
}
