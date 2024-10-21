import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { one } from 'one/vite'
import type { UserConfig } from 'vite'

export default {
  resolve: {
    dedupe: [
      'react',
      'react-dom',
      '@tamagui/core',
      '@tamagui/web',
      '@tamagui/animations-moti',
      '@tamagui/toast',
      'tamagui',
      '@tamagui/use-presence',
      'react-native-reanimated',
      '@tamagui/react-native-web',
      'react-native-web-internals',
    ],
  },

  ssr: {
    noExternal: true,
    external: ['@tamagui/mdx'],
  },

  define: {
    'process.env.TAMAGUI_DISABLE_NO_THEME_WARNING': '"1"',
    'process.env.TAMAGUI_SKIP_THEME_OPTIMIZATION': '"1"',
  },

  plugins: [
    one(),

    tamaguiPlugin({
      // optimize: true,
      disableServerOptimization: process.env.NODE_ENV === 'development',
      useReactNativeWebLite: true,
      components: ['tamagui'],
      config: './config/tamagui.config.ts',
      outputCSS: './app/tamagui.css',
      themeBuilder: {
        input: './config/themes.ts',
        output: './config/themesOut.ts',
      },
    }),
  ],
} satisfies UserConfig
