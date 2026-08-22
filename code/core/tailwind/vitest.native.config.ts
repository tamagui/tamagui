import { defineConfig } from 'vitest/config'

// native runs the same sources through react-native resolution, so `isWeb` is false
// and the frontend takes its native branches (dropped web-only passthrough classes,
// numeric coercion for react native's style types)
export default defineConfig({
  define: {
    'process.env.TAMAGUI_TARGET': JSON.stringify('native'),
  },
  ssr: {
    resolve: {
      conditions: ['react-native', 'import', 'module', 'default'],
    },
  },
  resolve: {
    // relative sources imported by tests (the default config's `./animations`) must
    // pick their .native variant, same as metro would
    extensions: [
      '.native.tsx',
      '.native.ts',
      '.native.js',
      '.native.jsx',
      '.cjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
    ],
    alias: [
      { find: /^react-native$/, replacement: '@tamagui/fake-react-native' },
      { find: /^react-native\//, replacement: '@tamagui/fake-react-native' },
    ],
  },
  test: {
    globals: true,
    server: {
      deps: {
        // let vite resolve tamagui's .native.js graph instead of node's cjs loader
        inline: [/@tamagui\//],
      },
    },
    environment: 'node',
    include: ['src/__tests__/**/*.native.test.tsx'],
  },
})
