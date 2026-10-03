// render-loop cost of the style split, refereeing hot-path changes
// (plans/dom-tailwind-flat-values.md, "Hot-path code rules"). run with:
//   RENDER_BENCH=1 TAMAGUI_TARGET=web npx vitest --run \
//     --config ../../packages/vite-plugin-internal/src/vite.config.ts \
//     renderLoopBench.web.test.tsx
// numbers are recorded in plans/v3-handoff-log.md; this never runs in the gate.

import { beforeAll, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

const cases: Record<string, Record<string, any>> = {
  'numbers only (plain path)': { width: 100, height: 100, opacity: 0.5 },
  'clause-free strings (base-only programs)': {
    backgroundColor: 'red',
    paddingTop: '10px',
    width: '100px',
  },
  'clause program (hover)': { backgroundColor: 'red hover:blue' },
  'transform numerics (family programs)': { x: 10, y: 20, scale: 2 },
}

test.runIf(process.env.RENDER_BENCH)('render-loop split cost', () => {
  const results: string[] = []
  for (const [name, props] of Object.entries(cases)) {
    // warmup fills the parse and lowered-program caches: steady-state is what
    // a render pays
    for (let index = 0; index < 2000; index++) simplifiedGetSplitStyles(View, props)
    const iterations = 20000
    const start = performance.now()
    for (let index = 0; index < iterations; index++) {
      simplifiedGetSplitStyles(View, props)
    }
    const elapsed = performance.now() - start
    results.push(`${name}: ${((elapsed / iterations) * 1e6).toFixed(0)} ns/op`)
  }
  console.info(`\n${results.join('\n')}\n`)
  expect(results.length).toBe(Object.keys(cases).length)
})
