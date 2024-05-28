// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import { createRequire } from 'node:module'
import { vxs, build, serve } from 'vxs/vite'
import { tamaguiPlugin, tamaguiExtractPlugin } from '@tamagui/vite-plugin'
// import { mdx } from '@cyco130/vite-plugin-mdx'
import type { VXRNConfig } from 'vxrn'
// import inpsectPlugin from 'vite-plugin-inspect'
import { analyzer } from 'vite-bundle-analyzer'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

const require = createRequire(import.meta.url)

const targets = [
  require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
  require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
  require.resolve('@tamagui/colors').replace('/dist/cjs/index.js', ''),
]

const optimizeInterop = ['expo-splash-screen']

const optimizeDeps = {
  include: [
    ...optimizeInterop,
    'swr',
    '@tamagui/demos',
    '@supabase/ssr',
    '@supabase/auth-helpers-react',
    '@tamagui/animations-moti',
    '@tamagui/animations-react-native',
    'is-buffer',
    'extend',
    'minimatch',
    'gray-matter',
    'execa',
    'jiti',
    'hsluv',
    'rehype-parse',
    'refractor',
    'glob',
    'reading-time',
    'unified',
  ],
  needsInterop: optimizeInterop,
}

export default async () => {
  return {
    async afterBuild(...args) {
      await build(...args)
    },

    serve(options, app) {
      serve(options, app)
    },

    webConfig: {
      envPrefix: 'NEXT_PUBLIC_',

      resolve: {
        alias: {
          '~': import.meta.dirname,
          'react-native-svg': '@tamagui/react-native-svg',
        },

        // todo automate, probably can just dedupe all package.json deps?
        dedupe: [
          'react',
          'react-dom',
          '@tamagui/core',
          '@tamagui/web',
          'tamagui',
          '@tamagui/site-config',
        ],
      },

      optimizeDeps,

      ssr: {
        optimizeDeps,
        external: ['@tamagui/mdx'],
      },

      plugins: [
        vxs({
          root: 'app',
        }),

        // hmmm breaking ssr for some reason on lucide:
        // @ts-ignore
        // entryShakingPlugin({
        //   targets,
        // }),

        // tamaguiExtractPlugin({
        //   logTimings: true,
        // }),
      ],
    },
  } satisfies VXRNConfig
}
