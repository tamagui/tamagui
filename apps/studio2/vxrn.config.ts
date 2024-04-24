import { createFileSystemRouter, clientTreeShakePlugin } from '@vxrn/expo-router/vite'
// import { tamaguiPlugin, tamaguiExtractPlugin } from '@tamagui/vite-plugin'
// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { VXRNConfig } from 'vxrn'

// const targets = [
//   require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
// ]

const extraOptimize = [
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
  'reforest',
]

export default {
  webConfig: {
    ssr: {
      optimizeDeps: {
        include: extraOptimize,
        needsInterop: extraOptimize,
      },
    },

    plugins: [
      clientTreeShakePlugin(),
      createFileSystemRouter({
        root: import.meta.dirname,
        routesDir: 'app',
      }),
      // entryShakingPlugin({
      //   targets,
      // }),
      tsconfigPaths(),
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
