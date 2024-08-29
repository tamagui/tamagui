// import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import type { UserConfig } from 'vite'
import { vxs } from 'vxs/vite'

const resolve = (path: string) => {
  const resolved = import.meta.resolve?.(path)
  if (!resolved) {
    throw new Error(`Not found: ${path}, maybe on wrong node version`)
  }
  return resolved.replace('file:/', '')
}

export default {
  define: {
    'process.env.TAMAGUI_REACT_19': '"1"',
  },

  resolve: {
    alias: {
      '~': import.meta.dirname,
      'react-native-svg': '@tamagui/react-native-svg',
      // bugfix docsearch/react
      // bugfix docsearch/react, weird
      '@docsearch/react': resolve('@docsearch/react'),
    },
  },

  ssr: {
    noExternal: true,
    external: ['@tamagui/mdx'],
  },

  plugins: [
    vxs({
      deps: {
        '@tamagui/lucide-icons': true,
      },
    }),
    // tamaguiPlugin(),
    // tamaguiExtractPlugin(),
  ],
} satisfies UserConfig
