import { tamaguiPlugin } from '@tamagui/vite-plugin'
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
      'react-native-web/dist/exports/StyleSheet/preprocess':
        '/Users/n8/tamagui/code/ui/react-native-web/dist/esm/index.mjs',
      'react-native-web/dist/exports/StyleSheet/compiler/createReactDOMStyle':
        '/Users/n8/tamagui/code/ui/react-native-web/dist/esm/index.mjs',
      'react-native': '/Users/n8/tamagui/code/ui/react-native-web/dist/esm/index.mjs',
      'react-native-web': '/Users/n8/tamagui/code/ui/react-native-web/dist/esm/index.mjs',
      'react-native-svg': resolve('@tamagui/react-native-svg'),
      '@docsearch/react': resolve('@docsearch/react'),
    },
  },

  ssr: {
    noExternal: true,
    external: ['@tamagui/mdx'],
  },

  plugins: [
    vxs({
      setupFile: './config/setupTamagui.ts',
    }),

    ViteImageOptimizer(),

    removeReactNativeWebAnimatedPlugin(),

    tamaguiPlugin({
      optimize: true,
      components: ['tamagui'],
      config: './config/tamagui.config.ts',
      outputCSS: './app/tamagui.css',
    }),
  ],
} satisfies UserConfig
