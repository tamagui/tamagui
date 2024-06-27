// import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import type { UserConfig } from 'vite'
import { vxs } from 'vxs/vite'

export default {
  define: {
    'process.env.TAMAGUI_REACT_19': '"1"',
  },

  resolve: {
    alias: {
      '~': import.meta.dirname,
      'react-native-svg': '@tamagui/react-native-svg',
    },

    // dedupe: ['react-wrap-balancer'],
  },

  // optimizeDeps: {
  //   include: ['react-wrap-balancer'],
  // },

  plugins: [
    vxs(),
    // tamaguiPlugin(),
    // tamaguiExtractPlugin(),
  ],
} satisfies UserConfig
