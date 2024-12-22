/// <reference types="vitest" />

import react from '@vitejs/plugin-react-swc'
import { join } from 'node:path'
import { type Plugin, defineConfig } from 'vite'
import { requireResolve } from './requireResolve'

export function getConfig(tamaguiPlugin: any) {
  const isNative =
    !process.env.DISABLE_REACT_NATIVE &&
    !process.env.DISABLE_NATIVE_TEST &&
    process.env.TAMAGUI_TARGET !== 'web'

  const nativeExtensions =
    process.env.TEST_NATIVE_PLATFORM === 'ios'
      ? [
          '.ios.ts',
          '.ios.tsx',
          '.ios.js',
          '.ios.jsx',
          '.cjs',
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ]
      : [
          '.native.tsx',
          '.native.ts',
          '.native.js',
          '.native.jsx',
          '.ios.ts',
          '.ios.tsx',
          '.ios.js',
          '.ios.jsx',
          '.cjs',
          '.js',
          '.ts',
          '.jsx',
          '.tsx',
          '.json',
        ]

  return defineConfig({
    plugins: [
      // process.env.DISABLE_REACT_NATIVE ? null : reactNative(),
      react({}),

      tamaguiPlugin({
        components: ['tamagui'],
        config: './tamagui.config.ts',
        disableWatchTamaguiConfig: true,
      }),

      {
        name: 'native-test',
        async config() {
          if (isNative) {
            return {
              resolve: {
                // 'react-native', breaks because vitest isnt doing .native.js :/
                conditions: ['react-native', 'require', 'default'],
                alias: {
                  '@tamagui/core': '@tamagui/core/native-test',
                  '@tamagui/web': '@tamagui/core/native-test',
                },
                extensions: nativeExtensions,
              },

              optimizeDeps: {
                include: ['@tamagui/constants'],
                extensions: nativeExtensions,
                jsx: 'automatic',
              },
            }
          }
        },
      } satisfies Plugin,
    ].filter(Boolean),

    define: {
      'process.env.TAMAGUI_TARGET': JSON.stringify(process.env.TAMAGUI_TARGET),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // otherwise react logs Download the React DevTools for a better development experience: https://reactjs.org/link/react-devtools
      __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
    },

    resolve: {
      alias: {
        'react-native': '@tamagui/react-native-web-lite',
      },
    },

    // @ts-ignore
    test: {
      // for compat with some jest libs (like @testing-library/jest-dom)
      globals: true,
      setupFiles: [
        join(__dirname, 'test-setup.ts'),
        requireResolve('vitest-react-native/setup'),
      ],
      // happy-dom has issues with components-test
      environment: process.env.TEST_ENVIRONMENT || 'happy-dom',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      server: {
        deps: {
          external: ['react-native'],
          noExternal: true,
        },
      },
    },
  })
}
