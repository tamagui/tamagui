import { clientTreeShakePlugin, createFileSystemRouter } from '@vxrn/router/vite'
// import { tamaguiPlugin, tamaguiExtractPlugin } from '@tamagui/vite-plugin'
// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import { mdx } from '@cyco130/vite-plugin-mdx'
import tsconfigPaths from 'vite-tsconfig-paths'
import type { VXRNConfig } from 'vxrn'
// import inpsectPlugin from 'vite-plugin-inspect'

// const targets = [
//   require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
// ]

const optimizeInterop = []

const optimizeDeps = {
  include: [
    ...optimizeInterop,
    // '@tamagui/site-config',
    '@tamagui/animations-moti',
    '@tamagui/animations-react-native',
    'rehype-parse',
    'is-buffer',
    'extend',
    'minimatch',
    'gray-matter',
    'execa',
    'jiti',
    'hsluv',
    'refractor',
    'glob',
    'reading-time',
  ],
  needsInterop: optimizeInterop,
}

export default async () => {
  return {
    // flow: {
    //   include: ['react-native-web'],
    // },

    webConfig: {
      resolve: {
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
      },

      plugins: [
        mdx({
          rehypePlugins: [
            // todo
            // rehypeHighlightCode,
          ],
        }),
        // inpsectPlugin(),
        clientTreeShakePlugin(),
        createFileSystemRouter({
          root: 'app',
        }),
        // entryShakingPlugin({
        //   targets,
        // }),
        tsconfigPaths(),
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
