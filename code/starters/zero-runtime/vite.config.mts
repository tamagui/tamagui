import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const entry = (name: string) => fileURLToPath(new URL(name, import.meta.url))

// `TAMAGUI_ZERO_ISLANDS=0` builds the island-free entry, which is what
// qualifies base support. See tamagui.build.ts.
const withIslands = process.env.TAMAGUI_ZERO_ISLANDS !== '0'

export default defineConfig({
  clearScreen: false,
  esbuild: { jsx: 'automatic' },
  // Next publishes to `public/` in this project; serving it from Vite would let
  // one integration's output answer assertions about another's
  publicDir: false,
  plugins: [tamaguiPlugin()],
  build: {
    rollupOptions: {
      input: entry(withIslands ? 'index.html' : 'index.base.html'),
    },
  },
})
