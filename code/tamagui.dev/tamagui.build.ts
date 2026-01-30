import type { TamaguiBuildOptions } from 'tamagui'

export default {
  components: ['tamagui'],
  logTimings: true,
  config: '@tamagui/tamagui-dev-config',
  outputCSS: './tamagui.generated.css',
  // bento lists some last issues
  // useReactNativeWebLite: true,
} satisfies TamaguiBuildOptions
