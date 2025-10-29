#!/usr/bin/env node

import { bundleNative } from '@tamagui/native-bundle'

// Bundle for production (native.cjs)
await bundleNative({
  entry: 'src/index.tsx',
  outDir: 'dist',
  fileName: 'native.cjs',
})

// Bundle for tests (test.native.cjs)
// Externalizes react-native so it can be mocked at runtime by vitest-react-native
await bundleNative({
  entry: 'src/index.tsx',
  outDir: 'dist',
  fileName: 'test.native.cjs',
  isTest: true,
  define: {
    'process.env.NODE_ENV': JSON.stringify('test'),
  },
})
