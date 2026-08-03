import { createNativeCompiledBenchApp } from '../shared/native-compiled-bench'
import config from './tamagui.config'

export const App = createNativeCompiledBenchApp({
  config,
  framework: 'tamagui-v3-compiled',
  buildId: process.env.EXPO_PUBLIC_NATIVE_BENCH_BUILD_ID,
})
