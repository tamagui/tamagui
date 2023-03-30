/// <reference types="vitest" />

// import 'vitest-axe/extend-expect'

// import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
// import { expect } from 'vitest'
// import matchers from 'vitest-axe/matchers'

export default defineConfig({
  plugins: [
    // viteCommonjs(),
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
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [esbuildCommonjs(['@tamagui/core-node'])],
  //   },
  // },
  test: {
    // setupFiles: [join(__dirname, 'setup.ts')],
    environment: 'happy-dom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      inline: ['react-native-web', /tamagui/],
    },
  },
})
