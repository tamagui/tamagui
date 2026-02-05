import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { one } from 'one/vite'
import type { UserConfig } from 'vite'
import path from 'node:path'

const monorepoRoot = path.resolve(__dirname, '../..')
console.log('monorepoRoot', monorepoRoot)

export default {
  plugins: [
    one({
      native: {
        bundler: 'metro',
        bundlerOptions: {
          watchman: false,
          // defaultConfigOverrides(defaultConfig) {
          //   console.log('metro config:', JSON.stringify(defaultConfig, null, 2))
          //   return {
          //     ...defaultConfig,
          //     // add monorepo root to watchFolders so metro can find symlinked packages
          //     watchFolders: [monorepoRoot],
          //     resolver: {
          //       ...defaultConfig?.resolver,
          //       // enableGlobalPackages: true,
          //       // unstable_enablePackageExports: false,
          //       // add monorepo node_modules to search paths
          //       // nodeModulesPaths: [
          //       //   monorepoRoot,
          //       //   ...(defaultConfig?.resolver?.nodeModulesPaths || []),
          //       // ],
          //     },
          //   }
          // },
        },
      },

      web: {
        defaultRenderMode: 'ssg',
      },
    }),

    tamaguiPlugin(),
  ],
} satisfies UserConfig
