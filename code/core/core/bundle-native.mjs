#!/usr/bin/env node

import { bundleNative } from '@tamagui/native-bundle'

const external = [/^@tamagui\/size($|\/)/]

// Bundle for production (native.cjs)
await bundleNative({
  entry: 'src/index.tsx',
  outDir: 'dist',
  fileName: 'native.cjs',
  external,
})

// Bundle for tests (test.native.cjs)
// Externalizes react-native so it can be mocked at runtime by vitest-react-native
await bundleNative({
  entry: 'src/index.tsx',
  outDir: 'dist',
  fileName: 'test.native.cjs',
  isTest: true,
  external,
  define: {
    // tests exercise test-only paths and temporarily switch to development
    // to assert diagnostics, so preserve the runtime environment in this artifact
    'process.env.NODE_ENV': 'globalThis.process.env.NODE_ENV',
  },
})
