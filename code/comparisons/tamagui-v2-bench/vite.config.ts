import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { benchmarkAssertionAttributesPlugin } from '../shared/benchmarkAssertionAttributesPlugin'
import { bundleAttributionPlugin } from '../shared/bundleAttributionPlugin'

const extract = process.env.EXTRACT === '1'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    benchmarkAssertionAttributesPlugin(
      process.env.BENCH_STRIP_ASSERTION_ATTRIBUTES === '1'
    ),
    tamaguiPlugin({
      components: ['tamagui'],
      config: 'src/tamagui.config.ts',
      optimize: extract,
      disableExtraction: !extract,
    }),
    bundleAttributionPlugin(process.env.BUNDLE_ATTRIBUTION_FILE, import.meta.dirname),
  ],
  build:
    mode === 'size'
      ? {
          rollupOptions: {
            input: resolve(import.meta.dirname, 'size.html'),
            output: { entryFileNames: 'assets/index-[hash].js' },
          },
        }
      : undefined,
}))
