import { expect, test } from '@playwright/test'

/**
 * Mount profiler for the StressPage (~200 Tamagui components).
 *
 * Reloads the page RELOADS times (each a clean, deterministic full-tree MOUNT) and
 * records wall-clock mount time plus the internal @tamagui/timer breakdown
 * (getSplitStyles / createComponent checkpoints, incl. per-prop processing).
 *
 * Design notes:
 * - No client-side re-render/remount loop: repeatedly re-rendering this heavy tree
 *   under a profiler OOM-crashes the renderer. A full navigation is a fresh mount.
 * - No CDP HeapProfiler sampling: sampling the ~12 MB dev bundle's eval + this heavy
 *   mount destabilizes chromium under concurrent machine load. For a focused
 *   allocation profile run scripts/ manually on a quiet machine (the createComponent
 *   props-clone removal shows up there as fewer bytes/mount).
 *
 * Assertions replace the old `median > 0` no-op: every mount must complete, median
 * mount time must be under a generous gross-regression ceiling, and the per-prop
 * processing breakdown must be captured (proves the hot path actually ran).
 *
 * Run:
 *   PORT=9010 REUSE_SERVER=1 npx playwright test tests/StressPagePerf.test.tsx --project=default
 */

const RELOADS = 8

// generous gross-regression ceiling on median mount time (dev webpack is noisy;
// observed a few hundred ms). trips only on a large slowdown, never on variance.
const MOUNT_MS_CEILING = 2000

test('StressPage mount profiling', async ({ page }) => {
  // heavy: RELOADS full mounts of ~200 components in dev webpack
  test.setTimeout(150_000)

  const url = `/?theme=light&animationDriver=native&test=StressPage&profile=true`

  const times: number[] = []
  let lastBreakdown: Record<string, number> | null = null
  for (let i = 0; i < RELOADS; i++) {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => (window as any).__PERF_RESULT__, { timeout: 30_000 })
    const r = await page.evaluate(() => (window as any).__PERF_RESULT__)
    times.push(r.renderMs)
    if (r.breakdown) lastBreakdown = r.breakdown
  }

  const sorted = [...times].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  const mean = Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10

  // sum the per-prop checkpoints (the createComponent/getSplitStyles hot path)
  let propProcessingMs = 0
  const phases: [string, number][] = []
  if (lastBreakdown) {
    for (const [label, ms] of Object.entries(lastBreakdown)) {
      if (label.endsWith('(ignore)')) continue
      if (label.startsWith('before-prop-')) propProcessingMs += ms
      else phases.push([label, ms])
    }
    phases.push(['before-prop-* (all props)', propProcessingMs])
    phases.sort((a, b) => b[1] - a[1])
  }

  console.log(`\n=== StressPage Mount Profile (${RELOADS} full mounts) ===`)
  console.log(
    `  mount ms: median ${median} | mean ${mean} | min ${sorted[0]} | max ${sorted[sorted.length - 1]}`
  )
  if (phases.length) {
    console.log(`  --- internal timer breakdown (single mount) ---`)
    for (const [label, ms] of phases) {
      if (ms < 0.05) continue
      console.log(`  ${label.padStart(35)} | ${ms.toFixed(1)}ms`)
    }
  }
  console.log(`================================================\n`)

  // every mount completed and produced a result
  expect(times.length).toBe(RELOADS)
  expect(median).toBeGreaterThan(0)
  // gross slowdown guard
  expect(median).toBeLessThan(MOUNT_MS_CEILING)
  // the createComponent/getSplitStyles per-prop hot path actually executed + was measured
  expect(propProcessingMs).toBeGreaterThan(0)
})
