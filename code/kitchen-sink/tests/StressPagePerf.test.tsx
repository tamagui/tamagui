import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Performance profiling test for the StressPage.
 *
 * Measures render time of a diverse page with ~200+ Tamagui components.
 * Captures both wall-clock render time (performance.mark/measure) and
 * internal @tamagui/timer breakdown (getSplitStyles, createComponent checkpoints).
 *
 * Run:
 *   npx playwright test tests/StressPagePerf.test.tsx --project=default
 */

const RUNS = 10

test('StressPage render profiling', async ({ page }) => {
  const times: number[] = []
  let lastBreakdown: Record<string, number> | null = null

  for (let i = 0; i < RUNS; i++) {
    await setupPage(page, {
      name: 'StressPage',
      type: 'useCase',
      searchParams: { profile: 'true' },
    })

    await page.waitForFunction(() => (window as any).__PERF_RESULT__, {
      timeout: 10_000,
    })

    const result = await page.evaluate(() => (window as any).__PERF_RESULT__)
    times.push(result.renderMs)
    if (result.breakdown) {
      lastBreakdown = result.breakdown
    }
  }

  const sorted = [...times].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)]
  const mean = Math.round((times.reduce((a, b) => a + b, 0) / times.length) * 10) / 10
  const min = sorted[0]
  const max = sorted[sorted.length - 1]
  const trimmed = sorted.slice(1, -1)
  const trimmedMean =
    Math.round((trimmed.reduce((a, b) => a + b, 0) / trimmed.length) * 10) / 10

  console.log(`\n=== StressPage Render Profile (${RUNS} runs) ===`)
  console.log(`  All: ${times.map((t) => t.toFixed(1) + 'ms').join(', ')}`)
  console.log(`  Mean: ${mean}ms | Trimmed Mean: ${trimmedMean}ms | Median: ${median}ms`)
  console.log(`  Min: ${min}ms | Max: ${max}ms`)

  if (lastBreakdown) {
    console.log(`\n  --- Internal Breakdown (last run) ---`)
    let propTotal = 0
    const entries = Object.entries(lastBreakdown).filter(([k]) => !k.endsWith('(ignore)'))
    const phases: [string, number][] = []
    for (const [label, totalMs] of entries) {
      if (label.startsWith('before-prop-')) {
        propTotal += totalMs
      } else {
        phases.push([label, totalMs])
      }
    }
    phases.push(['before-prop-* (all props)', propTotal])
    phases.sort((a, b) => b[1] - a[1])
    for (const [label, totalMs] of phases) {
      if (totalMs < 0.05) continue
      console.log(`  ${label.padStart(35)} | ${totalMs.toFixed(1)}ms`)
    }
  }

  console.log(`================================================\n`)

  expect(median).toBeGreaterThan(0)
})
