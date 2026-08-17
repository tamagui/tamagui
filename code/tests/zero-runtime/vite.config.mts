import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const entry = (name: string) => fileURLToPath(new URL(name, import.meta.url))

// One fixture, three builds. `zero` is the gate. `negative` deliberately keeps a
// runtime path the compiler cannot see, which is what proves the module-graph
// check can fail. `illegal` statically imports a declared island.
const inputs = {
  zero: 'index.html',
  full: 'index.html',
  negative: 'negative-control.html',
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
