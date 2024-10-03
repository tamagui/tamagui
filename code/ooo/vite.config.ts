import { tamaguiPlugin } from '@tamagui/vite-plugin'
import type { UserConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { one } from 'one/vite'

const resolve = (path: string) => {
  const resolved = import.meta.resolve?.(path)
  if (!resolved) {
    throw new Error(`Not found: ${path}, maybe on wrong node version`)
  }
  return resolved.replace('file:/', '').replace(/\/+/, '/')
}

export default {
  resolve: {
    alias: [
      {
        find: '@docsearch/react',
        replacement: resolve('@docsearch/react'),
      },
      {
        find: 'tabbable',
        replacement: resolve('@tamagui/proxy-tabbable'),
      },
      {
        find: '@tamagui/select',
        replacement: resolve('@tamagui/proxy-tabbable'),
      },
      // {
      //   find: 'tslib',
      //   replacement: resolve('@tamagui/proxy-worm'),
      // },
    ],

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

    ViteImageOptimizer(),

    // removeReactNativeWebAnimatedPlugin(),

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
