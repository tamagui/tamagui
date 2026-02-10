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
      config: {
        tsConfigPaths: {
          root: import.meta.dirname,
          projectDiscovery: 'eager',
        },
      },
      //  native: {
      //   bundler: 'metro',
      //   bundlerOptions: {
      //     watchman: false,
      //     // defaultConfigOverrides(defaultConfig) {
      //     //   console.log('metro config:', JSON.stringify(defaultConfig, null, 2))
      //     //   return {
      //     //     ...defaultConfig,
      //     //     // add monorepo root to watchFolders so metro can find symlinked packages
      //     //     watchFolders: [monorepoRoot],
      //     //     resolver: {
      //     //       ...defaultConfig?.resolver,
      //     //       // enableGlobalPackages: true,
      //     //       // unstable_enablePackageExports: false,
      //     //       // add monorepo node_modules to search paths
      //     //       // nodeModulesPaths: [
      //     //       //   monorepoRoot,
      //     //       //   ...(defaultConfig?.resolver?.nodeModulesPaths || []),
      //     //       // ],
      //     //     },
      //     //   }
      //     // },
      //   },

      web: {
        defaultRenderMode: 'ssg',
      },

      // app: {
      //   // set to the key of your native app
      //   // will call AppRegistry.registerComponent(app.key)
      //   key: 'one-example',
      // },
    }),

    tamaguiPlugin(),
  ],
} satisfies UserConfig
