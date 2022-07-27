import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import envPlugin from 'vite-plugin-environment'

import { tamaguiExtractPlugin } from './extractPlugin'

export function tamaguiPlugin(options: TamaguiOptions): Plugin {
  return {
    name: 'tamagui',
    enforce: 'pre',

    config(userConfig, env) {
      return {
        plugins: [
          envPlugin(['NODE_ENV', 'TAMAGUI_TARGET']),
          ...(options.disable || (options.disableDebugAttr && options.disableExtraction)
            ? []
            : [tamaguiExtractPlugin(options)]),
        ],
        esbuild: {
          loader: 'tsx',
        },
        define: {
          // reanimated support
          'global.__x': {},
          _frameTimestamp: undefined,
          _WORKLET: false,
          process: {
            env: {
              TAMAGUI_TARGET: process.env.TAMAGUI_TARGET || 'web',
              NODE_ENV: process.env.NODE_ENV || env.mode,
            },
          },
        },
        optimizeDeps: {
          esbuildOptions: {
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
            'react-native': 'react-native-web',
          },
        },
      }
    },
  }
}
