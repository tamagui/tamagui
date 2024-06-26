// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import { removeReactNativeWebAnimatedPlugin, vxs } from 'vxs/vite'
// import { mdx } from '@cyco130/vite-plugin-mdx'
import type { UserConfig } from 'vite'
// import inpsectPlugin from 'vite-plugin-inspect'
import { tamaguiExtractPlugin } from '@tamagui/vite-plugin'

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
  '@docsearch/react',
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
      // bugfix docsearch/react, weird af everything here
      '@docsearch/react': (import.meta.resolve?.('@docsearch/react') || '').replace(
        'file:/',
        ''
      ),
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
      async afterServerStart(options, app, { routeMap }) {
        if (process.env.SHOULD_PURGE_CDN) {
          const pages = Object.values(routeMap).map((path) => `${process.env.URL}${path}`)
          console.info(` [cache] tell Cloudflare to clear pages:\n`, pages.join('\n'))
          await purgeCloudflareCDN(pages)
        }
      },
    }),

    removeReactNativeWebAnimatedPlugin(),

    // hmmm breaking ssr for some reason on lucide:
    // can use vite env api and only run this on client, make it part of vxs
    // @ts-ignore
    // entryShakingPlugin({
    //   targets,
    // }),

    // tamaguiExtractPlugin({
    //   logTimings: true,
    // }),
  ],
} satisfies UserConfig

const purgeCloudflareCDN = async (files: string[]) => {
  if (!process.env.CF_ZONE_ID) throw new Error(`Missing process.env.CF_ZONE_ID`)
  if (!process.env.CF_EMAIL) throw new Error(`Missing process.env.CF_EMAIL`)
  if (!process.env.CF_API_KEY) throw new Error(`Missing process.env.CF_API_KEY`)

  console.info(`Clearing CDN (${files.length} pages)...`)

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`,
      {
        method: 'POST',
        headers: {
          'X-Auth-Email': process.env.CF_EMAIL,
          'X-Auth-Key': process.env.CF_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to purge cache: ${response.statusText}`)
    }

    const result = await response.json()
    console.info('Cloudflare cache purged successfully:', result)
  } catch (error) {
    console.error('Error purging Cloudflare cache:', error)
  }
}
