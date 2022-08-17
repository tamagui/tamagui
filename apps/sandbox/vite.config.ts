import { tamaguiPlugin } from '@tamagui/vite-plugin'
import reanimated from '@tamagui/vite-plugin-reanimated'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  plugins: [
    reanimated(),
    react({
      jsxRuntime: 'classic',
      fastRefresh: true,
      jsxPure: true,
    }),
    tamaguiPlugin({
      components: [],
    }),
  ],
})
