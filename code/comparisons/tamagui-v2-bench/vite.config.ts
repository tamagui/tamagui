import { tamaguiPlugin } from '@tamagui/vite-plugin'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { benchmarkAssertionAttributesPlugin } from '../shared/benchmarkAssertionAttributesPlugin'
import { bundleAttributionPlugin } from '../shared/bundleAttributionPlugin'
import { bundleTopLevelReplacementPlugin } from '../shared/bundleTopLevelReplacementPlugin'

const extract = process.env.EXTRACT === '1'
const checkpointInputs: Record<string, string> = {
  'baseline-styled-view': 'baseline-styled-view.html',
}

export default defineConfig(({ mode }) => ({
  define: process.env.BUNDLE_AUDIT_DEFINE_DEFAULTS
    ? {
        'process.env.TAMAGUI_DID_OUTPUT_CSS': JSON.stringify(''),
        'process.env.TAMAGUI_DYNAMIC_COLOR_IOS': JSON.stringify(''),
        'process.env.TAMAGUI_IS_CORE_NODE': JSON.stringify(''),
      }
    : undefined,
  plugins: [
    bundleTopLevelReplacementPlugin(),
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
    mode === 'size' || checkpointInputs[mode]
      ? {
          modulePreload: checkpointInputs[mode] ? false : undefined,
          rollupOptions: {
            input: resolve(import.meta.dirname, checkpointInputs[mode] ?? 'size.html'),
            external: checkpointInputs[mode]
              ? ['react', 'react/jsx-runtime', 'react-dom/client']
              : undefined,
            output: { entryFileNames: 'assets/index-[hash].js' },
          },
        }
      : undefined,
}))
