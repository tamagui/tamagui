/// <reference types="vitest" />

// import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
  // @ts-ignore
  test: {
    // setupFiles: [join(__dirname, 'setup.ts')],
    environment: 'happy-dom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      inline: ['react-native-web', /tamagui/],
    },
  },
})
