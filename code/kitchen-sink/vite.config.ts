import { tamaguiPlugin } from '@tamagui/vite-plugin'
// @ts-ignore vite types require moduleResolution bundler
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: true,
  plugins: [
    // tamaguiPlugin({
    //   components: ['@tamagui/sandbox-ui', 'tamagui'],
    //   config: 'src/tamagui.config.ts',
    //   optimize: process.env.EXTRACT === '1',
    // }),
  ].filter(Boolean),
})
