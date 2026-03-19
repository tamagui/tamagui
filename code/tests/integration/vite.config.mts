import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  clearScreen: false,
  optimizeDeps: {
    include: ['inline-style-prefixer'],
  },
  plugins: [
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
    }),
  ].filter(Boolean),
})
