import { $ } from 'zx'

import { join } from 'path'
import { expect, test } from 'vitest'

let start = Date.now()
new Array(100_000).fill(0).map(() => {
  return JSON.stringify([].concat([]).concat([]).concat([]))
})

// on my m1 ~14ms
const baseline = Date.now() - start

test('performance of types', async () => {      
  $.cwd = join(__dirname, '..', '..')
  const out = (await $`yarn typecheck --extendedDiagnostics`).stdout
  const [_, checkTime] = out.match(/Check time:\s+([^\s]+)/) ?? []
  const [seconds, ms] = checkTime.replace('s', '').split('.')

  // on my m1 ~2650ms
  const total = (+seconds * 1000) + (+ms * 10)

  // 2650/14 = ~189

  // this should = 1 if its at baseline, 2 if 2x slower
  const slowdown = total / baseline / 189
  
  expect(slowdown).toBeLessThan(1.5)
}, 40_000)
