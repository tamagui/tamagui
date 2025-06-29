import type { UserConfig } from 'vite'
// TODO why is this not typing
import { one } from 'one/vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'

// TODO this optimizeDeps/one.deps conf should be automatically done by one

export default {
  optimizeDeps: {
    include: [
      '@tamagui/toast',
      '@tamagui/web',
      '@tamagui/core',
      'framer-motion',
      'motion/react',
      '@tamagui/animations-motion',
    ],
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

      deps: {
        '@tamagui/animations-motion': true,
        'motion/react': true,
        'framer-motion': true,
      },
    }),

    tamaguiPlugin({
      optimize: true,
      components: ['tamagui'],
      config: './config/tamagui/tamagui.config.ts',
      outputCSS: './app/tamagui.css',
    }),
  ],
} satisfies UserConfig
