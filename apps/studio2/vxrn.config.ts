import { tamaguiPlugin } from '@tamagui/vite-plugin'
import type { VXRNConfig } from 'vxrn'

export default {
  webConfig: {
    plugins: [
      tamaguiPlugin({
        components: ['tamagui'],
        config: 'src/tamagui.config.ts',
      }),
    ],
  },
} satisfies VXRNConfig
