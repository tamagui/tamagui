import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { one } from 'one/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import type { UserConfig } from 'vite'
import { generateBentoProxy } from './scripts/generate-bento-proxy.mjs'

Error.stackTraceLimit = Number.POSITIVE_INFINITY

// @ts-ignore
if (!import.meta.dirname) {
  throw new Error(`Not on Node 22`)
}

// Check if required build artifacts exist, auto-build if missing
const vitePluginDist = pathResolve(
  import.meta.dirname,
  '../compiler/vite-plugin/dist/esm/index.mjs'
)
const staticDist = pathResolve(import.meta.dirname, '../compiler/static/dist/index.cjs')

if (!existsSync(vitePluginDist) || !existsSync(staticDist)) {
  console.info('')
  console.info('Building tamagui packages (dist not found)...')
  try {
    execSync('bun run build:js', {
      cwd: pathResolve(import.meta.dirname, '../..'),
      stdio: 'inherit',
    })
    console.info('Build complete!')
  } catch (e) {
    console.error('Build failed. You may need to run `bun run build` from the repo root.')
    throw e
  }
}

// Generate bento proxy files (creates stubs if bento repo not found)
const { hasBento } = generateBentoProxy({
  basePath: pathResolve(import.meta.dirname, 'scripts'),
  silent: false,
})

if (hasBento) {
  console.info('Using ../bento')
}

// use createRequire instead of import.meta.resolve for bun compatibility in vite config
const require = createRequire(import.meta.url)
const resolve = (path: string) => {
  return require.resolve(path)
}

const include = [
  // pre-bundle common web deps to avoid mid-navigation optimization in dev mode
  'react-native',
  'react-dom',
  'zod',
  '@stripe/react-stripe-js',
  '@stripe/stripe-js',
  'swr/mutation',
  'mdx-bundler/client',
  // existing
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

export default {
  envPrefix: 'NEXT_PUBLIC_',

  server: {
    fs: {
      allow: ['..', '../../../bento'],
    },
  },

  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 100_000, // merge chunks smaller than 100KB
      },
    },
  },

  resolve: {
    preserveSymlinks: false,
    alias: [
      // Regex-based alias for bento components when not available
      ...(!hasBento
        ? [
            {
              find: /^@tamagui\/bento\/component\/.+$/,
              replacement: pathResolve(
                import.meta.dirname,
                './helpers/dist/bento-component-stub.tsx'
              ),
            },
          ]
        : []),
      // Standard string-based aliases
      {
        find: 'react-native-svg',
        replacement: '@tamagui/react-native-svg',
      },
      // {
      //   find: 'react-native-web',
      //   replacement: resolve('@tamagui/react-native-web-lite'),
      // },
      // bugfix docsearch/react, weird
      {
        find: '@docsearch/react',
        replacement: resolve('@docsearch/react'),
      },
      {
        find: 'react-native/Libraries/Core/ReactNativeVersion',
        replacement: resolve('@tamagui/proxy-worm'),
      },
      // Bento paths (conditional based on bento availability)
      ...(hasBento
        ? [
            {
              find: '@tamagui/bento/raw',
              replacement: pathResolve(import.meta.dirname, '../../../bento/src/index'),
            },
            {
              find: '@tamagui/bento/provider',
              replacement: pathResolve(
                import.meta.dirname,
                '../../../bento/src/components/provider/CurrentRouteProvider'
              ),
            },
            {
              find: '@tamagui/bento/component',
              replacement: pathResolve(
                import.meta.dirname,
                '../../../bento/src/components'
              ),
            },
          ]
        : []),
      // Always provide these aliases - they point to proxy files that work with or without bento
      {
        find: '@tamagui/bento/data',
        replacement: pathResolve(import.meta.dirname, './helpers/dist/bento-proxy-data'),
      },
      {
        find: '@tamagui/bento',
        replacement: pathResolve(import.meta.dirname, './helpers/dist/bento-proxy'),
      },
    ],

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
    external: ['@vxrn/mdx', 'ws'],
    noExternal: true,
  },

  plugins: [
    // Plugin to stub bento component imports when bento repo is not available
    !hasBento && {
      name: 'stub-bento-components',
      enforce: 'pre', // Run before other plugins including alias resolution
      resolveId(id: string) {
        // Intercept imports from @tamagui/bento/component/*
        if (id.startsWith('@tamagui/bento/component/')) {
          // Return a virtual module ID
          return '\0bento-component-stub:' + id
        }
      },
      load(id: string) {
        // Handle the virtual module
        if (id.startsWith('\0bento-component-stub:')) {
          // Return stub component code
          return `
import { YStack, Paragraph } from 'tamagui'

export default function BentoComponentStub() {
  if (process.env.NODE_ENV === 'production') {
    return null
  }
  return (
    <YStack p="$4" bc="$borderColor" br="$4">
      <Paragraph size="$2" color="$color10">
        Bento component not available
      </Paragraph>
    </YStack>
  )
}

// Export as default and named for compatibility
export const LocationNotification = BentoComponentStub
`
        }
      },
    },
    tamaguiPlugin(
      // see tamagui.build.ts
    ),

    one({
      react: {
        compiler: process.env.NODE_ENV === 'production',
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
        '@ngneat/falso': true,
        seedrandom: true,
        '@react-navigation/core': {
          version: '^7',
          'lib/module/useOnGetState.js': (contents) => {
            return contents?.replace(
              'if (route.state === childState)',
              'if (!childState || route.state === childState)'
            )
          },
        },
        'react-native-reanimated': {
          'lib/module/createAnimatedComponent/createAnimatedComponent.js': (contents) => {
            // if not using layout animations, this saves a super expensive repaint that happens often
            return contents?.replace(
              `return this._componentDOMRef.getBoundingClientRect();`,
              'return null;'
            )
          },
        },
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
        experimental_scriptLoading: 'after-lcp-aggressive',
        redirects: [
          // llms.txt, llms-full.txt, docs.txt are handled by middleware directly
          {
            source: '/account/subscriptions',
            destination: '/account',
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

    ...(process.env.ANALYZE
      ? [
          visualizer({
            filename: 'bundle_stats.html',
            open: false,
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
          visualizer({
            filename: 'bundle_stats.json',
            template: 'raw-data',
            gzipSize: true,
            brotliSize: true,
            emitFile: true,
          }),
        ]
      : []),
  ],
} satisfies UserConfig
