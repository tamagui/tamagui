import { tamaguiPlugin } from '../../compiler/vite-plugin/dist/esm/index.mjs'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { benchmarkAssertionAttributesPlugin } from '../shared/benchmarkAssertionAttributesPlugin'
import { bundleAttributionPlugin } from '../shared/bundleAttributionPlugin'

const extract = process.env.EXTRACT === '1'
const outputCSS = process.env.BENCH_OUTPUT_CSS
const runtimeRoot =
  process.env.BENCH_RUNTIME_ROOT ||
  '/Users/n8/.worktrees/tamagui-v3-golf-p28910'

export default defineConfig({
  root: import.meta.dirname,
  resolve: {
    alias: [
      {
        find: /^@tamagui\/web\/(.+)$/,
        replacement: `${runtimeRoot}/code/core/web/dist/esm/$1.mjs`,
      },
      {
        find: /^@tamagui\/web$/,
        replacement: `${runtimeRoot}/code/core/web/dist/esm/index.mjs`,
      },
      {
        find: '@tamagui/style-grammar/runtime',
        replacement: `${runtimeRoot}/code/core/style-grammar/dist/esm/runtime.mjs`,
      },
      {
        find: /^tamagui$/,
        replacement: `${runtimeRoot}/code/ui/tamagui/dist/esm/index.mjs`,
      },
    ],
  },
  plugins: [
    outputCSS && {
      name: 'benchmark-global-css-import',
      enforce: 'pre',
      transform(code, id) {
        if (id === resolve(import.meta.dirname, 'src/index.tsx')) {
          return `import ${JSON.stringify(resolve(import.meta.dirname, outputCSS))}\n${code}`
        }
      },
    },
    react(),
    benchmarkAssertionAttributesPlugin(
      process.env.BENCH_STRIP_ASSERTION_ATTRIBUTES === '1'
    ),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      optimize: extract,
      disableExtraction: !extract,
      outputCSS,
    }),
    bundleAttributionPlugin(process.env.BUNDLE_ATTRIBUTION_FILE, import.meta.dirname),
  ],
})
