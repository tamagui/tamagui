import unagi from '@tamagui/unagi/plugin'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import { defineConfig } from 'vite'

const tamaguiConfig = {
  config: './src/tamagui.config.ts',
  components: ['tamagui', '@tamagui/core'],
}

export default defineConfig({
  plugins: [
    //
    tamaguiPlugin(tamaguiConfig),
    tamaguiExtractPlugin(tamaguiConfig),
    unagi({
      experimental: { css: 'global' },
    }),
  ],
})
