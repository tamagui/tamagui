import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { defineConfig } from 'vitest-native/config'

const nativeExtensions = [
  '.native.tsx',
  '.native.ts',
  '.native.js',
  '.native.jsx',
  '.ios.tsx',
  '.ios.ts',
  '.ios.js',
  '.ios.jsx',
  '.cjs',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
]

const canaryRoot = dirname(fileURLToPath(import.meta.url))

const nativeAliases = [
  {
    find: /^react-native(?:\/.*)?$/,
    replacement: '@tamagui/fake-react-native',
  },
  {
    find: /^react-native-safe-area-context(?:\/.*)?$/,
    replacement: resolve(canaryRoot, 'tests/native-safe-area.cjs'),
  },
]

export default defineConfig({
  plugins: [
    tamaguiPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts',
      disableWatchTamaguiConfig: true,
      disable: true,
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
    'process.env.TAMAGUI_TARGET': JSON.stringify('native'),
    __DEV__: JSON.stringify(true),
    __REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify({ isDisabled: true }),
  },
  resolve: {
    alias: nativeAliases,
    conditions: ['react-native', 'require', 'default'],
    extensions: nativeExtensions,
  },
  environments: {
    ssr: {
      resolve: {
        conditions: ['react-native', 'require', 'default'],
        extensions: nativeExtensions,
        noExternal: true,
      },
    },
  },
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test-setup-native.cjs'],
  },
})
