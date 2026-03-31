import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { tamaguiPlugin, tamaguiAliases } from '@tamagui/vite-plugin'
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
  // core tamagui packages must be pre-bundled together to avoid duplicate instances
  'tamagui',
  '@tamagui/core',
  '@tamagui/web',
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
  '@tamagui/get-font-sized',
  '@tamagui/linear-gradient',
  '@rehookify/datepicker',
  '@tamagui/get-token',
  '@tamagui/roving-focus',
  'react-native-safe-area-context',
  '@hookform/resolvers/zod',
  'react-native-reanimated',
  '@tamagui/react-native-svg',
  'react-native-gesture-handler',
  '@tanstack/react-table',
  '@tamagui/focus-scope',
  'react-dropzone',
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
      // v3 bugfix no longer needed with @docsearch/react v4
      // {
      //   find: '@docsearch/react',
      //   replacement: resolve('@docsearch/react'),
      // },
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

      ...(process.env.RNW_LITE
        ? tamaguiAliases({
            rnwLite: true,
            svg: true,
          })
        : []),
    ],

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
    external: ['@vxrn/mdx', 'ws', 'postmark', 'stripe'],
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
    tamaguiPlugin({
      // see tamagui.build.ts
      disable: process.env.NODE_ENV !== 'production',
    }),

    one({
      server: {
        cacheControl: {
          'fonts/**': 'public, max-age=604800, stale-while-revalidate=86400',
          '*.svg': 'public, max-age=86400',
          '*.png': 'public, max-age=86400',
          '*.jpg': 'public, max-age=86400',
          '*.woff2': 'public, max-age=604800',
        },
      },

      react: {
        compiler: process.env.NODE_ENV === 'production',
      },

      ssr: {
        dedupeSymlinkedModules: true,
        autoDepsOptimization: {
          include: /.*/,
        },
      },

      patches: {
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
        skewProtection: 'proactive',
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

    // rolldown __esm init ordering fix: when a chunk does top-level
    // styled(X) but X comes from a lazy-init chunk, X is undefined
    // because the init hasn't run yet. this plugin reads all output
    // chunks and patches consumers to call the init first.
    {
      name: 'fix-esm-init-order',
      generateBundle(_options: any, bundle: any) {
        // pass 1: find chunks that have __esm lazy inits and map their exports
        const lazyChunks = new Map<string, Set<string>>()
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if ((chunk as any).type !== 'chunk') continue
          const code = (chunk as any).code as string
          // detect __esm pattern: var ...,X=INIT_FN(()=>{...})
          if (/=\w\(\(\)=>\{/.test(code)) {
            // this chunk has lazy inits — all its exports may need init
            lazyChunks.set(`./${fileName}`, new Set())
          }
        }

        if (!lazyChunks.size) return

        // pass 2: for each non-lazy chunk, check if it imports from lazy chunks
        // and uses those imports in top-level styled() calls
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if ((chunk as any).type !== 'chunk') continue
          let code = (chunk as any).code as string

          // skip chunks that already have their own lazy init
          if (/=\w\(\(\)=>\{/.test(code)) continue

          // check if this chunk has top-level styled() usage (name:` pattern)
          if (!code.includes('name:`')) continue

          // find imports from lazy chunks
          const importRe = /import\{([^}]+)\}from"(\.\/[^"]+\.js)"/g
          let match
          let patched = false

          while ((match = importRe.exec(code))) {
            const [full, bindings, path] = match
            if (!lazyChunks.has(path)) continue

            // get the source chunk to find its init exports
            const srcFileName = path.slice(2) // remove ./
            const srcChunk = bundle[srcFileName]
            if (!srcChunk || srcChunk.type !== 'chunk') continue
            const srcCode = srcChunk.code as string

            // find the init function export names
            // pattern: export{... f as n, ...} where f=INIT(()=>{...})
            const exportMatch = srcCode.match(/export\{([^}]+)\}/)
            if (!exportMatch) continue

            // find which var names are init functions (assigned via =INIT(()=>{
            const initVars = new Set<string>()
            const initRe = /(\w)=\w\(\(\)=>\{/g
            let im
            while ((im = initRe.exec(srcCode))) {
              initVars.add(im[1])
            }

            // map export aliases: "localVar as exportedName"
            const inits: string[] = []
            for (const part of exportMatch[1].split(',')) {
              const [local, exported] = part.trim().split(' as ')
              if (initVars.has(local.trim())) {
                inits.push(exported?.trim() || local.trim())
              }
            }

            if (!inits.length) continue

            // check which inits we already import
            const currentBindings = bindings.split(',').map((b) => {
              const parts = b.trim().split(' as ')
              return parts[0].trim()
            })

            const missingInits = inits.filter((i) => !currentBindings.includes(i))
            if (!missingInits.length) continue

            // add the init imports and call them
            const initAliases = missingInits.map((i, idx) => `${i} as _i${idx}`)
            const initCalls = missingInits.map((_, idx) => `_i${idx}()`).join(';')

            const newImport = full.replace(
              `{${bindings}}`,
              `{${bindings},${initAliases.join(',')}}`
            )

            code = code.replace(full, `${newImport};${initCalls};`)
            patched = true
          }

          if (patched) {
            ;(chunk as any).code = code
          }
        }
      },
    } as any,

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
