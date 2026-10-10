import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { resolve as pathResolve } from 'node:path'
import { tamaguiPlugin, tamaguiAliases } from '@tamagui/vite-plugin'
import { one } from 'one/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import type { UserConfig } from 'vite'
import { redirects } from './redirects'

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
const staticDist = pathResolve(
  import.meta.dirname,
  '../compiler/static/dist/cjs/index.cjs'
)

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

// use createRequire instead of import.meta.resolve for bun compatibility in vite config
const require = createRequire(import.meta.url)
const resolve = (path: string) => {
  return require.resolve(path)
}

const include = [
  // pre-bundle common web deps to avoid mid-navigation optimization in dev mode
  'react-native',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'swr/mutation',
  '@vxrn/mdx-rust/client',
  // core tamagui packages must be pre-bundled together to avoid duplicate instances
  'tamagui',
  '@tamagui/core',
  '@tamagui/web',
  // existing
  'secure-json-parse',
  '@docsearch/react',
  '@leeoniya/ufuzzy',
  '@github/mini-throttle',
  'swr',
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
  'react-native-reanimated',
  'react-native-gesture-handler',
  '@tanstack/react-table',
  '@tamagui/focus-scope',
  'react-dropzone',
]

export default {
  server: {
    fs: {
      allow: ['..'],
    },
  },

  build: {
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        // fix non-deterministic __esm init ordering bug
        // https://github.com/rolldown/rolldown/issues/3143
        strictExecutionOrder: true,
        // the tamagui packages are shared by every route; left alone, rolldown
        // parks them in the biggest lazy route (bento) and every page then
        // downloads that whole route, reanimated and demos included
        codeSplitting: {
          groups: [{ name: 'tamagui', test: /[\\/]code[\\/](core|ui)[\\/]/ }],
        },
      },
    },
  },

  resolve: {
    preserveSymlinks: false,

    alias: [
      // One's SSR navigation fork imports these internal contexts directly.
      // Resolve them to files so Vite does not reject the package's public-only exports map.
      {
        find: /^@react-navigation\/core\/lib\/module\/(.+)$/,
        replacement: `${pathResolve(
          resolve('@react-navigation/core/package.json'),
          '../lib/module'
        )}/$1.js`,
      },
      // Standard string-based aliases
      {
        find: /^~\//,
        replacement: `${import.meta.dirname}/`,
      },
      // resolves to @tamagui/react-native-svg's esm entry. aliasing to the bare
      // package name instead leaves the cjs entry reachable, and vite serves
      // that file to the browser as-is, where its named exports do not exist.
      ...tamaguiAliases({ svg: true }),

      {
        find: 'react-native/Libraries/Core/ReactNativeVersion',
        replacement: resolve('@tamagui/proxy-worm'),
      },
      ...(process.env.RNW_LITE
        ? tamaguiAliases({
            rnwLite: true,
          })
        : []),
    ],

    dedupe: ['react', 'react-dom', 'react-native', 'react-native-web', ...include],
  },

  optimizeDeps: {
    include,
    // expo publishes this entry as TypeScript, which the dependency scanner parses as JavaScript
    exclude: ['expo-image-picker'],
  },

  ssr: {
    external: ['@vxrn/mdx-rust', 'satteri', 'satteri-expressive-code', 'ws'],
    noExternal: true,
  },

  plugins: [
    // vxrn aliases `react-native` to require.resolve('react-native-web'), which is
    // the package `main`: a CJS bundle nothing can tree-shake. one
    // `useWindowDimensions` import then pulls all 274kb of react-native-web into
    // every page. vite's alias plugin runs ahead of every user plugin, so catch
    // the already-resolved cjs entry and send it to the esm build instead.
    {
      name: 'react-native-web-esm',
      enforce: 'pre',
      resolveId(id: string) {
        if (id.endsWith('/react-native-web/dist/cjs/index.js')) {
          return resolve('react-native-web/dist/index.js')
        }
      },
    },

    tamaguiPlugin({
      // see tamagui.build.ts
      disable: process.env.NODE_ENV !== 'production',
    }),

    one({
      native: false,

      config: {
        // The repo tsconfig contains declaration-only package mappings that
        // must not override runtime package exports.
        tsConfigPaths: false,
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

      web: {
        skewProtection: 'proactive',
        experimental_scriptLoading: 'after-lcp-aggressive',
        redirects,
        // one build writes dist/client/sitemap.xml from the same route list
        // it renders. versioned component urls stay reachable but only the
        // latest is indexed; /bento/* and /theme/* are client-rendered shell
        // pseudo-paths, and /demo/* and /draft are not site content.
        sitemap: {
          baseUrl: 'https://tamagui.dev',
          exclude: [
            '/draft',
            '/demo/*',
            '/bento/*',
            '/theme/*',
            '/ui/*/*',
            '/styled-ui/*/*',
            '/tailwind-ui/*/*',
          ],
        },
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
