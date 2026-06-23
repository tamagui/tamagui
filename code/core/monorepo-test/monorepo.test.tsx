import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { expect, test } from 'vitest'

function runBaseline() {
  const start = Date.now()
  new Array(100_000).fill(0).map(() => {
    return JSON.stringify([].concat([]).concat([]).concat([]))
  })
  return Date.now() - start
}

function median(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

// warm up, then take median of 5 runs
runBaseline()
const baselines = Array.from({ length: 5 }, runBaseline)
const baseline = median(baselines)

console.info('baselines', baselines.join(', '), '→ median', baseline)

test('performance of types', { retry: 1, timeout: 5 * 60 * 1000 }, async () => {
  const out = execSync(`bun run typecheck --extendedDiagnostics || exit 0`, {
    cwd: join(__dirname, '..', '..'),
  }).toString()
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

  // threshold is somewhat loose because CI machines have variable load
  expect(slowdown).toBeLessThan(2.5)
})
