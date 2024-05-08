import { createRequire } from 'node:module'
import { getVitePlugins } from '@vxrn/router/vite'
// import { tamaguiPlugin, tamaguiExtractPlugin } from '@tamagui/vite-plugin'
import { mdx } from '@cyco130/vite-plugin-mdx'
import type { VXRNConfig } from 'vxrn'
// import inpsectPlugin from 'vite-plugin-inspect'

Error.stackTraceLimit = Infinity

const require = createRequire(import.meta.url)

const targets = [
  require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
  require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
]

const optimizeInterop = ['expo-splash-screen']

const optimizeDeps = {
  include: [
    ...optimizeInterop,
    'swr',
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
    // flow: {
    //   include: ['react-native-web'],
    // },

    webConfig: {
      envPrefix: 'NEXT_PUBLIC_',

      resolve: {
        alias: {
          '~': import.meta.dirname,
          'react-native-svg': '@tamagui/react-native-svg',
        },

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
        noExternal: [
          'swr',
          'react',
          'react-dom',
          'react-dom/server',
          'react-native',
          'expo-modules-core',
          'react-native-gesture-handler',
          '@react-navigation/native',
          'expo-splash-screen',
          'expo-constants',
        ],
      },

      plugins: [
        // mdx({
        //   rehypePlugins: [
        //     // todo
        //     // rehypeHighlightCode,
        //   ],
        // }),

        ...getVitePlugins({
          root: 'app',
        }),

        // hmmm breaking ssr for some reason on lucide:
        // @ts-ignore
        // entryShakingPlugin({
        //   targets,
        // }),

        // TODO type is mad
        // tamaguiPlugin({
        //   components: ['tamagui'],
        //   config: 'src/tamagui.config.ts',
        // }) as any,
        // tamaguiExtractPlugin({
        //   logTimings: true,
        // }),
      ],
    },
  } satisfies VXRNConfig
}
