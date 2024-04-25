import { createFileSystemRouter, clientTreeShakePlugin } from '@vxrn/router/vite'
import { tamaguiPlugin, tamaguiExtractPlugin } from '@tamagui/vite-plugin'
// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { VXRNConfig } from 'vxrn'

// const targets = [
//   require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
// ]

const extraOptimize = [
  'url-parse',
  '@vxrn/safe-area',
  'query-string',
  'escape-string-regexp',
  'use-latest-callback',
  'react-is',
  'fast-deep-equal',
  // '@vxrn/router',
  '@react-navigation/native',
  'tamagui/linear-gradient',
  'react-native-svg',
]

export const depsToOptimize = [
  '@react-native/normalize-color',
  // '@react-navigation/core',
  // '@react-navigation/native',
  '@vxrn/router',
  'expo-modules-core',
  'expo-status-bar',
  // 'react',
  // 'react/jsx-dev-runtime',
  // 'react/jsx-runtime',
  // 'react-dom',
  // 'react-dom/server',
  // 'react-dom/client',
  // 'react-dom/server',
  // 'react-native-safe-area-context',
  'react-native-web',
  'react-native-web-lite',
  'react-native',
  'tamagui',
  '@tamagui/sheet',
  '@tamagui/dialog',
  '@tamagui/alert-dialog',
  '@tamagui/image',
  '@tamagui/avatar',
  '@tamagui/group',
  '@tamagui/popper',
  '@tamagui/popover',
  '@tamagui/scroll-view',
  '@tamagui/select',
  '@tamagui/switch',
  '@tamagui/tabs',
  '@tamagui/toggle-group',
  '@tamagui/tooltip',
  '@tamagui/use-window-dimensions',
  '@tamagui/lucide-icons',
  'react-native-web',
  'react-native-web-lite',
  'reforest',
]

export const needsInterop = [
  'react',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-native-web-internals',
  'react-dom',
  'react-native-web',
  // '@vxrn/router',
  // '@vxrn/router/render',
  // 'react-dom/server',
  'react-dom/client',
]

export const ssrDepsToOptimize = [
  ...new Set([...depsToOptimize, ...needsInterop, 'react-native', 'react-native-svg']),
]

console.log('wtf bro', ssrDepsToOptimize)

export default {
  // flow: {
  //   include: ['react-native-web'],
  // },

  webConfig: {
    // resolve: {
    //   alias: {
    //     'react-native': 'react-native-web-lite',
    //     'react-native-web': 'react-native-web-lite',
    //   },
    // },

    ssr: {
      noExternal: ssrDepsToOptimize,
      optimizeDeps: {
        include: extraOptimize,
        needsInterop: extraOptimize,
      },
    },

    plugins: [
      clientTreeShakePlugin(),
      createFileSystemRouter({
        // disableSSR: true,
        root: __dirname,
        routesDir: 'app',
      }),
      // entryShakingPlugin({
      //   targets,
      // }),
      tsconfigPaths(),

      {
        name: 'fix-soemthing',
        enforce: 'pre',
        resolveId(id) {
          console.log('resolve', id)
        },
      },

      // TODO type is mad
      // tamaguiPlugin({
      //   components: ['tamagui'],
      //   config: 'src/tamagui.config.ts',
      // }) as any,
      // tamaguiExtractPlugin({
      //   logTimings: true,
      // }),
    ],
  },
} satisfies VXRNConfig
