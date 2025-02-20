import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { join } from 'node:path'
import { one } from 'one/vite'
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

const include = [
  '@ai-sdk/deepseek',
  'secure-json-parse',
  '@supabase/postgres-js',
  'ai',
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
]

const disableExtraction = false

export default {
  envPrefix: 'NEXT_PUBLIC_',

  resolve: {
    alias: {
      'react-native-svg': '@tamagui/react-native-svg',
      // 'react-native-web': await resolve('react-native-web-lite'),
      // bugfix docsearch/react, weird
      '@docsearch/react': resolve('@docsearch/react'),
      'react-native/Libraries/Core/ReactNativeVersion': resolve('@tamagui/proxy-worm'),
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
    tamaguiPlugin({
      components: ['tamagui'],
      logTimings: true,
      optimize: true,
      disableExtraction,
      config: '@tamagui/tamagui-dev-config',
      outputCSS: './tamagui.css',
      // useReactNativeWebLite: true,
    }),

    one({
      react: {
        compiler: true,
        // scan: {
        //   options: {
        //     showToolbar: true,
        //     enabled: true,
        //     // log: true,
        //   },
        // },
      },

      ssr: {
        autoDepsOptimization: {
          include: /.*/,
        },
      },

      deps: {
        ws: true,
        url: false,
        '@supabase/postgrest-js': true,
        '@supabase/node-fetch': true,
        postmark: true,
        stripe: true,
        jsonwebtoken: true,
        bottleneck: true,
        octokit: true,
        'node-fetch': true,
        'fetch-blob': true,
        'discord-api-types/v10': true,
        'magic-bytes.js': true,
      },

      build: {
        api: {
          config: {
            build: {
              rollupOptions: {
                external: [
                  '@discordjs/rest',
                  '@discordjs/ws',
                  '@vercel/og',
                  'stripe',
                  'zlib-sync',
                ],
              },
            },
          },
        },
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
