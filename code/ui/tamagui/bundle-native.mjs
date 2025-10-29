#!/usr/bin/env node

import { bundleNative } from '@tamagui/native-bundle'

await bundleNative({
  entry: 'src/index.ts',
  outDir: 'dist',
  fileName: 'native.cjs',
})
