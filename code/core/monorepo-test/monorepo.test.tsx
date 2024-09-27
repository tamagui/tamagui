import { $ } from 'zx'

import { join } from 'node:path'
import { expect, test } from 'vitest'

let start = Date.now()
new Array(100_000).fill(0).map(() => {
  return JSON.stringify([].concat([]).concat([]).concat([]))
})

// on my m1 ~14ms
const baseline = Date.now() - start

console.info('baseline', baseline)

test(
  'performance of types',
  async () => {
    $.cwd = join(__dirname, '..', '..')
    $.verbose = false
    const out = (await $`yarn typecheck --extendedDiagnostics || exit 0`).stdout
    const [_, checkTime] = out.match(/Check time:\s+([^\s]+)/) ?? []
    const [seconds, ms] = checkTime.replace('s', '').split('.')

    const total = +seconds * 1000 + +ms * 10

    // uncached time to build the whole repo / time to run the baseline
    const initial = 2460 / 14

    // this should = 1 if its at baseline, 2 if 2x slower
    const slowdown = total / baseline / initial

    console.info(`\n\nTotal time: ${total}ms`)
    console.info(
      `${slowdown < 1 ? '🐇' : '🐢'} It is ${slowdown} slower than the baseline\n\n`
    )

    expect(slowdown).toBeLessThan(2)
  },
  {
    timeout: 5 * 60 * 1000,
    // it runs in parallel so we may be clogged doing other tests
    // ideally its on its own but this helps for now
    retry: 1,
  }
)
