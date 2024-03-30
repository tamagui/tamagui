/// <reference types="vitest" />

import { join } from 'path'

import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import reactNative from 'vitest-react-native'

const isNative =
  !process.env.DISABLE_REACT_NATIVE &&
  !process.env.DISABLE_NATIVE_TEST &&
  process.env.TAMAGUI_TARGET !== 'web'

const nativeExtensions = [
  '.native.tsx',
  '.native.ts',
  '.native.js',
  '.native.jsx',
  '.ios.ts',
  '.ios.tsx',
  '.ios.js',
  '.ios.jsx',
  '.mjs',
  '.js',
  '.mts',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
]

const final = defineConfig({
  plugins: [
    process.env.DISABLE_REACT_NATIVE ? null : reactNative(),
    react({}),
    tamaguiPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts',
      disableWatchTamaguiConfig: true,
    }),
  ].filter(Boolean),

  define: {
    'process.env.TAMAGUI_TARGET': JSON.stringify(process.env.TAMAGUI_TARGET),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // otherwise react logs Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
    __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
  },

  ...(isNative && {
    resolve: {
      alias: {
        '@tamagui/core': `@tamagui/core/native-test`,
        '@tamagui/web': `@tamagui/core/native-test`,
      },
      extensions: nativeExtensions,
    },

    optimizeDeps: {
      extensions: nativeExtensions,
      jsx: 'automatic',
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
    server: {
      deps: {
        external: ['react-native'],
      },
    },
  },
})

export default final
