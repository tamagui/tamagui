import { tamaguiExtractPlugin } from '@tamagui/vite-plugin'
import type { UserConfig } from 'vite'
import { removeReactNativeWebAnimatedPlugin, vxs } from 'vxs/vite'

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
      'react-native-svg': '@tamagui/react-native-svg',
      // bugfix docsearch/react
      '@docsearch/react': resolve('@docsearch/react'),
    },
  },

  ssr: {
    noExternal: true,
    external: ['@tamagui/mdx'],
  },

  plugins: [
    vxs({}),

    removeReactNativeWebAnimatedPlugin(),

    tamaguiExtractPlugin({
      components: ['tamagui'],
      config: './config/tamagui.config.ts',
    }),
  ],
} satisfies UserConfig
