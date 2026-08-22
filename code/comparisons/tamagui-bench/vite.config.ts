import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { benchmarkAssertionAttributesPlugin } from '../shared/benchmarkAssertionAttributesPlugin'
import { bundleAttributionPlugin } from '../shared/bundleAttributionPlugin'

const extract = process.env.EXTRACT === '1'
const outputCSS = process.env.BENCH_OUTPUT_CSS
const webRuntimeFeatures =
  extract || process.env.BENCH_RUNTIME_FEATURES === 'full'
    ? undefined
    : {
        inlineThemeValues: false,
        styleValueGrammar: false,
        safeArea: false,
      }

export default defineConfig({
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
      experimental: webRuntimeFeatures ? { webRuntimeFeatures } : undefined,
    }),
    bundleAttributionPlugin(process.env.BUNDLE_ATTRIBUTION_FILE, import.meta.dirname),
  ],
})
