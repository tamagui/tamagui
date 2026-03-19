import { tamaguiAliases, tamaguiPlugin } from '@tamagui/vite-plugin'
import { one } from 'one/vite'
import type { UserConfig } from 'vite'

const useRNWLite = !!process.env.USE_RNW_LITE

// TODO this optimizeDeps/one.deps conf should be automatically done by one

export default {
  clearScreen: false,

  ...(useRNWLite && {
    resolve: {
      alias: tamaguiAliases({ rnwLite: true }),
    },
  }),

  plugins: [
    one({
      optimization: {
        autoOptimizeDeps: false,
      },

      ssr: {
        dedupeSymlinkedModules: true,
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

    tamaguiPlugin({
      // see tamagui.build.ts for options
      fixVite8SymlinkExportResolutions: true,
    }),
  ],
} satisfies UserConfig
