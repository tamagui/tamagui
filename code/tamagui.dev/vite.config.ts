// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import { removeReactNativeWebAnimatedPlugin, one } from 'one/vite'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import type { UserConfig } from 'vite'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

// @ts-ignore
if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`)
}

const resolve = (path: string) => {
  const resolved = import.meta.resolve?.(path)
  if (!resolved) {
    throw new Error(`Not found: ${path}, maybe on wrong node version`)
  }
  return resolved.replace('file:/', '')
}

// const require = createRequire(import.meta.url)
// const targets = [
//   require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/colors').replace('/dist/cjs/index.js', ''),
// ]

const include = [
  '@docsearch/react',
  '@leeoniya/ufuzzy',
  'react-hook-form',
  '@github/mini-throttle',
  'swr',
  '@supabase/ssr',
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
  '@discordjs/core',
]

export default {
  envPrefix: 'NEXT_PUBLIC_',

  resolve: {
    alias: {
      'react-native-svg': '@tamagui/react-native-svg',
      // 'react-native-web': await resolve('react-native-web-lite'),
      // bugfix docsearch/react, weird
      '@docsearch/react': resolve('@docsearch/react'),
    },

    // todo automate, probably can just dedupe all package.json deps?
    dedupe: [
      'react',
      'react-dom',
      'react-hook-form',
      'react-native',
      'react-native-web',
      'react-native-svg',
      ...include,
    ],
  },

  optimizeDeps: {
    include,
  },

  ssr: {
    external: ['@tamagui/mdx-2'],
    noExternal: true,
  },

  build: {
    cssTarget: 'safari15',
  },

  plugins: [
    one({
      deps: {
        '@supabase/postgrest-js': true,
        '@supabase/node-fetch': true,
        postmark: true,
        stripe: true,
        jsonwebtoken: true,
        bottleneck: true,
        octokit: true,
        'node-fetch': true,
        'fetch-blob': true,
      },

      web: {
        redirects: [
          {
            source: '/account/subscriptions',
            destination: '/account/items',
            permanent: false,
          },
          {
            source: '/docs',
            destination: '/docs/intro/introduction',
            permanent: true,
          },
          {
            source: '/vite',
            destination: 'https://vxrn.dev',
            permanent: true,
          },
          {
            source: '/docs/components/:slug/:version',
            destination: '/ui/:slug/:version',
            permanent: true,
          },
          {
            source: '/docs/components/:slug',
            destination: '/ui/:slug',
            permanent: true,
          },
        ],
      },
    }),

    // removeReactNativeWebAnimatedPlugin(),

    tamaguiPlugin({
      optimize: process.env.NODE_ENV === 'production',
      // useReactNativeWebLite: true,
    }),

    // hmmm breaking ssr for some reason on lucide:
    // can use vite env api and only run this on client, make it part of one
    // @ts-ignore
    // entryShakingPlugin({
    //   targets,
    // }),
  ],
} satisfies UserConfig

// TODO bring back

const purgeCloudflareCDN = async () => {
  if (!process.env.CF_ZONE_ID) throw new Error(`Missing process.env.CF_ZONE_ID`)
  if (!process.env.CF_EMAIL) throw new Error(`Missing process.env.CF_EMAIL`)
  if (!process.env.CF_API_KEY) throw new Error(`Missing process.env.CF_API_KEY`)

  console.info(`Clearing entire CDN cache...`)

  const url = `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-Auth-Email': process.env.CF_EMAIL,
        'X-Auth-Key': process.env.CF_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ purge_everything: true }),
    })

    if (!response.ok) {
      throw new Error(`Failed to purge cache: ${response.statusText}`)
    }

    const result = await response.json()
    console.info(`Cloudflare cache purged successfully:`, result.success)
  } catch (error) {
    console.error('Error purging Cloudflare cache:', error)
  }
}
