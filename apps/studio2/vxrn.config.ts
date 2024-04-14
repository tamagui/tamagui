import { tamaguiPlugin } from '@tamagui/vite-plugin'
import type { VXRNConfig } from 'vxrn'
import tsconfigPaths from 'vite-tsconfig-paths'

export default {
  webConfig: {
    plugins: [
      tsconfigPaths(),
      tamaguiPlugin({
        components: ['tamagui'],
        config: 'src/tamagui.config.ts',
      }),
    ],
  },
} satisfies VXRNConfig
