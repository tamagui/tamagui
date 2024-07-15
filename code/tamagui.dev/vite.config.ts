// import entryShakingPlugin from 'vite-plugin-entry-shaking'
import { removeReactNativeWebAnimatedPlugin, vxs } from 'vxs/vite'
// import { mdx } from '@cyco130/vite-plugin-mdx'
import type { UserConfig } from 'vite'
import { tamaguiExtractPlugin } from '@tamagui/vite-plugin'
// import inpsectPlugin from 'vite-plugin-inspect'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

const PROD = process.env.NODE_ENV === 'production'

// @ts-ignore TODO type
if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`)
}

const resolve = async (path) => {
  const resolved = await import.meta.resolve?.(path)
  if (!resolved) {
    throw new Error(`Not found: ${path}`)
  }
  return resolved.replace('file:/', '')
}

// const require = createRequire(import.meta.url)
// const targets = [
//   require.resolve('@tamagui/lucide-icons').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/demos').replace('/dist/cjs/index.js', ''),
//   require.resolve('@tamagui/colors').replace('/dist/cjs/index.js', ''),
// ]

const optimizeInterop = ['expo-splash-screen']

export default {
  envPrefix: 'NEXT_PUBLIC_',

  define: {
    'process.env.TAMAGUI_REACT_19': '"1"',
  },

  resolve: {
    alias: {
      // @ts-ignore TODO fix type
      '~': import.meta.dirname,
      'react-native-svg': await resolve('@tamagui/react-native-svg'),
      // 'react-native-web': await resolve('react-native-web-lite'),
      // bugfix docsearch/react, weird
      '@docsearch/react': await resolve('@docsearch/react'),
    },

    // todo automate, probably can just dedupe all package.json deps?
    dedupe: [
      'react',
      'react-dom',
      '@tamagui/core',
      '@tamagui/web',
      '@tamagui/animations-moti',
      'tamagui',
      'react-hook-form',
      '@tamagui/use-presence',
      'react-native-reanimated',
    ],
  },

  optimizeDeps: {
    include: [
      ...optimizeInterop,
      '@tamagui/animate-presence',
      '@tamagui/presence-child',
      '@docsearch/react',
      '@leeoniya/ufuzzy',
      'react-hook-form',
      '@github/mini-throttle',
      'swr',
      '@tamagui/demos',
      '@tamagui/bento',
      '@tamagui/bento/data',
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
    ],
    needsInterop: optimizeInterop,
  },

  ssr: {
    external: ['@tamagui/mdx'],
  },

  build: {
    cssTarget: 'safari15',
  },

  plugins: [
    vxs({
      async afterServerStart(options, app, { routeMap }) {
        if (process.env.SHOULD_PURGE_CDN) {
          await purgeCloudflareCDN()
        }
      },

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
    }),

    removeReactNativeWebAnimatedPlugin(),

    // hmmm breaking ssr for some reason on lucide:
    // can use vite env api and only run this on client, make it part of vxs
    // @ts-ignore
    // entryShakingPlugin({
    //   targets,
    // }),

    process.env.TAMAGUI_EXTRACT || PROD
      ? tamaguiExtractPlugin({
          logTimings: true,
        })
      : null,
  ],
} satisfies UserConfig

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

// this just does each page but was causing cache issues

// const pages = Object.values(routeMap).map((path) =>
//   `${process.env.URL}${path}`.replace('.html', '')
// )
// console.info(
//   ` [cache] tell Cloudflare to clear pages (first page: ${pages[0]})`
// )

// const purgeCloudflareCDN = async (filesIn: string[]) => {
//   if (!process.env.CF_ZONE_ID) throw new Error(`Missing process.env.CF_ZONE_ID`)
//   if (!process.env.CF_EMAIL) throw new Error(`Missing process.env.CF_EMAIL`)
//   if (!process.env.CF_API_KEY) throw new Error(`Missing process.env.CF_API_KEY`)

//   console.info(`Clearing CDN (${filesIn.length} pages)...`)

//   const url = `https://api.cloudflare.com/client/v4/zones/${process.env.CF_ZONE_ID}/purge_cache`
//   const files = filesIn //.map((file) => encodeURIComponent(file))

//   try {
//     const filesChunks: string[][] = []
//     for (const [index, file] of files.entries()) {
//       const chunk = index % 10
//       filesChunks[chunk] ||= []
//       filesChunks[chunk].push(file)
//     }

//     for (const [index, chunk] of filesChunks.entries()) {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'X-Auth-Email': process.env.CF_EMAIL,
//           'X-Auth-Key': process.env.CF_API_KEY,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ files: chunk }),
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to purge cache: ${response.statusText}`)
//       }

//       const result = await response.json()
//       console.info(
//         `Cloudflare cache purged (${index + 1}/${filesChunks.length}) success:`,
//         result.success
//       )
//     }
//   } catch (error) {
//     console.error('Error purging Cloudflare cache:', error)
//   }
// }
