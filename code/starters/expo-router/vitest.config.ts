import { defineConfig } from 'vitest/config'

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

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
    'process.env.TAMAGUI_TARGET': JSON.stringify('native'),
    __DEV__: JSON.stringify(true),
    __REACT_DEVTOOLS_GLOBAL_HOOK__: JSON.stringify({ isDisabled: true }),
  },
  resolve: {
    alias: [
      {
        find: /^react-native(?:\/.*)?$/,
        replacement: new URL('./tests/native-react-native.cjs', import.meta.url).pathname,
      },
      {
        find: /^react-native-safe-area-context(?:\/.*)?$/,
        replacement: new URL('./tests/native-safe-area.cjs', import.meta.url).pathname,
      },
    ],
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
