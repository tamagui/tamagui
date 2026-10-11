import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
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
    find: /^react-native\/Libraries\/Pressability\/usePressability$/,
    replacement: createRequire(import.meta.url).resolve(
      '@tamagui/fake-react-native/pressability'
    ),
  },
  {
    find: /^react-native(?:\/.*)?$/,
    replacement: resolve(canaryRoot, 'tests/native-platform.cjs'),
  },
  {
    find: /^react-native-safe-area-context(?:\/.*)?$/,
    replacement: resolve(canaryRoot, 'tests/native-safe-area.cjs'),
  },
]

export default defineConfig({
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
