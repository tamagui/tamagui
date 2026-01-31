import type { TamaguiBuildOptions } from 'tamagui'

export default {
  components: ['tamagui'],
  logTimings: true,
  config: '@tamagui/tamagui-dev-config',
  outputCSS: './tamagui.generated.css',
  optimize: true,
  disableExtraction: process.env.NODE_ENV !== 'production',
  // bento lists some last issues
  // useReactNativeWebLite: true,
} as TamaguiBuildOptions
