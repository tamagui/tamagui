import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui', '@tamagui/select', '@tamagui/sheet'],
      config: './tamagui.config.ts',
      useReactNativeWebLite: true,
    }),
  ],
  server: {
    port: 5188,
    strictPort: true,
  },
  preview: {
    port: 5189,
    strictPort: true,
  },
})
