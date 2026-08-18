import { tamaguiPlugin } from '@tamagui/vite-plugin'
import { unlinkSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'

const entry = (name: string) => fileURLToPath(new URL(name, import.meta.url))

// One fixture, several builds. `zero` is the gate. `negative` reaches the runtime
// through a dynamic import the compiler-local accounting cannot attribute, which
// is what proves the module-graph check can fail. `live` keeps a static design
// state read that erasure must refuse rather than delete. `illegal` statically
// imports a declared island. `zero-no-html` builds the zero entry module directly,
// so the plugin's own stylesheet link is never injected.
//
// The `global*` builds are the compiled-global-CSS tier: ordinary compiled
// Tamagui with an owned outputCSS artifact.
const inputs = {
  zero: 'index.html',
  'zero-no-html': 'src/main.tsx',
  full: 'index.html',
  negative: 'negative-control.html',
  live: 'live-reference.html',
  illegal: 'illegal-static.html',
  global: 'global.html',
  'global-unimported': 'global-unimported.html',
  'global-missing': 'global.html',
  'global-stale': 'global.html',
} as const

const fixture = (process.env.TAMAGUI_ZERO_FIXTURE || 'zero') as keyof typeof inputs

const artifact = entry('.tamagui/global/tamagui-global.css')

/**
 * The adversary for the missing and stale controls.
 *
 * It puts the build into the exact state the artifact-ownership check exists to
 * catch, after the artifact has been generated and before the check runs. Both
 * states are reachable in a real project: an artifact that was never generated
 * or was cleaned, and one whose bytes no longer match the build's config.
 */
const artifactAdversary = (mode: 'missing' | 'stale'): Plugin => ({
  name: 'fixture-artifact-adversary',
  apply: 'build',
  generateBundle: {
    // tamagui-global-css is enforce: 'post', so an unenforced hook runs first
    order: 'pre',
    handler() {
      if (mode === 'missing') unlinkSync(artifact)
      else writeFileSync(artifact, ':root{--fixture-stale:1}\n')
    },
  },
})

export default defineConfig({
  clearScreen: false,
  esbuild: { jsx: 'automatic' },
  // `public/` is Next's publish directory in this fixture. Serving it from the
  // Vite dev server would let Next's build output answer assertions about what
  // Vite itself produced, which is how two integrations sharing one fixture
  // silently describe each other's builds.
  publicDir: false,
  plugins: [
    tamaguiPlugin(),
    ...(fixture === 'global-missing' ? [artifactAdversary('missing')] : []),
    ...(fixture === 'global-stale' ? [artifactAdversary('stale')] : []),
  ],
  build: {
    rollupOptions: { input: entry(inputs[fixture]) },
  },
})
