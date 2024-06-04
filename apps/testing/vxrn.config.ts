// import { tamaguiExtractPlugin, tamaguiPlugin } from '@tamagui/vite-plugin'
import { vxs, build, serve } from 'vxs/vite'
import type { VXRNConfig } from 'vxrn'

export default {
  webConfig: {
    define: {
      'process.env.TAMAGUI_REACT_19': '"1"',
    },

    resolve: {
      alias: {
        '~': import.meta.dirname,
        'react-native-svg': '@tamagui/react-native-svg',
      },
    },

    plugins: [
      vxs({
        root: 'app',
      }),
      // tamaguiPlugin(),
      // tamaguiExtractPlugin(),
    ],
  },

  async afterBuild(...args) {
    await build(...args)
  },

  serve(options, app) {
    serve(options, app)
  },
} satisfies VXRNConfig
