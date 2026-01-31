import type { TamaguiBuildOptions } from 'tamagui'

export default {
  components: ['tamagui'],
  logTimings: true,
  config: '@tamagui/tamagui-dev-config',
  outputCSS: './tamagui.generated.css',
  disableExtraction: process.env.NODE_ENV === 'development',
  // bento lists some last issues
  // useReactNativeWebLite: true,
} satisfies TamaguiBuildOptions
