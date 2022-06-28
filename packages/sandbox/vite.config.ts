import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import envPlugin from 'vite-plugin-environment'

export default defineConfig({
  plugins: [
    envPlugin(['NODE_ENV', 'TAMAGUI_TARGET']),
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
      jsxPure: true,
    }),
    tamaguiPlugin(),
  ],
})
