// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import { removeReactNativeWebAnimatedPlugin, vxs } from 'vxs/vite'
// import { mdx } from '@cyco130/vite-plugin-mdx'
import type { UserConfig } from 'vite'
// import inpsectPlugin from 'vite-plugin-inspect'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`)
}

// const require = createRequire(import.meta.url)
// const targets = [
//   require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/colors').replace('/dist/cjs/index.js', ''),
// ]

const optimizeInterop = ['expo-splash-screen']

const include = [
  ...optimizeInterop,
  '@leeoniya/ufuzzy',
  'react-hook-form',
  '@github/mini-throttle',
  'swr',
  '@tamagui/demos',
  '@tamagui/bento',
  '@supabase/ssr',
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
]

const optimizeDeps = {
  include,
  needsInterop: optimizeInterop,
}

export default {
  envPrefix: 'NEXT_PUBLIC_',

  define: {
    'process.env.TAMAGUI_REACT_19': '"1"',
  },

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
    vxs(),
    removeReactNativeWebAnimatedPlugin(),

    // hmmm breaking ssr for some reason on lucide:
    // @ts-ignore
    // entryShakingPlugin({
    //   targets,
    // }),

    // tamaguiExtractPlugin({
    //   logTimings: true,
    // }),
  ],
} satisfies UserConfig
