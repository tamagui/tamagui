/// <reference types="vitest" />

import { join } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

const reactNative = require('vitest-react-native')

export default defineConfig({
  plugins: [
    // viteCommonjs(),
    process.env.DISABLE_REACT_NATIVE ? null : reactNative(),
    react({}),
    tamaguiPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts',
      disableWatchTamaguiConfig: true,
    }),
  ].filter(Boolean),
  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [esbuildCommonjs(['@tamagui/core'])],
  //   },
  // },

  ...(!process.env.DISABLE_NATIVE_TEST &&
    process.env.TAMAGUI_TARGET !== 'web' && {
      resolve: {
        alias: {
          '@tamagui/core': require.resolve(`@tamagui/core/native-test`),
          '@tamagui/web': require.resolve(`@tamagui/core/native-test`),
        },
      },
    }),

  // @ts-ignore
  test: {
    // for compat with some jest libs (like @testing-library/jest-dom)
    globals: true,
    setupFiles: [join(__dirname, 'test-setup.ts')],
    // happy-dom has issues with components-test
    environment: process.env.TEST_ENVIRONMENT || 'happy-dom',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    deps: {
      inline: [/^(?!.*vitest).*$/],
    },
  },
})
