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
  // '@vxrn/router/server-render',
  '@react-navigation/native',
  'tamagui/linear-gradient',
  'react-native-svg',
  '@supabase/auth-helpers-react',
  'parse-numeric-range',
  'use-sync-external-store',
  'use-sync-external-store/shim',
  'swr',
]

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
      // noExternal: ssrDepsToOptimize,
      optimizeDeps: {
        include: [
          ...extraOptimize,
          '@tamagui/web',
          '@tamagui/core',
          '@tamagui/toast',
          '@tamagui/lucide-icons',
        ],
        needsInterop: extraOptimize,
        exclude: ['util'],
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

      // {
      //   name: 'fix-soemthing',
      //   enforce: 'pre',
      //   resolveId(id) {
      //     console.log('resolve', id)
      //   },
      // },

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
