import type { UserConfig } from 'vite'
// TODO why is this not typing
import { one } from 'one/vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

// TODO this optimizeDeps/one.deps conf should be automatically done by one

export default {
  ssr: {
    optimizeDeps: {
      include: [
        '@tamagui/toast',
        '@tamagui/web',
        '@tamagui/core',
        '@tamagui/animations-motion',
        'framer-motion',
        'motion/react',
      ],
    },
  },

  plugins: [
    one({
      react: {
        // not working
        // scan: true,
      },

      web: {
        defaultRenderMode: 'ssg',
      },

      app: {
        // set to the key of your native app
        // will call AppRegistry.registerComponent(app.key)
        key: 'one-example',
      },
    }),

    tamaguiPlugin({
      optimize: true,
    }),
  ],
} satisfies UserConfig
