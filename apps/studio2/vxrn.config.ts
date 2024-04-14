import { tamaguiPlugin } from '@tamagui/vite-plugin'
import entryShakingPlugin from 'vite-plugin-entry-shaking'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { VXRNConfig } from 'vxrn'

const targets = [
  require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
  require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
]

export default {
  webConfig: {
    plugins: [
      entryShakingPlugin({
        targets,
      }),
      tsconfigPaths(),
      // TODO type is mad
      tamaguiPlugin({
        components: ['tamagui'],
        config: 'src/tamagui.config.ts',
      }) as any,
    ],
  },
} satisfies VXRNConfig
