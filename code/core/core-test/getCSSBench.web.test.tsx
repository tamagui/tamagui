// cost of config.getCSS(), the per-request SSR path (audit item 22). run with:
//   GETCSS_BENCH=1 TAMAGUI_TARGET=web npx vitest --run \
//     --config ../../packages/vite-plugin-internal/src/vite.config.ts \
//     getCSSBench.web.test.tsx
// numbers go in plans/v3-handoff-log.md; this never runs in the gate.

import { appendFileSync, writeFileSync } from 'node:fs'
import { expect, test } from 'vitest'

import { defaultConfig } from '@tamagui/config/v6'
import { createTamagui } from '../web/src'
import { getAllRules, updateRules } from '../web/src/helpers/insertStyleRule'

const LOG = process.env.GETCSS_BENCH_OUT || '/tmp/getcss-bench.txt'
const out = (line: string) => appendFileSync(LOG, `${line}\n`)

test.runIf(process.env.GETCSS_BENCH)('getCSS cost', { timeout: 120_000 }, () => {
  writeFileSync(LOG, '')
  const conf = createTamagui(defaultConfig as any) as any
  out(`themes: ${Object.keys(conf.themes).length}`)

  const coldStart = performance.now()
  const cold = conf.getCSS()
  out(`first request (cold): ${(performance.now() - coldStart).toFixed(3)} ms`)
  out(`css length: ${cold.length}`)

  const time = (name: string, fn: () => any, iterations = 200) => {
    for (let i = 0; i < 20; i++) fn()
    const start = performance.now()
    for (let i = 0; i < iterations; i++) fn()
    const elapsed = performance.now() - start
    out(`${name}: ${(elapsed / iterations).toFixed(3)} ms/op`)
    return elapsed / iterations
  }

  const full = time('getCSS() steady state', () => conf.getCSS())
  time('getCSS({exclude:"themes"})', () => conf.getCSS({ exclude: 'themes' }))
  time('getCSS({exclude:"design-system"})', () =>
    conf.getCSS({ exclude: 'design-system' })
  )
  time('getAllRules()', () => getAllRules())

  for (let i = 0; i < 2000; i++) {
    updateRules(`_bench${i}`, [`._bench${i}{opacity:${i / 2000}}`])
  }
  time('getAllRules() @2000 rules', () => getAllRules())
  time('getCSS() steady state @2000 rules', () => conf.getCSS())

  // what an SSR process actually pays across a burst of requests
  for (const requests of [1, 10, 100]) {
    const start = performance.now()
    for (let i = 0; i < requests; i++) conf.getCSS()
    out(`${requests} requests: ${(performance.now() - start).toFixed(2)} ms total`)
  }

  out(`rule count: ${getAllRules().length}`)
  expect(full).toBeGreaterThan(0)
})
