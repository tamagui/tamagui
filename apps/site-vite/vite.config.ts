import unagi from '@tamagui/unagi/plugin'
import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import analyze from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

const tamaguiConfig = {
  config: './src/tamagui.config.ts',
  components: ['tamagui', '@tamagui/core'],
}

export default defineConfig({
  clearScreen: false,
  plugins: [
    tamaguiPlugin({
      ...tamaguiConfig,
      useReactNativeWebLite: true,
    }),
    tamaguiExtractPlugin(tamaguiConfig),
    unagi({
      experimental: { css: 'global' },
    }),
    analyze({
      emitFile: true,
      gzipSize: true,
      filename: '.stats.html',
    }),
  ],
})
