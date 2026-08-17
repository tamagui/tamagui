import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const entry = (name: string) => fileURLToPath(new URL(name, import.meta.url))

// One fixture, several builds. `zero` is the gate. `negative` reaches the runtime
// through a dynamic import the compiler-local accounting cannot attribute, which
// is what proves the module-graph check can fail. `live` keeps a static design
// state read that erasure must refuse rather than delete. `illegal` statically
// imports a declared island.
const inputs = {
  zero: 'index.html',
  full: 'index.html',
  negative: 'negative-control.html',
  live: 'live-reference.html',
  illegal: 'illegal-static.html',
} as const

const fixture = (process.env.TAMAGUI_ZERO_FIXTURE || 'zero') as keyof typeof inputs

export default defineConfig({
  clearScreen: false,
  esbuild: { jsx: 'automatic' },
  plugins: [tamaguiPlugin()],
  build: {
    rollupOptions: { input: entry(inputs[fixture]) },
  },
})
