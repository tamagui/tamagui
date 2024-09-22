import { tamaguiExtractPlugin } from '@tamagui/vite-plugin'
import type { UserConfig } from 'vite'
import { removeReactNativeWebAnimatedPlugin, vxs } from 'vxs/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

const resolve = (path: string) => {
  const resolved = import.meta.resolve?.(path)
  if (!resolved) {
    throw new Error(`Not found: ${path}, maybe on wrong node version`)
  }
  return resolved.replace('file:/', '')
}

export default {
  resolve: {
    alias: {
      '~': import.meta.dirname,
      'react-native': resolve('react-native-web-lite'),
      'react-native-svg': resolve('@tamagui/react-native-svg'),
      '@docsearch/react': resolve('@docsearch/react'),
    },
  },

  ssr: {
    noExternal: true,
    external: ['@tamagui/mdx'],
  },

  plugins: [
    vxs({}),

    ViteImageOptimizer(),

    removeReactNativeWebAnimatedPlugin(),

    tamaguiExtractPlugin({
      // disableExtraction: process.env.NODE_ENV === 'development',
      components: ['tamagui'],
      config: './config/tamagui.config.ts',
      outputCSS: './app/tamagui.css',
    }),
  ],
} satisfies UserConfig
