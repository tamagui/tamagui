import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5008,
  },
  clearScreen: false,
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      useReactNativeWebLite: true,
    }),
  ].filter(Boolean),
})
