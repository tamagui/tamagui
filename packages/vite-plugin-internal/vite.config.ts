/// <reference types="vitest" />

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
      jsxPure: true,
    }),
    tamaguiPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts',
    }),
  ],
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      inline: ['vitest-mock-process', 'react-native-web'],
    },
  },
})
