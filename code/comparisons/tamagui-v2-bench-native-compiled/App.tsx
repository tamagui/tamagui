import { createNativeCompiledBenchApp } from '../shared/native-compiled-bench'
import config from './tamagui.config'

export const App = createNativeCompiledBenchApp({
  config,
  framework: 'tamagui-v2-compiled',
})
